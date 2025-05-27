import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const mainCategories = await prisma.mainCategory.findMany({
      include: {
        subCategories: true,
      },
    });

    return NextResponse.json(mainCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'カテゴリの取得に失敗しました' },
      { status: 500 }
    );
  }
}