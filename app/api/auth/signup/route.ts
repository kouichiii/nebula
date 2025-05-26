import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Supabaseで新規ユーザー登録
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (signUpError) {
      return NextResponse.json(
        { message: '登録に失敗しました: ' + signUpError.message },
        { status: 400 }
      );
    }

    // ユーザーデータをPrismaデータベースに保存
    await prisma.user.create({
      data: {
        id: authData.user!.id,
        email: email,
        name: username,
      },
    });

    return NextResponse.json(
      { message: '登録が完了しました' },
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