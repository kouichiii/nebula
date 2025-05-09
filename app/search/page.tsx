'use client';

import {useState} from 'react';

export default function SearchPage() {
  // save the search query to state
  // and set the initial value to an empty string
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', query);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">検索する</h1>

      <form onSubmit={handleSubmit} className='flex'>
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
        >
          検索
        </button>
      </form>
    </div>
  );
}

