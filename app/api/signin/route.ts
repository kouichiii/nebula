import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'すべて入力してください' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 401 });
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: 'パスワードが間違っています' }, { status: 401 });
    }
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      iconUrl: user.iconUrl,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'ログイン中にエラーが発生しました' }, { status: 500 });
  }
}
