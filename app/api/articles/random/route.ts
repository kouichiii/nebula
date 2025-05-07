import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// app/api/articles/route.ts
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const offset = parseInt(searchParams.get('offset') || '0');
  
    try {
      const articles = await prisma.article.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          excerpt: true,
          tags: true,
          mongoId: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              iconUrl: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      });
  
      return NextResponse.json(articles);
    } catch (err) {
      console.error('記事取得エラー:', err);
      return NextResponse.json({ message: '記事取得に失敗しました' }, { status: 500 });
    }
  }
  