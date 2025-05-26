import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

// GET: 現在のユーザー情報を取得
export async function GET() {
  try {
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

    if (!user) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile GET Error:', error);
    return NextResponse.json({ message: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

// PUT: ユーザー情報を更新
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

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

    if (iconUrl && !isValidUrl(iconUrl)) {
      return NextResponse.json({ message: '不正なURLです' }, { status: 400 });
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

// URLバリデーション用のヘルパー関数
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
