import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function UserPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      articles: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-600">ユーザーが見つかりませんでした</h1>
        <Link href="/articles" className="text-purple-600 hover:text-purple-800 mt-4 inline-block">
          記事一覧に戻る
        </Link>
      </div>
    );
  }

  const isCurrentUser = session?.user?.email === user.email;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          {user.iconUrl && (
            <img
              src={user.iconUrl}
              alt={user.name}
              className="w-24 h-24 rounded-full"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
          </div>
        </div>

        {isCurrentUser && (
          <div className="mb-8">
            <Link
              href="/articles/new"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block"
            >
              新規記事を投稿
            </Link>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">投稿記事</h2>
          {user.articles.length === 0 ? (
            <p className="text-gray-600">まだ記事がありません。</p>
          ) : (
            user.articles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-md p-6">
                <Link href={`/articles/${article.id}`}>
                  <h3 className="text-xl font-bold mb-2 hover:text-purple-600 transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(article.createdAt).toLocaleDateString('ja-JP')}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 