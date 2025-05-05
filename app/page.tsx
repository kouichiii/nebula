import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Nebula</h1>
        <p className="text-xl text-gray-600 mb-8">
          あなたのアイデアを共有する場所
        </p>
        <Link
          href="/articles"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-700 transition-colors"
        >
          記事一覧を見る
        </Link>
      </div>
    </div>
  );
}
