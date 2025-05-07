import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const mongoClient = new MongoClient(process.env.MONGODB_URI!);

async function main() {
  // 既存データ削除
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  await mongoClient.connect();
  const db = mongoClient.db('nebula');
  const articleCollection = db.collection('articles');

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
    const hashedPassword = await hash(user.password, 12);
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
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

  // 記事作成（MongoDB + Prisma）
  for (const article of articles) {
    const mongoRes = await articleCollection.insertOne({
      content: article.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await prisma.article.create({
      data: {
        title: article.title,
        excerpt: article.excerpt,
        mongoId: mongoRes.insertedId.toString(),
        userId: userMap[article.authorEmail],
        categoryId: categoryMap[article.category],
        tags: article.tags || [],
      },
    });
  }

  console.log(`✅ Users: ${users.length}, Articles: ${articles.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await mongoClient.close();
    await prisma.$disconnect();
  });
