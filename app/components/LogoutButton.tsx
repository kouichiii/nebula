// components/LogoutButton.tsx
'use client';

import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  onClick?: () => void;
}

export default function LogoutButton({ onClick }: LogoutButtonProps) {
  const router = useRouter();
  const signOut = async ({ callbackUrl }: { callbackUrl: string }) => {
    try {
      await supabase.auth.signOut();
      onClick?.(); // メニューを閉じる
      router.push(callbackUrl);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.refresh();
    }
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/signin' })}
      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600
      hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50
      rounded-xl transition-all duration-300 group"
    >
      <svg 
        className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
        />
      </svg>
      <span className="font-medium">ログアウト</span>
    </button>
  );
}
