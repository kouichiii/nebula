import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'ユーザーが認証されていません' }, { status: 401 });
    }

    const { title, excerpt, content, categoryId, tags } = await req.json();
    if (!title || !content || !categoryId) {
      return NextResponse.json({ message: '必要な項目が足りません' }, { status: 400 });
    }

    const fileName = `articles/${Date.now()}_${Math.random().toString(36).slice(2)}.txt`;
    const contentBuffer = Buffer.from(content, 'utf-8');

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

    const created = await prisma.article.create({
      data: {
        title: title,
        excerpt: excerpt,
        storagePath: fileName,
        userId: userId,
        categoryId: categoryId,
        tags: tags || [],
      },
    });
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (err) {
    console.error('記事投稿エラー:', err);
    return NextResponse.json({ message: '投稿に失敗したちゃむ' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const categoryId = searchParams.get('categoryId')?.trim() || ''

  // ← ここを追加
  console.log("[API] /api/articles called");
  console.log("  q          =", JSON.stringify(q));
  console.log("  categoryId =", JSON.stringify(categoryId));

  // キーワード検索条件
  const keywordWhere: any = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ]
      }
    : {}

  // カテゴリ検索条件
  const categoryWhere: any = categoryId
    ? {
        categoryId: categoryId,
      }
    : {}

  // AND条件で結合
  const where: any = 
    q || categoryId
      ? { AND: [keywordWhere, categoryWhere].filter(clause => Object.keys(clause).length > 0) }
      : {};

  console.log("  prisma.where =", JSON.stringify(where, null, 2));
  // ← ここまで

  try {
    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        excerpt: true,
        tags: true,
        storagePath: true,
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
