'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaBookmark } from 'react-icons/fa';

interface BookmarkedArticle {
  id: string;
  article: {
    id: string;
    title: string;
    excerpt: string;
    createdAt: string;
    user: {
      name: string;
      iconUrl: string | null;
    };
    category: {
      name: string;
    };
  };
  createdAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('/api/bookmarks/get');
        
        if (response.status === 401) {
          // 未認証の場合はログインページにリダイレクト
          router.push('/auth/signin?returnTo=/bookmarks');
          return;
        }
        
        if (!response.ok) throw new Error('Failed to fetch bookmarks');
        
        const data = await response.json();
        setBookmarks(data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダーもスケルトン表示に変更 */}
          <div className="animate-pulse flex items-center mb-8">
            <div className="w-6 h-6 bg-yellow-200/50 mr-3 rounded"></div>
            <div className="h-8 bg-gradient-to-r from-purple-200/50 to-pink-200/50 rounded-lg w-64"></div>
          </div>
          
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
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <FaBookmark className="text-yellow-500 mr-3 text-xl" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            あなたのブックマーク
          </h1>
        </div>
        
        {bookmarks.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-2xl shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-50 rounded-full flex items-center justify-center">
              <FaBookmark className="text-yellow-300 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">ブックマークした記事はありません</h3>
            <p className="text-gray-500 mb-6">気になる記事をブックマークして後で読みましょう</p>
            <Link 
              href="/articles" 
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              記事を探す
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <article 
                key={bookmark.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 
                border border-gray-100 overflow-hidden group flex flex-col h-full"
              >
                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    {bookmark.article.user.iconUrl ? (
                      <img
                        src={bookmark.article.user.iconUrl}
                        alt={bookmark.article.user.name}
                        className="w-10 h-10 rounded-full ring-1 ring-purple-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 
                      flex items-center justify-center text-lg font-bold text-purple-600">
                        {bookmark.article.user.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm text-gray-900 truncate max-w-[120px]">
                        {bookmark.article.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(bookmark.article.createdAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className="ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 truncate max-w-[100px]">
                      {bookmark.article.category.name}
                    </span>
                  </div>

                  <Link href={`/articles/${bookmark.article.id}`} className="block group-hover:opacity-90 transition-opacity flex-grow">
                    <h2 className="text-lg font-bold mb-2 text-gray-900 leading-tight line-clamp-2">
                      {bookmark.article.title.length > 60 
                        ? `${bookmark.article.title.substring(0, 60)}...` 
                        : bookmark.article.title}
                    </h2>
                    <div className="prose prose-sm prose-purple max-w-none mb-4 text-gray-600">
                      <div className="line-clamp-3">
                        {bookmark.article.excerpt.length > 150 
                          ? `${bookmark.article.excerpt.substring(0, 150).trim()}...` 
                          : bookmark.article.excerpt}
                      </div>
                    </div>
                  </Link>

                  <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                    <Link 
                      href={`/articles/${bookmark.article.id}`}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm inline-flex items-center gap-1"
                    >
                      記事を読む
                    </Link>
                    <span className="text-xs text-gray-500">
                      {new Date(bookmark.createdAt).toLocaleDateString('ja-JP')} 保存
                    </span>
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
