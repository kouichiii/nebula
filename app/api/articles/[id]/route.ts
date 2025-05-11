import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        excerpt: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            iconUrl: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { message: '記事が見つかりませんでした。' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('記事取得エラー:', error);
    return NextResponse.json(
      { message: '記事取得中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}
