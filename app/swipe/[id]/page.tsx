'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  createdAt: string;
  user: { name: string };
  category: { name: string };
}

export default function SearchArticlePage() {
  const params = useParams();
  const router = useRouter();
  const currentId = params?.id as string;

  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 記事一覧の取得
  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);

      // URLのIDに一致する記事を探す
      const index = data.findIndex((a: Article) => a.id === currentId);
      if (index >= 0) setCurrentIndex(index);
    };
    fetchArticles();
  }, [currentId]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < articles.length - 1) {
      const next = currentIndex + 1;
      router.push(`/search/${articles[next].id}`);
    } else if (direction === 'right' && currentIndex > 0) {
      const prev = currentIndex - 1;
      router.push(`/search/${articles[prev].id}`);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    trackMouse: true,
  });

  if (articles.length === 0) return <p>Loading...</p>;

  const article = articles[currentIndex];

  return (
    <div {...swipeHandlers} className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded shadow-md">
        <p className="text-sm text-gray-500">{article.category.name}</p>
        <h2 className="text-xl font-bold text-purple-700 mt-2">{article.title}</h2>
        <p className="text-gray-700 mt-2">{article.excerpt}</p>
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>著者: {article.user.name}</span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {article.tags.map(tag => (
            <span key={tag} className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
