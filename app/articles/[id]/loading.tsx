import React from 'react';

export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
          {/* メインカラム */}
          <div>
            {/* ヘッダー部分 */}
            <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
              <div className="h-10 w-3/4 bg-purple-100 rounded mb-6" />
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 bg-purple-100 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-100 rounded" />
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-24 bg-purple-50 rounded-full ml-4" />
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                <div className="h-6 w-16 bg-gray-50 rounded-full" />
                <div className="h-6 w-20 bg-gray-50 rounded-full" />
                <div className="h-6 w-14 bg-gray-50 rounded-full" />
              </div>
            </div>

            {/* 本文コンテンツ */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm space-y-6">
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
            </div>
          </div>

          {/* 目次 - 右サイドバー */}
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <div className="h-6 w-16 bg-purple-100 rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-40 bg-gray-200 rounded ml-4" />
                  <div className="h-4 w-36 bg-gray-200 rounded ml-4" />
                  <div className="h-4 w-44 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded ml-4" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}