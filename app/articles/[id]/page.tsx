import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { prisma } from '@/lib/prisma';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ArticleContent from '@/app/articles/components/ArticleContent';
import { generateTableOfContents } from '@/lib/utils/tableOfContents';
import TableOfContents from '@/app/articles/components/TableOfContents';
import LikeButton from '../components/LikeButton';

interface ArticlePageProps {
  params: { id: string };
}

// メタデータの生成
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    select: { title: true, excerpt: true }
  });

  if (!article) return { title: '記事が見つかりません' };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article'
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = params;
  
  // セッション取得方法を変更
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      user: {
        select: { 
          name: true,
          iconUrl: true  // アイコンも取得
        }
      },
      category: {
        select: { name: true }  // カテゴリ名を取得
      },
      likes: session?.user?.id ? {
        where: { userId: session.user.id }
      } : false,
      _count: {
        select: { likes: true }
      }
    }
  });

  if (!article) notFound();

  const { data, error } = await supabase.storage
    .from('articles')
    .download(article.storagePath);

  if (!data || error) {
    console.error('Storage error:', error);
    notFound();
  }

  const content = await data.text();
  const tocItems = generateTableOfContents(content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-6">
        {/* ヘッダー部分 - 常に最上部に表示 */}
        <header className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {article.title}
          </h1>
          
          {/* スマホでの表示を改善 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* 著者情報とカテゴリ */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 著者情報 */}
              <div className="flex items-center">
                {article.user.iconUrl ? (
                  <img 
                    src={article.user.iconUrl} 
                    alt={article.user.name || '著者'} 
                    className="w-12 h-12 rounded-full ring-2 ring-purple-100"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full 
                  flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xl">
                      {article.user.name?.[0]}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <span className="block font-medium text-gray-900">{article.user.name}</span>
                  <time className="text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
              
              {/* カテゴリ */}
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                {article.category.name}
              </span>
            </div>
            
            {/* いいねボタン - モバイルでもコンパクトに */}
            <div className="self-start sm:self-auto sm:ml-auto mt-2 sm:mt-0">
              <LikeButton
                articleId={id}
                initialLiked={!!article.likes?.length}
                initialCount={article._count.likes}
                isAuthenticated={!!session}
              />
            </div>
          </div>

          {/* タグ一覧 */}
          <div className="mt-5 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span 
                key={tag} 
                className="inline-block bg-gray-50 text-gray-600 rounded-full px-4 py-1 text-sm 
                border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          {/* 記事の概要 */}
          <div className="mt-6 bg-purple-50/50 rounded-xl p-4 border border-purple-100/30">
            <h3 className="text-sm font-semibold text-purple-700 mb-2">概要</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{article.excerpt}</p>
          </div>
        </header>

        {/* モバイル専用の目次 - 本文の前に表示 */}
        <div className="lg:hidden mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-500 
              bg-clip-text text-transparent">
              目次
            </h2>
            <nav className="max-h-[50vh] overflow-y-auto">
              <TableOfContents items={tocItems} />
            </nav>
          </div>
        </div>

        {/* メインコンテンツエリア - PCではグリッドレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
          {/* メインカラム */}
          <article>
            {/* 記事本文 */}
            <div className="prose prose-lg prose-purple max-w-none bg-white/80 backdrop-blur-sm 
              rounded-2xl p-6 sm:p-8 shadow-sm">
              <Suspense fallback={<LoadingSpinner />}>
                <ArticleContent content={content} />
              </Suspense>
            </div>
          </article>

          {/* PC専用の目次 - 右サイドバー */}
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 
                  bg-clip-text text-transparent">
                  目次
                </h2>
                <nav className="overflow-y-auto max-h-[calc(100vh-12rem)]">
                  <TableOfContents items={tocItems} />
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
