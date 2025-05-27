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
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mainCategories, setMainCategories] = useState<CategoryWithSubs[]>([]);
  const [selectedMainCat, setSelectedMainCat] = useState('');
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [body, setBody] = useState('# ここに本文を書きましょう\n\nマークダウン形式で記述できます。');
  const [showModal, setShowModal] = useState(false);

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
    if (title.trim() && body.trim()) {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 pt-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          記事を投稿する
        </h1>
        
        {/* ステップ1: タイトルと本文 */}
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
      </div>

      {/* モーダル: カテゴリと概要の設定 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              記事の詳細設定
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-medium text-gray-700 mb-2">概要</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  required
                  placeholder="記事の概要を入力してください"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">カテゴリ選択</label>
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
              <div>
                <label className="block font-medium text-gray-700 mb-2">タグ（カンマ区切り）</label>
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

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-full 
                  hover:bg-purple-50 transition-all duration-200"
                >
                  戻る
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white 
                  rounded-full hover:shadow-lg transform hover:-translate-y-0.5 
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
