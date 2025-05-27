'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 動的な背景 */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-50 via-white to-pink-50">
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

      {/* メインコンテンツ */}
      <div className="relative w-full">
        {/* ヒーローセクション */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-8 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center w-full max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-transparent bg-clip-text"
              animate={{ backgroundPosition: ["0%", "100%"] }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              style={{ backgroundSize: "200%" }}
            >
              Nebula
            </motion.h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-8 sm:mb-12 leading-relaxed px-4">
              知識の共有から始まる、<br className="sm:hidden" />新しいコミュニティの形
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/swipe"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white 
                  px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl shadow-lg 
                  hover:shadow-2xl transition-all duration-300 inline-flex items-center 
                  justify-center gap-2"
                >
                  記事を探す
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* 特徴紹介セクション */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-white/40 backdrop-blur-md w-full">
          <div className="max-w-5xl mx-auto">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              あなたの知識が誰かの発見になる
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12 px-4">
            {[
              {
                title: "直感的な記事作成",
                description: "マークダウンエディタを使用して、プログラミングや技術的な記事を簡単に作成できます。",
                icon: "✍️"
              },
              {
                title: "新しい発見",
                description: "スワイプ機能で、興味のある記事との出会いをスムーズにサポートします。",
                icon: "🔍"
              },
              {
                title: "数えきれない発見",
                description: "毎日新しい記事が投稿され、あなたの知識を広げる手助けをします。",
                icon: "🌌"
              }
            ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl 
                  transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 
                  bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* コミュニティ統計セクション */}
        <section className="py-16 sm:py-24 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              成長するコミュニティ（目標）
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {[
              {
                label: "投稿記事数",
                value: "1,234+"
              },
              {
                label: "ユーザー数",
                value: "5,678+"
              },
              {
                label: "毎月の読者数",
                value: "10,000+"
              },
              {
                label: "カテゴリ数",
                value: "25+"
              }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl"
              >
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
