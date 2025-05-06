'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;
  

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
          className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 ${
            isActive('/articles') ? 'bg-purple-50 text-purple-600' : ''
          }`}
        >
          <span className="mx-3">記事一覧</span>
        </Link>

        <Link
          href="/categories"
          className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 ${
            isActive('/categories') ? 'bg-purple-50 text-purple-600' : ''
          }`}
        >
          <span className="mx-3">カテゴリー</span>
        </Link>

        <Link
          href="/tags"
          className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 ${
            isActive('/tags') ? 'bg-purple-50 text-purple-600' : ''
          }`}
        >
          <span className="mx-3">タグ</span>
        </Link>

        {session && (
          <Link
            href="/articles/new"
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 ${
              isActive('/articles/new') ? 'bg-purple-50 text-purple-600' : ''
            }`}
          >
            <span className="mx-3">新規記事を投稿</span>
          </Link>
        )}
      </nav>

      <div className="p-6 border-t border-gray-200">
        {session ? (
          <div className="space-y-4">
            <Link
              href={`/profile`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ''}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-lg font-semibold">
                    {session.user?.name?.[0] || session.user?.email?.[0] || '?'}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">
                  {session.user?.name || 'ユーザー'}
                </div>
                <div className="text-sm text-gray-500">
                  {session.user?.email}
                </div>
              </div>
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
            >
              ログアウト
            </button>
          </div>
        ) : (
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