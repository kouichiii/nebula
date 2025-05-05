import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { title, content, category, tags } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        category,
        tags,
        userId: user.id,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 