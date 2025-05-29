'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

interface BookmarkButtonProps {
  articleId: string;
  initialBookmarked: boolean;
  isAuthenticated: boolean;
}

export default function BookmarkButton({
  articleId,
  initialBookmarked,
  isAuthenticated,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      // 未ログイン状態の場合、現在のURLをエンコードしてクエリパラメータとして渡す
      const returnTo = encodeURIComponent(window.location.pathname);
      router.push(`/auth/signin?returnTo=${returnTo}`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId }),
      });

      if (!response.ok) throw new Error('Failed to bookmark');

      const data = await response.json();
      setIsBookmarked(data.bookmarked);
      
      // UI更新のためにrouterをrefresh
      router.refresh();
    } catch (error) {
      console.error('Bookmark error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={isLoading}
      className={`flex items-center gap-1 py-1.5 px-3 rounded-full transition-colors ${
        isBookmarked
          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50`}
      aria-label={isBookmarked ? 'ブックマークを解除' : 'ブックマークに追加'}
    >
      {isBookmarked ? (
        <FaBookmark className="text-yellow-500" />
      ) : (
        <FaRegBookmark />
      )}
      <span className="text-sm font-medium">
        {isBookmarked ? 'ブックマーク済み' : 'ブックマーク'}
      </span>
    </button>
  );
}
