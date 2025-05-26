'use client';

import { useEffect } from 'react';
import { useSpring, animated as a } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { ArticleCard } from 'next-auth';

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
    opacity: 1
  }));

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
        opacity,
        touchAction: 'none',
        zIndex: isFront ? 1 : 0 // フロントのカードだけ上に
      }}
      className="absolute w-full max-w-xl h-[75vh] bg-white p-6 rounded-xl shadow-xl select-none"
    >
      <div className="flex items-center gap-3 mb-4">
        {article.user.iconUrl ? (
          <img src={article.user.iconUrl} alt={article.user.name} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-bold text-lg">{article.user.name[0]}</span>
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
