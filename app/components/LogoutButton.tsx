// components/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        signOut({ callbackUrl: '/auth/signin' });
      }}
      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
    >
      ログアウト
    </button>
  );
}
