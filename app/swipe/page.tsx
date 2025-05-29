'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SwipeCard from './components/SwipeCard';
import { FaExpandAlt, FaTrashAlt } from 'react-icons/fa';

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
}

export default function SwipePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch(`/api/articles/random?&take=5`);
      const data = await res.json();
      console.log('Skip:', articles.length, "Fetched articles:", data);
      setArticles((prev) => [...prev, ...data]);
    };

    if (index >= articles.length - 2) {
      fetchArticles();
    }
  }, [index, articles.length]);

  if (!articles[index]) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* スワイプインジケーター */}
        <div className="absolute inset-x-0 top-4 sm:top-8 flex flex-col sm:flex-row justify-center items-center sm:space-x-8 space-y-2 sm:space-y-0 text-xs sm:text-sm font-medium px-4">
          <div className="flex items-center space-x-2 text-purple-400">
            <FaExpandAlt className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>左にスワイプして記事を読む</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <FaTrashAlt className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>右にスワイプしてスキップ</span>
          </div>
        </div>

        <div className="relative h-screen flex items-center justify-center px-4 sm:px-0">
          {/* 左右のアクションインジケーター - モバイルでは非表示 */}
          <div className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 items-center space-x-2 text-purple-500/20 animate-pulse">
            <FaExpandAlt size={48} />
            <div className="h-1 w-32 bg-purple-500/20 rounded-full" />
          </div>
          <div className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 items-center space-x-2 text-gray-500/20 animate-pulse">
            <div className="h-1 w-32 bg-gray-500/20 rounded-full" />
            <FaTrashAlt size={48} />
          </div>

          {/* スケルトンカード */}
          <div className="w-full max-w-[400px] h-[500px] sm:h-[600px] bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-8 
            shadow-xl border border-gray-100/50 animate-pulse">
            <div className="h-full flex flex-col">
              {/* ユーザー情報 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-purple-100/50 rounded-full" />
                  <div className="h-3 w-20 bg-gray-100/50 rounded-full" />
                </div>
              </div>

              {/* タイトル */}
              <div className="space-y-3 mb-6">
                <div className="h-8 w-3/4 bg-purple-100/50 rounded-xl" />
                <div className="h-8 w-1/2 bg-purple-100/50 rounded-xl" />
              </div>

              {/* 本文プレビュー */}
              <div className="flex-grow space-y-3">
                <div className="h-4 w-full bg-gray-100/50 rounded-full" />
                <div className="h-4 w-11/12 bg-gray-100/50 rounded-full" />
                <div className="h-4 w-full bg-gray-100/50 rounded-full" />
                <div className="h-4 w-10/12 bg-gray-100/50 rounded-full" />
                <div className="h-4 w-9/12 bg-gray-100/50 rounded-full" />
              </div>

              {/* アクションインジケーター */}
              <div className="flex justify-between text-sm font-medium mt-6">
                <div className="h-4 w-24 bg-purple-100/50 rounded-full" />
                <div className="h-4 w-20 bg-gray-100/50 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* スワイプインジケーター */}
      <div className="absolute inset-x-0 top-4 sm:top-8 flex flex-col sm:flex-row justify-center items-center sm:space-x-8 space-y-2 sm:space-y-0 text-xs sm:text-sm font-medium px-4">
        <div className="flex items-center space-x-2 text-purple-600">
          <FaExpandAlt className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>左にスワイプして記事を読む</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <FaTrashAlt className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>右にスワイプしてスキップ</span>
        </div>
      </div>

      <div className="relative h-screen flex items-center justify-center px-4 sm:px-0">
        {/* 左右のアクションインジケーター - モバイルでは非表示 */}
        <div className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 items-center space-x-2 text-purple-500/20">
          <FaExpandAlt size={48} />
          <div className="h-1 w-32 bg-purple-500/20 rounded-full" />
        </div>
        <div className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 items-center space-x-2 text-gray-500/20">
          <div className="h-1 w-32 bg-gray-500/20 rounded-full" />
          <FaTrashAlt size={48} />
        </div>

        {/* スワイプカード - 画面サイズに応じて調整 */}
        <div className="w-full max-w-[90vh] max-h-[calc(100vh-8rem)] flex items-center justify-center">
          {articles.slice(index, index + 2).map((article, i) => (
            <SwipeCard
              key={article.id}
              article={{
                ...article,
                user: {
                  ...article.user,
                  iconUrl: article.user.iconUrl === null ? undefined : article.user.iconUrl,
                },
              }}
              onSwipe={(dir) => {
                if (dir === 'right') {
                  setIndex((prev) => prev + 1);
                } else {
                  router.push(`/articles/${article.id}`);
                }
              }}
              isFront={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
