import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      iconUrl: true,
      bio: true,
    },
  });

  return NextResponse.json({
    message: 'Authenticated',
    user: profile,
  });
}

export async function PUT(req: Request) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const userId = await supabase.auth.getUser()
      .then(({ data }) => data.user?.id);

    if (!userId) {
      return NextResponse.json({ message: '未認証です' }, { status: 401 });
    }

    const { name, iconUrl, bio } = await req.json();

    // バリデーション
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ message: '名前は必須です' }, { status: 400 });
    }

    if (name.length > 50) {
      return NextResponse.json({ message: '名前は50文字以内で入力してください' }, { status: 400 });
    }

    if (bio && bio.length > 1000) {
      return NextResponse.json({ message: 'プロフィールは1000文字以内で入力してください' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        iconUrl,
        bio: bio?.trim(),
      },
      select: {
        name: true,
        iconUrl: true,
        bio: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Profile PUT Error:', error);
    return NextResponse.json({ message: 'プロフィールの更新に失敗しました' }, { status: 500 });
  }
}

