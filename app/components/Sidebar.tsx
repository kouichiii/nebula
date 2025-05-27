import React from 'react';
import Link from 'next/link';
import SmallProfile from './SmallProfile';
import LogoutButton from './LogoutButton';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function Sidebar() {
  const supabase = createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  return (
    <div className="w-64 h-screen bg-white/80 backdrop-blur-sm border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-lg">
      <div className="p-8">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Nebula
        </Link>
      </div>

      <nav className="flex-1 px-4">
        <Link
          href="/articles"
          className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-purple-50 rounded-xl hover:text-purple-600 group transition-all"
        >
          <svg className="w-5 h-5 opacity-75 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <span className="ml-3 font-medium">記事一覧</span>
        </Link>

        <Link
          href="/swipe"
          className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-purple-50 rounded-xl hover:text-purple-600 group transition-all"
        >
          <svg className="w-5 h-5 opacity-75 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          <span className="ml-3 font-medium">見つける</span>
        </Link>

        {userId && (
          <Link
            href="/articles/new"
            className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-purple-50 rounded-xl hover:text-purple-600 group transition-all"
          >
            <svg className="w-5 h-5 opacity-75 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
            <span className="ml-3 font-medium">新規記事を投稿</span>
          </Link>
        )}
      </nav>

      <div className="p-6 mt-auto border-t border-gray-200">
        {userId ? (
          <div className="space-y-4">
            <SmallProfile userId={userId} />
            <LogoutButton />
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="flex items-center justify-center w-full px-4 py-2.5 text-sm text-white 
              bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl hover:shadow-md 
              hover:opacity-90 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                />
              </svg>
              ログイン
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center justify-center w-full px-4 py-2.5 text-sm text-purple-600 
              bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                />
              </svg>
              新規登録
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}