import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const userId = await supabase.auth.getUser()
      .then(({ data }) => data.user?.id);
      
    if (!userId) {
      return NextResponse.json(
        { message: 'ログインが必要です' },
        { status: 401 }
      );
    }

    const { id: articleId } = params;

    // 記事の存在確認
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json(
        { message: '記事が見つかりません' },
        { status: 404 }
      );
    }

    // いいねの存在確認
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: userId,
          articleId,
        },
      },
    });

    if (existingLike) {
      // いいね解除
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      const likeCount = await prisma.like.count({
        where: { articleId },
      });

      return NextResponse.json({ liked: false, count: likeCount });
    }

    // いいね追加
    await prisma.like.create({
      data: {
        userId: userId,
        articleId,
      },
    });

    const likeCount = await prisma.like.count({
      where: { articleId },
    });

    return NextResponse.json({ liked: true, count: likeCount });
  } catch (error) {
    console.error('Like Error:', error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}