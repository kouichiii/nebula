import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { FaEdit, FaPlus, FaCalendarAlt, FaFileAlt, FaRegBookmark, FaRegStar } from 'react-icons/fa';

export default async function ProfilePage() {
  const supabase = createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    redirect('/auth/signin'); // 未ログインはログイン画面へ
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      iconUrl: true,
      createdAt: true,
      bio: true,
      articles: {
        select: {
          id: true,
          title: true,
          excerpt: true,
          createdAt: true,
          tags: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    return <p>ユーザー情報が見つかりませんでした。</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* プロフィールカード - ヘッダー画像なしのシンプルなデザイン */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
              {/* プロフィール画像 */}
              {user.iconUrl ? (
                <img
                  src={user.iconUrl}
                  alt="プロフィール画像"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md border-2 border-purple-100"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 text-white flex items-center justify-center text-3xl sm:text-5xl font-bold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* プロフィール情報 */}
              <div className="flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  
                  <Link 
                    href="/profile/edit" 
                    className="px-5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl 
                      transition-all flex items-center gap-2 text-sm font-medium w-max shadow-sm"
                  >
                    <FaEdit />
                    プロフィール編集
                  </Link>
                </div>
                
                <div className="mb-6 text-gray-700">
                  {user.bio ? (
                    <p className="whitespace-pre-wrap">{user.bio}</p>
                  ) : (
                    <p className="text-gray-400 italic">「プロフィール編集」から自己紹介を追加できます</p>
                  )}
                </div>
                
                {/* 統計情報 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-purple-50/50 p-4 rounded-xl mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <FaCalendarAlt className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">登録日</div>
                      <div className="text-sm font-medium">
                        {new Date(user.createdAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <FaFileAlt className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">投稿数</div>
                      <div className="text-sm font-medium">{user.articles.length}件</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <FaRegStar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">獲得★</div>
                      <div className="text-sm font-medium">0</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <FaRegBookmark className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">ブックマーク</div>
                      <div className="text-sm font-medium">0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          
        {/* 投稿記事一覧 - より洗練されたデザイン */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-purple-100/50 px-6 sm:px-8 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              あなたの投稿記事
            </h2>
            <Link
              href="/articles/new"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl 
                hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
            >
              <FaPlus className="w-3 h-3" />
              新規投稿
            </Link>
          </div>
          
          {user.articles.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">まだ記事がありません</h3>
              <p className="text-gray-500 text-center max-w-sm mb-6">
                あなたの知識や経験をシェアしてみませんか？初めての記事を投稿してみましょう。
              </p>
              <Link 
                href="/articles/new"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl 
                  hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
              >
                <FaPlus className="w-3.5 h-3.5" />
                最初の記事を書く
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {user.articles.map((article) => (
                <Link 
                  href={`/articles/${article.id}`}
                  key={article.id}
                  className="block hover:bg-purple-50/30 transition-colors"
                >
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1 hover:text-purple-600 transition-colors">{article.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{article.excerpt}</p>
                    <div className="flex flex-wrap items-center justify-between text-sm">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{article.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
