import supabase from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'すべて入力してください' }, { status: 400 });
    }
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      console.error('Supabase signIn error:', error);
      return NextResponse.json({ message: 'ログインに失敗しました' }, { status: 401 });
    }

    return NextResponse.json(
      { message: 'ログインに成功しました', user: data.user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'ログイン中にエラーが発生しました' }, { status: 500 });
  }
}
