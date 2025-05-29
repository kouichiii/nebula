import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
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
  console.log('🚀 Starting seed...');

  // First, delete existing data
  console.log('Cleaning up existing data...');
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.mainCategory.deleteMany();
  await prisma.user.deleteMany();

  // Load seed data
  const usersPath = path.join(__dirname, 'seed-data', 'users.json');
  const articlesPath = path.join(__dirname, 'seed-data', 'articles.json');
  const categoriesPath = path.join(__dirname, 'seed-data', 'categories.json');

  const [usersData, articlesData, categoriesData] = await Promise.all([
    fs.readFile(usersPath, 'utf-8'),
    fs.readFile(articlesPath, 'utf-8'),
    fs.readFile(categoriesPath, 'utf-8'),
  ]);

  // Parse JSON data
  const users = JSON.parse(usersData);
  const articles = JSON.parse(articlesData);
  const categories = JSON.parse(categoriesData);

  // Create categories
  console.log('Creating categories...');
  const categoryMap: Record<string, string> = {};
  for (const category of categories) {
    const main = await prisma.mainCategory.create({
      data: { name: category.main },
    });

    for (const sub of category.subs) {
      const created = await prisma.category.create({
        data: {
          name: sub,
          mainCategoryId: main.id,
        },
      });
      categoryMap[sub] = created.id;
    }
  }

  // Create users - エラーハンドリングを改善
  console.log('Creating users...');
  const userMap: Record<string, string> = {};
  
  // Supabase認証をチェック
  let supabaseAuthAvailable = true;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('⚠️ Supabaseの認証に問題があります。ダミーユーザーのみを作成します:', error.message);
      supabaseAuthAvailable = false;
    }
  } catch (error) {
    console.warn('⚠️ Supabase認証のチェックに失敗しました。ダミーユーザーのみを作成します:', error);
    supabaseAuthAvailable = false;
  }

  for (const user of users) {
    try {
      let userId: string;
      
      if (supabaseAuthAvailable) {
        // Supabase認証が利用可能な場合、通常通りユーザーを作成
        const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        });

        if (signUpError) {
          console.warn(`⚠️ Supabaseユーザー作成中にエラーが発生 ${user.email}:`, signUpError.message);
          // 代替手段としてランダムIDを生成
          userId = crypto.randomUUID();
        } else {
          userId = authData.user?.id || crypto.randomUUID();
        }
      } else {
        // Supabase認証が使えない場合、ランダムIDでダミーユーザーを作成
        userId = crypto.randomUUID();
      }

      // Prismaでユーザーを作成
      const createdUser = await prisma.user.create({
        data: {
          id: userId,
          name: user.name,
          email: user.email,
        },
      });

      userMap[user.email] = createdUser.id;
      console.log(`✅ Created user: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error);
    }
  }

  // Create articles - エラーハンドリングを改善
  console.log('Creating articles...');
  for (const article of articles) {
    try {
      const userId = userMap[article.authorEmail];
      const categoryId = categoryMap[article.category];

      if (!userId) {
        console.error(`❌ No user found for email: ${article.authorEmail}`);
        // ユーザーがない場合はスキップせず、最初のユーザーを使用
        const fallbackUserId = Object.values(userMap)[0];
        if (!fallbackUserId) {
          console.error('❌ No fallback user available');
          continue;
        }
        console.log(`ℹ️ Using fallback user for article: ${article.title}`);
        
        const fileName = `articles/${Date.now()}_${Math.random().toString(36).slice(2)}.txt`;
        const contentBuffer = Buffer.from(article.content, 'utf-8');

        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(fileName, contentBuffer, {
            contentType: 'text/plain',
            upsert: true,
          });

        if (uploadError) {
          console.error('❌ Failed to upload article content:', uploadError);
          continue;
        }

        await prisma.article.create({
          data: {
            title: article.title,
            excerpt: article.excerpt,
            storagePath: fileName,
            userId: fallbackUserId,
            categoryId,
            tags: article.tags || [],
          },
        });

        console.log(`✅ Created article: ${article.title}`);
      } else {
        const fileName = `articles/${Date.now()}_${Math.random().toString(36).slice(2)}.txt`;
        const contentBuffer = Buffer.from(article.content, 'utf-8');

        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(fileName, contentBuffer, {
            contentType: 'text/plain',
            upsert: true,
          });

        if (uploadError) {
          console.error('❌ Failed to upload article content:', uploadError);
          continue;
        }

        await prisma.article.create({
          data: {
            title: article.title,
            excerpt: article.excerpt,
            storagePath: fileName,
            userId,
            categoryId,
            tags: article.tags || [],
          },
        });

        console.log(`✅ Created article: ${article.title}`);
      }
    } catch (error) {
      console.error(`❌ Error creating article ${article.title}:`, error);
    }
  }

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
