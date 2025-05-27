'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません。');
      setIsLoading(false);
      return;
    }

    try {
      // 新規ユーザー登録
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      // 登録後の自動ログイン
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        throw new Error('ログインに失敗しました');
      }

      router.push('/');
      router.refresh();

    } catch (error) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* 背景アニメーション - サインインページと同じ */}
      <div className="absolute inset-0 -z-10">
        {/* ここに背景アニメーションのコードを挿入 */}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl my-8"
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
          <p className="text-gray-600">新しいアカウントを作成</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/*
              { id: 'username', label: 'ユーザー名', type: 'text', placeholder: 'username' },
              { id: 'email', label: 'メールアドレス', type: 'email', placeholder: 'example@example.com' },
              { id: 'password', label: 'パスワード', type: 'password', placeholder: '••••••••' },
              { id: 'confirmPassword', label: 'パスワード（確認）', type: 'password', placeholder: '••••••••' }
            */}
            {['username', 'email', 'password', 'confirmPassword'].map((field, i) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field === 'username' && 'ユーザー名'}
                  {field === 'email' && 'メールアドレス'}
                  {field === 'password' && 'パスワード'}
                  {field === 'confirmPassword' && 'パスワード（確認）'}
                </label>
                <input
                  type={field.includes('password') ? 'password' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  required
                  minLength={field.includes('password') ? 8 : undefined}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder={
                    field === 'username' ? 'username' :
                    field === 'email' ? 'example@example.com' :
                    '••••••••'
                  }
                />
              </motion.div>
            ))}
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
            {isLoading ? '登録中...' : 'アカウントを作成'}
          </motion.button>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              すでにアカウントをお持ちの方は
              <Link href="/auth/signin" className="text-purple-600 hover:text-purple-500 font-medium ml-1">
                ログイン
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}