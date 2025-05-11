'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchResultCard, { Article } from './components/SearchResultCard';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 初期値を URL から取得
  const initialQ = searchParams?.get('q') ?? '';

  const [query, setQuery]     = useState(initialQ);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // URL の q が変わるたびに fetch を実行
  useEffect(() => {
    if (!initialQ) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles?q=${encodeURIComponent(initialQ)}`);
        if (!res.ok) throw new Error('検索に失敗しました');
        setResults(await res.json());
      } catch (e: any) {
        setError(e.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialQ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // URL に q=... をつける（ページ遷移させず shallow push）
    router.replace(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">検索する</h1>

      <form onSubmit={handleSubmit} className="flex mb-6">
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
  );
}