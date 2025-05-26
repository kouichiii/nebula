'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnUrl = searchParams?.get('returnUrl');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      });

      if (result?.error) {
        setError('メールアドレスまたはパスワードが正しくありません。');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError('ログイン中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  const handleLogin = async () => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        // ...他の認証情報
      });

      if (result?.ok) {
        // ログイン成功時、元のページに戻る
        router.push(returnUrl || '/');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Nebula</h1>
          <p className="text-gray-600">知識の共有と発見のためのプラットフォーム</p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span>Googleでログイン</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="example@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              アカウントをお持ちでない方は
              <Link href="/auth/signup" className="text-purple-600 hover:text-purple-500">
                新規登録
              </Link>
            </p>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>ログインすることで、以下の機能が利用可能になります：</p>
            <ul className="mt-2 space-y-1">
              <li>• 記事の投稿</li>
              <li>• プロフィールの管理</li>
              <li>• 他のユーザーとの交流</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}