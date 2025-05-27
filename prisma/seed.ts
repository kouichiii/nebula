import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // JSON読み込み
  const usersPath = path.join(__dirname, 'seed-data', 'users.json');
  const articlesPath = path.join(__dirname, 'seed-data', 'articles.json');
  const categoriesPath = path.join(__dirname, 'seed-data', 'categories.json');

  const [usersData, articlesData, categoriesData] = await Promise.all([
    fs.readFile(usersPath, 'utf-8'),
    fs.readFile(articlesPath, 'utf-8'),
    fs.readFile(categoriesPath, 'utf-8'),
  ]);

  const users = JSON.parse(usersData) as {
    name: string;
    email: string;
    password: string;
  }[];

  const articles = JSON.parse(articlesData) as {
    title: string;
    excerpt: string;
    content: string;
    category: string; // 小カテゴリ名
    authorEmail: string;
    tags?: string[];
  }[];

  const categories = JSON.parse(categoriesData) as {
    main: string;
    subs: string[];
  }[];

  // 削除（順序に注意）
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.mainCategory.deleteMany();
  await prisma.user.deleteMany();

  // カテゴリ登録
  const categoryMap: Record<string, string> = {};

  for (const category of categories) {
    const main = await prisma.mainCategory.create({
      data: { name: category.main },
    });

    for (const sub of category.subs) {
      const category = await prisma.category.create({
        data: {
          name: sub,
          mainCategoryId: main.id,
        },
      });
      categoryMap[sub] = category.id;
    }
  }

  // ユーザー登録
  const userMap: Record<string, string> = {};

  for (const user of users) {
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (signUpError || !authData.user) {
      console.error('❌ Supabase User Creation Error:', signUpError);
      continue;
    }

    const createdUser = await prisma.user.create({
      data: {
        id: authData.user.id,
        name: user.name,
        email: user.email,
      },
    });

    userMap[user.email] = createdUser.id;
  }

  // 記事登録
  for (const article of articles) {
    const fileName = `articles/${Date.now()}_${Math.random().toString(36).slice(2)}.txt`;
    const contentBuffer = Buffer.from(article.content, 'utf-8');

    const { error: uploadError } = await supabase.storage
      .from('articles')
      .upload(fileName, contentBuffer, {
        contentType: 'text/plain',
        upsert: true,
      });

    if (uploadError) {
      console.error('❌ Upload Error:', uploadError);
      continue;
    }

    await prisma.article.create({
      data: {
        title: article.title,
        excerpt: article.excerpt,
        storagePath: fileName,
        userId: userMap[article.authorEmail],
        categoryId: categoryMap[article.category],
        tags: article.tags || [],
      },
    });
  }

  console.log(`✅ Seed completed: ${users.length} users, ${articles.length} articles`);
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
