'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '../components/MarkdownEditor';
import { Category, MainCategory } from '@prisma/client';

interface CategoryWithSubs extends MainCategory {
  subCategories: Category[];
}

export default function NewArticlePage() {
  const router = useRouter();
  
  // ステップ1: 記事本文
  const [body, setBody] = useState('');
  
  // ステップ2: タイトル、概要、カテゴリなどの詳細情報
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [tags, setTags] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mainCategories, setMainCategories] = useState<CategoryWithSubs[]>([]);
  const [selectedMainCat, setSelectedMainCat] = useState('');
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      alert('記事の本文を入力してください');
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 pt-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          新しい記事を書く
        </h1>
        
        {/* ステップ1: まず記事本文を入力 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">本文を入力</h2>
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <MarkdownEditor value={body} onChange={setBody} />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">{body.length} 文字</p>
            <button
              onClick={handleNextStep}
              disabled={!body.trim()}
              className={`px-4 py-2 rounded-lg text-white ${
                body.trim() ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'
              } transition-colors`}
            >
              次へ
            </button>
          </div>
        </div>
      </div>

      {/* タイトルと概要を同時に入力するモーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              記事の詳細情報
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* タイトル入力 */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">タイトル</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="記事のタイトルを入力してください"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">{title.length}/100</span>
                </div>
              </div>
              
              {/* 概要入力 */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">概要</label>
                <textarea
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="記事の概要を入力してください（検索結果などに表示されます）"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">{excerpt.length}/200</span>
                </div>
              </div>
              
              {/* カテゴリー選択 */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">カテゴリ</label>
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
              </div>
              
              {/* タグ入力 */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">タグ</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

              {/* ボタン */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                >
                  戻る
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-md disabled:opacity-50"
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
