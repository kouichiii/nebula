'use client';

import React, { useState } from 'react';
import SearchResultCard, { Article } from './components/SearchResultCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/articles?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('検索に失敗しました');
      const data: Article[] = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">記事検索</h1>

      <form onSubmit={handleSubmit} className="flex mb-6">
        <input
          type="text"
          className="flex-1 border rounded-l px-4 py-2"
          placeholder="キーワードを入力"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 rounded-r hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? '検索中…' : '検索'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && results.length > 0 && (
        <ul className="space-y-4">
          {results.map(article => (
            <SearchResultCard key={article.id} article={article} />
          ))}
        </ul>
      )}

      {!loading && !error && query && results.length === 0 && (
        <p>該当する記事が見つかりませんでした。</p>
      )}
    </div>
  );
}