import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { username, email, password} = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: 'すべての項目を入力してください' },
        { status: 400 }
      );
    }

    // Supabaseでユーザー登録（パスワードは自動的にハッシュ化される）
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (!authData || !authData.user) {
      console.error('Signup error:', authError);
      return NextResponse.json(
        { message: '登録に失敗しました' },
        { status: 400 }
      );
    }
    const res = await prisma.user.create({
      data: {
        id: authData.user.id,
        name: username,
        email: email,
        iconUrl: '',
        bio: '',
      },
    });

    if (authError) {
      console.error('Signup error:', authError);
      return NextResponse.json(
        { message: '登録に失敗しました' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: '登録が完了しました', user: authData.user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}