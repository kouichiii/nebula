'use client';

import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden pointer-events-none">
      {/* 背景デコレーション */}
      <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
      
      {/* 追加のデコレーション要素 */}
      <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-blue-200/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDelay: '2s', animationDuration: '8s' }} />
      <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-purple-300/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDelay: '1s', animationDuration: '7s' }} />
    </div>
  );
}
