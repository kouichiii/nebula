'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '../components/MarkdownEditor';

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [body, setBody] = useState('# ここに本文を書きましょう\n\nマークダウン形式で記述できます。');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/articles', {
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">記事を投稿する</h1>
      
      {/* ステップ1: タイトルと本文 */}
      <div className="space-y-4 block">
        <div>
          <label className="block font-medium">タイトル</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="記事のタイトルを入力してください"
          />
        </div>
        <div>
          <label className="block font-medium">本文</label>
          <MarkdownEditor value={body} onChange={setBody} />
        </div>
        <button
          onClick={handleNextStep}
          className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700"
        >
          次へ
        </button>
      </div>

      {/* モーダル: カテゴリと概要の設定 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">記事の詳細設定</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">概要</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  required
                  placeholder="記事の概要を入力してください"
                />
              </div>
              <div>
                <label className="block font-medium">カテゴリ</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">選択してください</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">タグ（カンマ区切り）</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="例: 技術,プログラミング,Next.js"
                />
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50"
                >
                  戻る
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
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
