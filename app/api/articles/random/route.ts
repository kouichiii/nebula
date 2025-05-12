import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// app/api/articles/random/route.ts
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get('take') || '5');
    const skip = parseInt(searchParams.get('skip') || '0');
  
    try {
      const articles = await prisma.$queryRawUnsafe<
        {
          id: string;
          title: string;
          excerpt: string;
          createdAt: Date;
          mongoId: string;
          userId: string;
          categoryId: string;
        }[]
      >(
        `SELECT "id", "title", "excerpt", "createdAt", "mongoId", "userId", "categoryId"
        FROM "Article"
        ORDER BY RANDOM()
        LIMIT ${take}`
      );

      const enriched = await Promise.all(
        articles.map(async (article) => {
          const [user, category] = await Promise.all([
            prisma.user.findUnique({
              where: { id: article.userId },
              select: { name: true, iconUrl: true },
            }),
            prisma.category.findUnique({
              where: { id: article.categoryId },
              select: { name: true },
            }),
          ]);

          return {
            ...article,
            user,
            category,
          };
        })
      );

      return NextResponse.json(enriched);
    } catch (err) {
      console.error('記事取得エラー:', err);
      return NextResponse.json({ message: '記事取得に失敗しました' }, { status: 500 });
    }
  }
  