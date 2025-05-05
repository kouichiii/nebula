import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: true,
      category: true
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">記事一覧</h1>
      </div>
      <div className="grid gap-6">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              {article.user.iconUrl && (
                <img
                  src={article.user.iconUrl}
                  alt={article.user.name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{article.user.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
            <Link href={`/articles/${article.id}`}>
              <h2 className="text-xl font-bold mb-2 hover:text-purple-600 transition-colors">
                {article.title}
              </h2>
            </Link>
            <div className="prose prose-purple max-w-none mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.excerpt}
              </ReactMarkdown>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                {article.category.name}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 