'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SwipeCard from './components/SwipeCard';
import { ArticleCard } from 'next-auth';
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
    return <div className="relative h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* 左マーク（記事を開く） */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-200">
        <FaExpandAlt size={36} title="記事を開く" />
      </div>

      {/* 右マーク（スキップ） */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200">
        <FaTrashAlt size={36} title="スキップ" />
      </div>

      {/* スケルトンカード */}
      <div className="w-[320px] h-[480px] bg-white rounded-xl shadow-lg p-6 animate-pulse">
        {/* ユーザー情報 */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>

        {/* タイトル */}
        <div className="space-y-2 mb-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-6 w-1/2 bg-gray-200 rounded" />
        </div>

        {/* 本文プレビュー */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-11/12 bg-gray-100 rounded" />
          <div className="h-4 w-4/5 bg-gray-100 rounded" />
        </div>

        {/* カテゴリー */}
        <div className="absolute bottom-6 left-6">
          <div className="h-6 w-20 bg-purple-100 rounded-full" />
        </div>
      </div>
    </div>;
  }

  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* 左マーク（記事を開く） */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 opacity-50">
        <FaExpandAlt size={36} title="記事を開く" />
      </div>

      {/* 右マーク（スキップ） */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 opacity-50">
        <FaTrashAlt size={36} title="スキップ" />
      </div>

      {/* スワイプカード */}
      {articles.slice(index, index + 2).map((article, i) => {
        const isFront = i === 0;
        return (
          <SwipeCard
            key={article.id}
            article={article as ArticleCard}
            onSwipe={(dir) => {
              if (dir === 'right') {
                setIndex((prev) => prev + 1);
              } else {
                router.push(`/articles/${article.id}`);
              }
            }}
            isFront={isFront}
          />
        );
      })}
    </div>
  );
}
