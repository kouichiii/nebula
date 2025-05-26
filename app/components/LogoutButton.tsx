// components/LogoutButton.tsx
'use client';

import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const signOut = async ({ callbackUrl }: { callbackUrl: string }) => {
    try {
    let { error } = await supabase.auth.signOut()
      router.push(callbackUrl);
    } catch (error) {
      console.error('Logout error:', error);
    } finally
    {
      router.refresh();
    }
  }
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
