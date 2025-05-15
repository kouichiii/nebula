import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(req: Request) {
  try {
    const { title, excerpt, content, categoryId, tags } = await req.json();
    if (!title || !content || !categoryId) {
      return NextResponse.json({ message: '必要な項目が足りません' }, { status: 400 });
    }

    await client.connect();
    const db = client.db('nebula');
    const mongoResult = await db.collection('articles').insertOne({
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'ユーザーが認証されていません' }, { status: 401 });
    }

    const rdbArticle = await prisma.article.create({
      data: {
        title,
        excerpt,
        categoryId,
        tags,
        mongoId: mongoResult.insertedId.toString(),
        userId,
      },
    });

    return NextResponse.json({ id: rdbArticle.id }, { status: 201 });
  } catch (err) {
    console.error('記事投稿エラー:', err);
    return NextResponse.json({ message: '投稿に失敗したちゃむ' }, { status: 500 });
  } finally {
    await client.close();
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
