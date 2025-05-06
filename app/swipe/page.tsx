'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSpring, animated as a } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface ArticleCardProps {
  article: {
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
  };
  onSwipe: (direction: 'left' | 'right') => void;
}

function ArticleCard({ article, onSwipe }: ArticleCardProps) {
  const [{ x, rotate }, api] = useSpring(() => ({ x: 0, rotate: 0 }));

  const bind = useDrag((event) => {
    const { down, movement, direction, velocity } = event;
    const [mx] = movement;
    const [xDir] = direction;
    const [vx] = velocity;
  
    if (!down && vx > 0.3) {
      const dir = xDir > 0 ? 'right' : 'left';
      api.start({ x: xDir * 1000, rotate: xDir * 20 });
      onSwipe(dir); // あなたが定義したコールバック関数
      return;
    }
  
    api.start({ x: down ? mx : 0, rotate: down ? mx / 20 : 0 });
  });

  return (
    <a.div
      {...bind()}
      style={{
        x,
        rotate,
        touchAction: 'none',
      }}
      className="absolute w-full max-w-md bg-white p-6 rounded-lg shadow-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        {article.user.iconUrl ? (
          <img src={article.user.iconUrl} alt={article.user.name} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-bold text-lg">
              {article.user.name[0]}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-800">{article.user.name}</p>
          <p className="text-sm text-gray-500">{article.category.name}</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-purple-700 mb-2">{article.title}</h2>
      <p className="text-gray-600">{article.excerpt}</p>
    </a.div>
  );
}

export default function SwipePage() {
  const [articles, setArticles] = useState<ArticleCardProps['article'][]>([]);
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
    };
    fetchArticles();
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (index + 1 < articles.length) {
      setIndex(index + 1);
    } else {
      alert('最後の記事です！');
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {articles
        .slice(index, index + 3)
        .reverse()
        .map((article, i) => (
          <ArticleCard
            key={article.id}
            article={article}
            onSwipe={handleSwipe}
          />
        ))}
    </div>
  );
}
