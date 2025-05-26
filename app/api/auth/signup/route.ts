import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'すべての項目を入力してください' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Supabaseでユーザー登録
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !authData?.user?.id) {
      console.error('Supabase signup error:', signUpError);
      return NextResponse.json(
        { message: '登録に失敗しました: ' + (signUpError?.message || '不明なエラー') },
        { status: 400 }
      );
    }

    // Prismaでユーザーデータを保存
    try {
      await prisma.user.create({
        data: {
          id: authData.user.id, // Supabaseのユーザーidをそのまま使用
          email: email,
          name: username,
        },
      });
    } catch (prismaError) {
      console.error('Prisma create user error:', prismaError);
      // エラー時はSupabaseのユーザーも削除
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { message: 'ユーザー作成に失敗しました' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: '登録が完了しました',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
