import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import supabase from '@/lib/supabase';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: 'ユーザーが認証されていません' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    // 1. 既存のアイコン画像を削除
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('icons')
      .list(userId);

    if (listError) {
      console.warn('既存ファイル一覧取得エラー:', listError.message);
    } else if (existingFiles && existingFiles.length > 0) {
      const paths = existingFiles.map(f => `${userId}/${f.name}`);
      const { error: removeError } = await supabase.storage
        .from('icons')
        .remove(paths);
      if (removeError) {
        console.warn('既存ファイル削除エラー:', removeError.message);
      }
    }

    // 画像をバッファーに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // sharpで正方形にトリミング
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const size = Math.min(metadata.width || 0, metadata.height || 0);

    const squaredBuffer = await image
      .extract({
        left: Math.floor(((metadata.width || 0) - size) / 2),
        top: Math.floor(((metadata.height || 0) - size) / 2),
        width: size,
        height: size,
      })
      .toFormat('webp')
      .toBuffer();

    const fileName = `${Date.now()}.webp`;
    const filePath = `${userId}/${fileName}`;

    // Supabaseへアップロード
    const { error: uploadError } = await supabase.storage
      .from('icons')
      .upload(filePath, squaredBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { message: 'アップロードに失敗しました: ' + uploadError.message },
        { status: 500 }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from('icons')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { message: '画像のアップロードに失敗しました' },
      { status: 500 }
    );
  }
}