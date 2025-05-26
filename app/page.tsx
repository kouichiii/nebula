'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* ヒーローセクション */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Nebula
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            知識の共有から始まる、新しいコミュニティ
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/swipe"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              記事を見つける
            </Link>
            <Link
              href="/articles/new"
              className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-lg text-lg hover:bg-purple-50 transition-all transform hover:scale-105"
            >
              記事を書く
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 機能紹介セクション */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4 text-purple-600">簡単な記事作成</h3>
            <p className="text-gray-600">
              マークダウン形式で直感的に記事を作成できます。画像やコードブロックも簡単に挿入可能。
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4 text-purple-600">スワイプで発見</h3>
            <p className="text-gray-600">
              気になる記事をスワイプで見つけましょう。興味のある記事との出会いをお手伝いします。
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4 text-purple-600">コミュニティ</h3>
            <p className="text-gray-600">
              いいねやコメントで交流。知識の共有からつながるコミュニティを作りましょう。
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
