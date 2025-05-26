import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/signin'); // 未ログインはログイン画面へ
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              {user.iconUrl ? (
                <img
                  src={user.iconUrl}
                  alt="プロフィール画像"
                  className="w-32 h-32 rounded-full border-4 border-purple-200 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-4xl font-bold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-grow space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                {user.bio ? (
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">{user.bio}</p>
                ) : (
                  <p className="mt-2 text-gray-400 italic">自己紹介文はまだ登録されていません</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">登録日</p>
                  <p className="text-gray-700">{user.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">投稿数</p>
                  <p className="text-gray-700">{user.articles.length}件</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-purple-100">
            <div className="flex justify-center space-x-4">
              <Link href="/profile/edit" className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                プロフィール編集
              </Link>
            </div>
          </div>

          {/* 投稿記事一覧 */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">投稿記事一覧</h2>
            <div className="space-y-6">
              {user.articles.map((article) => (
                <Link 
                  href={`/articles/${article.id}`}
                  key={article.id}
                  className="block bg-white rounded-lg border border-purple-100 hover:border-purple-300 transition-colors"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.createdAt.toLocaleDateString()}</span>
                      <div className="flex items-center space-x-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {user.articles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">まだ投稿がありません</p>
                  <Link 
                    href="/articles/new"
                    className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                  >
                    新規投稿
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
