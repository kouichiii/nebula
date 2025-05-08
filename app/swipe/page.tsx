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
      const res = await fetch(`/api/articles?skip=${articles.length}&take=5`);
      const data = await res.json();
      setArticles((prev) => [...prev, ...data]);
    };

    if (articles.length === 0 || index >= articles.length - 2) {
      fetchArticles();
    }
  }, [index, articles.length]);

  if (!articles[index]) {
    return <div className="text-center p-10">読み込み中...</div>;
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
