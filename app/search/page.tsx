'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchResultCard, { Article } from './components/SearchResultCard';

type Category = { id: string; name: string };

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 初期値を URL から取得
  const initialQ = searchParams?.get('q') ?? '';
  const initialCatId = searchParams?.get('categoryId') ?? '';

  const [query, setQuery]     = useState(initialQ);
  const [categoryId, setCategoryId] = useState(initialCatId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // マウント時にカテゴリ一覧を取得
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // URL の q が変わるたびに fetch を実行
  useEffect(() => {
    if (!initialQ && !initialCatId) return;

    (async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (initialQ)       params.append('q', initialQ);
        if (initialCatId)   params.append('categoryId', initialCatId);

        const res = await fetch(`/api/articles/all?${params.toString()}`);
        if (!res.ok) throw new Error('検索に失敗しました');
        setResults(await res.json());
      } catch (e: any) {
        setError(e.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialQ, initialCatId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim())        params.append('q', query.trim());
    if (categoryId)          params.append('categoryId', categoryId);
    router.replace(`/search?${params.toString()}`);
  };

  return (
    <Suspense fallback={<div className="text-center p-6">読み込み中...</div>}>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">検索する</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="キーワードを入力"
              className="flex-1 border rounded-l px-4 py-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-4 rounded-r"
            >
              {loading ? '検索中…' : '検索'}
            </button>
          </div>

          <label className="block font-medium">カテゴリ</label>

          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="">すべてのカテゴリ</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

        </form>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!loading && results.length > 0 && (
          <ul className="space-y-4">
            {results.map(a => <SearchResultCard key={a.id} article={a} />)}
          </ul>
        )}

        {!loading && !error && initialQ && results.length === 0 && (
          <p>該当する記事が見つかりませんでした。</p>
        )}
      </div>
    </Suspense>
  );
}