import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config(); // ← 必須！

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // 既存データ削除
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // JSON 読み込み
  const usersPath = path.join(__dirname, 'seed-data', 'users.json');
  const articlesPath = path.join(__dirname, 'seed-data', 'articles.json');

  const usersData = await fs.readFile(usersPath, 'utf-8');
  const articlesData = await fs.readFile(articlesPath, 'utf-8');

  const users = JSON.parse(usersData) as {
    name: string;
    email: string;
    password: string;
  }[];

  const articles = JSON.parse(articlesData) as {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    authorEmail: string;
    tags?: string[];
  }[];

  // ユーザー作成
  const userMap: Record<string, string> = {};
  for (const user of users) {
    // まずSupabaseでユーザーを作成
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true
    });

    if (signUpError || !authData.user) {
      console.error('❌ Supabase User Creation Error:', signUpError);
      continue;
    }

    // 次にPrismaでユーザーを作成
    const createdUser = await prisma.user.create({
      data: {
        id: authData.user.id,
        name: user.name,
        email: user.email,
      },
    });
    userMap[user.email] = createdUser.id;
  }

  // カテゴリ収集・作成
  const uniqueCategories = Array.from(new Set(articles.map((a) => a.category)));
  const categoryMap: Record<string, string> = {};
  for (const category of uniqueCategories) {
    const createdCategory = await prisma.category.create({
      data: { name: category },
    });
    categoryMap[category] = createdCategory.id;
  }

  // 記事作成
  for (const article of articles) {
    const fileName = `articles/${Date.now()}_${Math.random().toString(36).slice(2)}.txt`;
    const contentBuffer = Buffer.from(article.content, 'utf-8');

    const { error } = await supabase.storage
      .from('articles')
      .upload(fileName, contentBuffer, {
        contentType: 'text/plain',
        upsert: true,
      });

    if (error) {
      console.error('❌ Upload Error:', error);
      throw error;
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
    console.log(`✅ Users: ${users.length}, Articles: ${articles.length}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
