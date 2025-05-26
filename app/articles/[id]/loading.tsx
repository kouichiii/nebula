import React from 'react';

export default function ArticleLoading() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-pulse">
      {/* タイトルと投稿者情報 */}
      <div className="h-8 w-3/4 bg-purple-100 rounded mb-4" />
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-4 w-32 bg-gray-100 rounded" />
        <div className="h-4 w-4 bg-gray-100 rounded-full" />
        <div className="h-4 w-24 bg-gray-100 rounded" />
      </div>

      {/* タグ */}
      <div className="flex flex-wrap gap-2 mb-8">
        <div className="h-6 w-16 bg-purple-50 rounded-full" />
        <div className="h-6 w-20 bg-purple-50 rounded-full" />
        <div className="h-6 w-14 bg-purple-50 rounded-full" />
      </div>

      {/* 目次 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <div className="h-6 w-16 bg-purple-100 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded ml-4" />
          <div className="h-4 w-36 bg-gray-200 rounded ml-4" />
          <div className="h-4 w-44 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded ml-4" />
        </div>
      </div>

      {/* 本文コンテンツ */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-11/12 bg-gray-100 rounded" />
          <div className="h-4 w-4/5 bg-gray-100 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-10/12 bg-gray-100 rounded" />
          <div className="h-4 w-9/12 bg-gray-100 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-11/12 bg-gray-100 rounded" />
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}