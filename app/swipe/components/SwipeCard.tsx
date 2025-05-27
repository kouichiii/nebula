'use client';

import { useEffect } from 'react';
import { useSpring, animated as a } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
type ArticleCard = {
  user: {
    iconUrl?: string;
    name: string;
  };
  category: {
    name: string;
  };
  title: string;
  excerpt: string;
};

export default function SwipeCard({
  article,
  onSwipe,
  isFront,
}: {
  article: ArticleCard;
  onSwipe: (dir: 'left' | 'right') => void;
  isFront: boolean;
}) {
  const [{ x, rotate, opacity }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    opacity: 1,
    // スプリングの設定を追加
    config: {
      tension: 180,
      friction: 12
    }
  }));

  // バックカード用のスプリングアニメーション
  const backCardSpring = useSpring({
    scale: isFront ? 1 : 0.95,
    y: isFront ? 0 : 10,
    opacity: isFront ? 1 : 0.8,
    config: {
      tension: 180,
      friction: 12
    }
  });

  const bind = useDrag(({ down, movement: [mx], direction: [xDir], velocity }) => {
    if (!isFront) return;

    const threshold = 150;

    if (!down && Math.abs(x.get()) > threshold) {
      const dir = x.get() > 0 ? 'right' : 'left';
      const signX = x.get() > 0 ? 1 : -1;
      api.start({ x: signX * 1000, rotate: signX * 20, opacity: 0 });
      setTimeout(() => onSwipe(dir), 300);
      return;
    }

    api.start({ x: down ? mx : 0, rotate: down ? mx / 20 : 0, opacity: 1 });
  });

  useEffect(() => {
    if (!isFront) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onSwipe('left');
      } else if (e.key === 'ArrowRight') {
        onSwipe('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFront, onSwipe]);

  return (
    <a.div
      {...(isFront ? bind() : {})}
      style={{
        x,
        rotate,
        touchAction: 'none',
        zIndex: isFront ? 1 : 0,
        ...backCardSpring, // バックカードのアニメーション適用
        transformOrigin: 'top center',
      }}
      className={`
        absolute w-[400px] h-[600px] backdrop-blur-sm rounded-2xl p-8 
        shadow-xl transition-shadow select-none border border-gray-100
        ${isFront 
          ? 'bg-white/90 hover:shadow-2xl' 
          : 'bg-white/70'
        }
      `}
    >
      <div className="h-full flex flex-col">
        {/* ユーザー情報 */}
        <div className="flex items-center gap-3 mb-6">
          {article.user.iconUrl ? (
            <img
              src={article.user.iconUrl}
              alt={article.user.name}
              className="w-12 h-12 rounded-full ring-2 ring-purple-100"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full 
            flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">{article.user.name[0]}</span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{article.user.name}</p>
            <p className="text-sm text-purple-600">{article.category.name}</p>
          </div>
        </div>

        {/* 記事タイトル */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{article.title}</h2>

        {/* 記事プレビュー */}
        <p className="text-gray-600 line-clamp-[12] flex-grow mb-6">{article.excerpt}</p>

        {/* アクションインジケーター */}
        <div className="flex justify-between text-sm font-medium">
          <span className="text-purple-600">← 記事を読む</span>
          <span className="text-gray-500">スキップ →</span>
        </div>
      </div>
    </a.div>
  );
}
