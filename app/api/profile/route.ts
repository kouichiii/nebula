import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

// GET: 現在のユーザー情報を取得
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: '未認証です' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      iconUrl: true,
      bio: true,
    },
  });

  return NextResponse.json(user);
}

// PUT: ユーザー情報を更新
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: '未認証です' }, { status: 401 });
  }

  const { name, iconUrl, bio } = await req.json();

  if (!name) {
    return NextResponse.json({ message: '名前は必須です' }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      iconUrl,
      bio,
    },
    select: {
      name: true,
      iconUrl: true,
      bio: true,
    },
  });
  
  return NextResponse.json(updated);
}
