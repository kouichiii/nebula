'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import LogoutButton from './LogoutButton';

interface MobileMenuProps {
  userId: string | null;
}

const navItems = [
  {
    href: '/articles',
    label: '記事一覧',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      </svg>
    )
  },
  {
    href: '/swipe',
    label: '見つける',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
      </svg>
    )
  }
];

const MobileMenu: React.FC<MobileMenuProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <Fragment>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
        aria-label="メニューを開く"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <Fragment>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 left-0 right-0 bg-white z-50 max-h-[90vh] overflow-y-auto rounded-b-3xl border-b border-purple-100/50 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.05)]"
            >
              <nav className="container mx-auto max-w-lg p-6 space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={closeMenu}
                    className="p-2 text-gray-500 hover:text-purple-600"
                    aria-label="メニューを閉じる"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">メニュー</h2>

                {navItems.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 active:from-purple-100 active:to-pink-100 rounded-2xl transition-all group"
                    onClick={closeMenu}
                  >
                    <span className="p-2 rounded-xl bg-purple-50 text-purple-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                      {icon}
                    </span>
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}

                {userId && (
                  <>
                    <Link
                      href="/articles/new"
                      className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 active:from-purple-100 active:to-pink-100 rounded-2xl transition-all group"
                      onClick={closeMenu}
                    >
                      <span className="p-2 rounded-xl bg-purple-50 text-purple-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        ✏️
                      </span>
                      <span className="font-medium">新規記事を投稿</span>
                    </Link>
                    
                    <Link
                      href="/bookmarks"
                      className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 active:from-purple-100 active:to-pink-100 rounded-2xl transition-all group"
                      onClick={closeMenu}
                    >
                      <span className="p-2 rounded-xl bg-purple-50 text-purple-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </span>
                      <span className="font-medium">ブックマーク一覧</span>
                    </Link>
                  </>
                )}

                <div className="border-t pt-4 border-purple-100/50">
                  {userId ? (
                    <div className="space-y-3">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-white hover:shadow-sm rounded-2xl transition-all group"
                        onClick={closeMenu}
                      >
                        <span className="p-2 rounded-xl bg-purple-50 text-purple-500">👤</span>
                        <span className="font-medium">プロフィール</span>
                      </Link>
                      <LogoutButton onClick={closeMenu} />
                    </div>
                  ) : (
                    <div className="space-y-3 px-4">
                      <Link
                        href="/auth/signin"
                        className="block w-full text-center px-6 py-4 text-white font-medium bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 transition-all duration-200"
                        onClick={closeMenu}
                      >
                        ログイン
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block w-full text-center px-6 py-4 text-purple-600 font-medium bg-purple-50 rounded-xl hover:bg-purple-100 transition-all"
                        onClick={closeMenu}
                      >
                        新規登録
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          </Fragment>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default MobileMenu;