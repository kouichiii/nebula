'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '../components/MarkdownEditor';
import { Category, MainCategory } from '@prisma/client';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface CategoryWithSubs extends MainCategory {
  subCategories: Category[];
}

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mainCategories, setMainCategories] = useState<CategoryWithSubs[]>([]);
  const [selectedMainCat, setSelectedMainCat] = useState('');
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [body, setBody] = useState('');
  const [showModal, setShowModal] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/categories/main');
      const data = await res.json();
      setMainCategories(data);
    };
    fetchCategories();
  }, []);

  const handleMainCategoryChange = (mainCatId: string) => {
    setSelectedMainCat(mainCatId);
    const selectedMain = mainCategories.find(cat => cat.id === mainCatId);
    setSubCategories(selectedMain?.subCategories || []);
    setCategoryId(''); // サブカテゴリをリセット
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/articles/all/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          content: body,
          categoryId,
          tags: tags.split(',').map(tag => tag.trim()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '投稿に失敗しました');
      }

      const result = await response.json();
      router.push(`/articles/${result.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (!body.trim()) {
      alert('記事の内容を入力してください');
      return;
    }
    setShowModal(true);
  };

  // スクロール防止を追加 - ナビバー考慮版
  useEffect(() => {
    if (isMobile) {
      // 元のスタイルを保存
      const originalStyle = document.body.style.overflow;
      // スクロール無効化
      document.body.style.overflow = 'hidden';
      
      // クリーンアップ関数
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isMobile]);

  return (
    <div className={`${isMobile ? 'fixed top-14 left-0 right-0 bottom-0 touch-none' : 'min-h-screen'} bg-gradient-to-br from-purple-50 via-white to-pink-50`}>
      <div className={`max-w-4xl mx-auto p-3 sm:p-6 ${isMobile ? 'h-full flex flex-col' : ''}`}>
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 pt-2 sm:pt-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          {isMobile ? '新しい記事' : '記事を投稿する'}
        </h1>
        
        {isMobile ? (
          // モバイル向けのXスタイルレイアウト - 高さを最大化
          <div className="flex-1 flex flex-col space-y-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md overflow-hidden">
            <div className="bg-purple-50 rounded-lg px-3 py-2 mb-2 text-sm text-purple-700">
              <p className="font-medium mb-1">💡 マークダウン形式で書けます</p>
              <p className="text-xs">
                <span className="inline-block px-1.5 py-0.5 bg-white rounded mr-1 font-mono"># 見出し</span>
                <span className="inline-block px-1.5 py-0.5 bg-white rounded mr-1 font-mono">**太字**</span>
                <span className="inline-block px-1.5 py-0.5 bg-white rounded mr-1 font-mono">*斜体*</span>
                <span className="inline-block px-1.5 py-0.5 bg-white rounded mr-1 font-mono">[リンク](URL)</span>
              </p>
            </div>
            
            <div className="flex-1 border border-gray-100 rounded-lg shadow-sm overflow-hidden">
              <MarkdownEditor 
                value={body} 
                onChange={setBody} 
              />
            </div>
            
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {body.length > 0 ? `${body.length} 文字` : ''}
              </div>
              <button
                onClick={handleNextStep}
                disabled={!body.trim()}
                className={`px-5 py-2 rounded-full text-sm font-medium ${
                  body.trim() 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                次へ
              </button>
            </div>
            
            <p className="text-xs text-center text-gray-500 mt-2">
              記事を書いた後、タイトルと詳細情報を設定できます
            </p>
          </div>
        ) : (
          // PC向けの既存レイアウト
          <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div>
              <label className="block font-medium text-gray-700 mb-2">タイトル</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 
                focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="記事のタイトルを入力してください"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">本文</label>
              <div className="bg-purple-50 rounded-lg px-4 py-3 mb-4 text-sm text-purple-700">
                <p className="font-medium mb-2">💡 マークダウン形式で書くことができます</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white rounded p-2">
                    <code className="font-mono"># 見出し1</code>
                    <p className="mt-1 font-medium">→ 大見出し</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <code className="font-mono">## 見出し2</code>
                    <p className="mt-1 font-medium">→ 中見出し</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <code className="font-mono">**太字**</code>
                    <p className="mt-1 font-medium">→ <strong>太字</strong></p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <code className="font-mono">*斜体*</code>
                    <p className="mt-1 font-medium">→ <em>斜体</em></p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <code className="font-mono">[リンク](URL)</code>
                    <p className="mt-1 font-medium">→ リンク</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <code className="font-mono">![画像](URL)</code>
                    <p className="mt-1 font-medium">→ 画像</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <code className="font-mono">- リスト項目</code>
                    <p className="mt-1 font-medium">→ 箇条書き</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <code className="font-mono">`コード`</code>
                    <p className="mt-1 font-medium">→ <code>コード</code></p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-right">
                  <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    マークダウン構文の詳細 →
                  </a>
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <MarkdownEditor value={body} onChange={setBody} />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleNextStep}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 
                rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                次へ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* モーダル: タイトル、カテゴリと概要の設定 - ナビバー考慮版 */}
      {showModal && (
        <div className="fixed top-14 left-0 right-0 bottom-0 sm:inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 max-w-lg w-full shadow-2xl my-3 sm:my-0 max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              記事の詳細設定
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* モバイルでタイトルを追加 */}
              {isMobile && (
                <div>
                  <label className="block font-medium text-gray-700 mb-1 sm:mb-2">タイトル</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    placeholder="記事のタイトルを入力してください"
                  />
                  <div className="text-xs text-right text-gray-500 mt-1">
                    {title.length}/100
                  </div>
                </div>
              )}
              
              <div>
                <label className="block font-medium text-gray-700 mb-1 sm:mb-2">概要</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  rows={3}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  required
                  placeholder="記事の概要を入力してください"
                />
                <div className="text-xs text-right text-gray-500 mt-1">
                  {excerpt.length}/200
                </div>
              </div>
              
              {/* カテゴリ選択部分 - モバイルでシンプル化 */}
              <div>
                <label className="block font-medium text-gray-700 mb-1 sm:mb-2">カテゴリ選択</label>
                {isMobile ? (
                  <div className="space-y-3">
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2
                      focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      value={selectedMainCat}
                      onChange={(e) => handleMainCategoryChange(e.target.value)}
                      required
                    >
                      <option value="">メインカテゴリを選択</option>
                      {mainCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    
                    <select
                      className="w-full border border-gray-200 rounded-lg px-3 py-2
                      focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      value={categoryId}
                      onChange={e => setCategoryId(e.target.value)}
                      required
                      disabled={!selectedMainCat}
                    >
                      <option value="">サブカテゴリを選択</option>
                      {subCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">メインカテゴリ</label>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 
                        focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={selectedMainCat}
                        onChange={(e) => handleMainCategoryChange(e.target.value)}
                        required
                      >
                        <option value="">選択してください</option>
                        {mainCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">サブカテゴリ</label>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 
                        focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        required
                        disabled={!selectedMainCat}
                      >
                        <option value="">選択してください</option>
                        {subCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-1 sm:mb-2">タグ（カンマ区切り）</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="例: 技術,プログラミング,Next.js"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-3 border-2 border-purple-600 text-purple-600 rounded-lg sm:rounded-full 
                  hover:bg-purple-50 transition-all duration-200 text-sm sm:text-base"
                >
                  戻る
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white 
                  rounded-lg sm:rounded-full hover:shadow-lg transition-all duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? '投稿中...' : '投稿する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
