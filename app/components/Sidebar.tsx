import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import SmallProfile from './SmallProfile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import LogoutButton from './LogoutButton';

export default async function Sidebar() {
  const session = await getServerSession(authOptions);

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          Nebula
        </Link>
      </div>

      <nav className="flex-1">
        <Link
          href="/articles"
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
        >
          <span className="mx-3">記事一覧</span>
        </Link>

        <Link
          href="/swipe"
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
        >
          <span className="mx-3">見つける</span>
        </Link>

        <Link
          href="/search"
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
        >
          <span className="mx-3">検索する</span>
        </Link>

        {session && (
          <Link
            href="/articles/new"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
          >
            <span className="mx-3">新規記事を投稿</span>
          </Link>
        )}
      </nav>

      <div className="p-6 border-t border-gray-200">
        { session ? (
          // ✅ セッションがあるときの本来の表示
          <div className="space-y-4">
            <div className="space-y-4">
              <SmallProfile userId={session.user.id} />
              <LogoutButton />
            </div>
          </div>
        ) : (
          // 🔓 未ログイン時
          <Link
            href="/auth/signin"
            className="block w-full text-center px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            ログイン
          </Link>
        )}
      </div>

    </div>
  );
} 