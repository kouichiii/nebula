import { Suspense } from 'react';
import SearchClient from './components/SearchClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">読み込み中...</div>}>
      <SearchClient />
    </Suspense>
  );
}