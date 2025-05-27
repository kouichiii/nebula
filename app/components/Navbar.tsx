import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import MobileMenu from './MobileMenu';
import SmallProfile from './SmallProfile';

export default async function Navbar() {
  const supabase = createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="px-4 h-full flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Nebula
        </Link>

        <div className="flex items-center gap-4">
          {userId && <SmallProfile userId={userId} />}
          <MobileMenu userId={userId ?? null} />
        </div>
      </div>
    </nav>
  );
}
