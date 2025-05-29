'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* ヘッダーセクション - 検索とフィルター */}
      <div className="top-0 bg-white/90 backdrop-blur-md border-b border-purple-100/50 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              記事一覧
            </h1>
            
            <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:min-w-[240px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  placeholder-gray-500 text-sm"
                  placeholder="キーワードで検索..."
                />
              </div>
              
              {/* PC表示時のみカテゴリセレクトを表示 */}
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="hidden sm:block px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">全てのカテゴリ</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              
              <button
                type="submit"
                className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg
                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                検索
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* カテゴリフィルター - モバイル向けカルーセル */}
        <div className="sm:hidden flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button 
            onClick={() => {
              setCategoryId('');
              router.push('/articles');
            }}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium ${
              categoryId === '' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            すべて
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setCategoryId(c.id);
                router.push(`/articles?categoryId=${c.id}`);
              }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium ${
                categoryId === c.id ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* 記事一覧 */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-6"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-purple-100 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-100 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707M12 20.5V18" />
              <circle cx="12" cy="12" r="5" strokeWidth={1} />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">記事が見つかりませんでした</h3>
            <p className="text-gray-500">検索条件を変更するか、後でまた確認してください</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article 
                key={article.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 
                border border-gray-100 overflow-hidden group flex flex-col h-full"
              >
                <div className="p-5 flex flex-col h-full">
                  {/* ユーザー情報部分 */}
                  <div className="flex items-center gap-3 mb-3">
                    {article.user.iconUrl ? (
                      <img
                        src={article.user.iconUrl}
                        alt={article.user.name}
                        className="w-10 h-10 rounded-full ring-1 ring-purple-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 
                      flex items-center justify-center text-lg font-bold text-purple-600">
                        {article.user.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm text-gray-900 truncate max-w-[120px]">
                        {article.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className="ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 truncate max-w-[100px]">
                      {article.category.name}
                    </span>
                  </div>

                  <Link href={`/articles/${article.id}`} className="block group-hover:opacity-90 transition-opacity flex-grow">
                    <h2 className="text-lg font-bold mb-2 text-gray-900 leading-tight line-clamp-2">
                      {article.title.length > 60 ? `${article.title.substring(0, 60)}...` : article.title}
                    </h2>
                    <div className="prose prose-sm prose-purple max-w-none mb-4 text-gray-600">
                      <div className="line-clamp-3">
                        {article.excerpt.length > 150 
                          ? `${article.excerpt.substring(0, 150).trim()}...` 
                          : article.excerpt
                        }
                      </div>
                    </div>
                  </Link>

                  {/* 続きを読むボタン */}
                  <div className="mt-auto pt-3 border-t border-gray-50">
                    <Link 
                      href={`/articles/${article.id}`}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm inline-flex items-center gap-1"
                    >
                      続きを読む
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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