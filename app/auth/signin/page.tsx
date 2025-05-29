'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// SearchParamsを取得するためのラッパーコンポーネント
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get('returnTo') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const supabase = createClientComponentClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase signIn error:', error);
        setError('ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。');
        return;
      }
      
      // ログイン成功後、ページをリフレッシュしてからリダイレクト
      // これによりサイドバーの表示も更新される
      window.location.href = returnTo;
    } catch (error) {
      setError('ログイン中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
            focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="example@example.com"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
            focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="••••••••"
          />
        </motion.div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-600 text-sm bg-red-50 p-3 rounded-xl"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white 
        rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 
        disabled:cursor-not-allowed font-medium"
      >
        {isLoading ? 'ログイン中...' : 'ログイン'}
      </motion.button>

      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          アカウントをお持ちでない方は
          <Link href="/auth/signup" className="text-purple-600 hover:text-purple-500 font-medium">
            新規登録
          </Link>
        </p>
        <div className="text-sm text-gray-500">
          <h3 className="font-medium mb-2">ログインすると利用可能な機能</h3>
          <motion.ul
            className="space-y-1"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {['記事の投稿', 'プロフィールの管理', '他のユーザーとの交流'].map((feature, i) => (
              <motion.li
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
                {feature}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* 背景アニメーション */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl"
      >
        <div className="text-center">
          <motion.h1
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ["0%", "100%"] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            style={{ backgroundSize: "200%" }}
          >
            Nebula
          </motion.h1>
          <p className="text-gray-600">知識の共有と発見のためのプラットフォーム</p>
        </div>

        <Suspense fallback={<div className="text-center py-4">ロード中...</div>}>
          <SignInForm />
        </Suspense>
      </motion.div>
    </div>
  );
}