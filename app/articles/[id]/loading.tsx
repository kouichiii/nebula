import React from 'react';

export default function ArticleLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 animate-pulse">
      <div className="flex gap-8">
        <div className="flex-1">
          <article className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 mr-4" />
              <div>
                <div className="h-4 w-32 bg-purple-100 rounded mb-2" />
                <div className="h-3 w-48 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-8 w-2/3 bg-purple-100 rounded mb-6" />
            <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
              <div className="h-3 w-24 bg-gray-100 rounded" />
              <div className="h-3 w-16 bg-purple-100 rounded" />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-5 w-16 bg-purple-50 rounded-full" />
              <div className="h-5 w-12 bg-purple-50 rounded-full" />
            </div>
            <div className="space-y-4">
              <div className="h-6 w-full bg-gray-100 rounded" />
              <div className="h-6 w-5/6 bg-gray-100 rounded" />
              <div className="h-6 w-2/3 bg-gray-100 rounded" />
              <div className="h-6 w-1/2 bg-gray-100 rounded" />
            </div>
          </article>
        </div>
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 w-24 bg-purple-100 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-100 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded ml-4" />
                <div className="h-4 w-28 bg-gray-100 rounded ml-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 