'use client';

import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  articleId: string;
  initialLiked: boolean;
  initialCount: number;
  isAuthenticated: boolean;
}

export default function LikeButton({
  articleId,
  initialLiked,
  initialCount,
  isAuthenticated,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    if (!isAuthenticated) {
      // 現在のURLをエンコードしてクエリパラメータとして渡す
      const returnTo = encodeURIComponent(window.location.pathname);
      router.push(`/auth/signin?returnTo=${returnTo}`);
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/articles/${articleId}/like`, {
        method: 'POST',
        credentials: 'include', // クッキーを含める
      });

      if (!res.ok) {
        if (res.status === 401) {
          // 認証エラーの場合はログインページへ
          router.push('/auth/signin');
          return;
        }
        throw new Error('いいねの処理に失敗しました');
      }

      const data = await res.json();
      setIsLiked(data.liked);
      setLikeCount(data.count);
      
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        transition-all duration-200
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${isLiked 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
        }
      `}
      aria-label={isAuthenticated ? 'いいね' : 'ログインしていいねする'}
    >
      <FaHeart 
        className={`
          w-5 h-5
          ${isLiked ? 'fill-current' : 'stroke-current'}
          ${isLoading ? 'animate-pulse' : ''}
        `}
      />
      <span className="font-medium">{likeCount}</span>
    </button>
  );
}