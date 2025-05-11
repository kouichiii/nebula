'use client';

import Link from 'next/link';
import React from 'react';

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  user?: { name: string; iconUrl: string | null };
  category?: { name: string };
};

type Props = {
  article: Article;
};

export default function SearchResultCard({ article }: Props) {
  return (
    <li className="border rounded p-4 hover:shadow">
      <Link href={`/articles/${article.id}`} className="text-xl font-semibold text-purple-600 hover:underline">
        {article.title}
      </Link>
      <p className="text-gray-700 mt-2">{article.excerpt}</p>
      {article.user && (
        <div className="text-sm text-gray-500 mt-2">
          投稿者: {article.user.name}
        </div>
      )}
      {article.category && (
        <div className="text-sm text-gray-500">
          カテゴリ: {article.category.name}
        </div>
      )}
    </li>
  );
}