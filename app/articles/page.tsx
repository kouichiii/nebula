'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  user: {
    name: string;
    iconUrl: string | null;
  };
  category: {
    name: string;
  };
  createdAt: string;
}

export default function ArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get('q') ?? '';
  const initialCatId = searchParams?.get('categoryId') ?? '';

  const [articles, setArticles] = useState<Article[]>([]);
  const [query, setQuery] = useState(initialQ);
  const [categoryId, setCategoryId] = useState(initialCatId);
  const [categories, setCategories] = useState<{id: string; name: string}[]>([]);
  const [loading, setLoading] = useState(false);

  // カテゴリ一覧の取得
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // 記事の検索
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (initialQ) params.append('q', initialQ);
    if (initialCatId) params.append('categoryId', initialCatId);

    fetch(`/api/articles/all?${params.toString()}`)
      .then(res => res.json())
      .then(setArticles)
      .finally(() => setLoading(false));
  }, [initialQ, initialCatId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.append('q', query.trim());
    if (categoryId) params.append('categoryId', categoryId);
    router.push(`/articles?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              記事一覧
            </h1>
            <p className="text-gray-600 mt-2">最新の投稿をチェックしましょう</p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                placeholder-gray-500 text-sm"
                placeholder="記事を検索..."
              />
            </div>
            
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-600
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">全て</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            
            <button
              type="submit"
              className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-full
              transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              検索
            </button>
          </form>
        </div>

        {loading ? (
          <div className="grid gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8">
            {articles.map((article) => (
              <article 
                key={article.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 
                border border-gray-100 overflow-hidden group"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      {article.user.iconUrl ? (
                        <img
                          src={article.user.iconUrl}
                          alt={article.user.name}
                          className="w-12 h-12 rounded-full ring-2 ring-purple-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 
                        flex items-center justify-center text-xl font-bold text-purple-600">
                          {article.user.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{article.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <Link href={`/articles/${article.id}`} className="block group-hover:opacity-75 transition-opacity">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 leading-tight break-words">
                      {article.title}
                    </h2>
                  </Link>

                  <div className="prose prose-purple max-w-none mb-6 text-gray-600 line-clamp-3 break-words">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {article.excerpt}
                    </ReactMarkdown>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm 
                    bg-purple-50 text-purple-700 font-medium truncate max-w-[200px]">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-2h12v2H4V3zm0 4v6h12V7H4z" clipRule="evenodd" />
                      </svg>
                      <span className="truncate">{article.category.name}</span>
                    </span>
                    <Link 
                      href={`/articles/${article.id}`}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm inline-flex items-center gap-1"
                    >
                      続きを読む
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}