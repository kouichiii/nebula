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

  // Create users
  console.log('Creating users...');
  const userMap: Record<string, string> = {};
  for (const user of users) {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (signUpError) {
        console.error(`❌ Failed to create Supabase user ${user.email}:`, signUpError);
        continue;
      }

      if (!authData.user) {
        console.error(`❌ No user data returned for ${user.email}`);
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
      console.log(`✅ Created user: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error);
    }
  }

  // Create articles
  console.log('Creating articles...');
  for (const article of articles) {
    try {
      const userId = userMap[article.authorEmail];
      const categoryId = categoryMap[article.category];

      if (!userId) {
        console.error(`❌ No user found for email: ${article.authorEmail}`);
        continue;
      }

      if (!categoryId) {
        console.error(`❌ No category found: ${article.category}`);
        continue;
      }

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
