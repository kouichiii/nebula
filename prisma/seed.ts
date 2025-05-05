import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 既存のデータを削除
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // カテゴリーの作成
  const webDevCategory = await prisma.category.create({
    data: {
      name: 'Web開発',
    },
  });

  const designCategory = await prisma.category.create({
    data: {
      name: 'デザイン',
    },
  });

  const mlCategory = await prisma.category.create({
    data: {
      name: '機械学習',
    },
  });

  // テストユーザーの作成
  const hashedPassword = await hash('password123', 12);
  const testUser = await prisma.user.create({
    data: {
      name: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  // サンプル記事の作成
  await prisma.article.create({
    data: {
      title: 'Next.jsの始め方',
      excerpt: 'Next.jsを使用してモダンなWebアプリケーションを構築する方法を解説します。',
      content: 'Next.jsは、Reactベースのフレームワークで...',
      userId: testUser.id,
      categoryId: webDevCategory.id,
      mongoId: '681874d43f2460ed93060920',
    },
  });

  await prisma.article.create({
    data: {
      title: 'UIデザインの基本原則',
      excerpt: '効果的なUIデザインを作成するための重要な原則を紹介します。',
      content: '良いUIデザインは、ユーザー体験を向上させる...',
      userId: testUser.id,
      categoryId: designCategory.id,
      mongoId: '681874d43f2460ed9306091f',
    },
  });

  await prisma.article.create({
    data: {
      title: '機械学習入門',
      excerpt: '機械学習の基礎から実践まで、わかりやすく解説します。',
      content: '機械学習は、データから学習し、予測や判断を行う...',
      userId: testUser.id,
      categoryId: mlCategory.id,
      mongoId: '681874d43f2460ed93060921',
    },
  });

  // デフォルトのカテゴリーを作成
  const defaultCategory = await prisma.category.create({
    data: {
      name: '未分類',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 