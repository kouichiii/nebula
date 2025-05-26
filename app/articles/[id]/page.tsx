import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { prisma } from '@/lib/prisma';
import supabase from '@/lib/supabase';
import ArticleContent from '@/app/articles/components/ArticleContent';
import { generateTableOfContents } from '@/lib/utils/tableOfContents';
import TableOfContents from '../components/TableOfContents';
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
  const session = await supabase.auth.getSession().then(({ data }) => data.session);

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
    <article className="max-w-4xl mx-auto py-8 px-4">
      {/* ヘッダー部分 */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 著者情報 */}
            <div className="flex items-center">
              {article.user.iconUrl && (
                <img 
                  src={article.user.iconUrl} 
                  alt={article.user.name || '著者'} 
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <span className="text-gray-600">{article.user.name}</span>
            </div>
            {/* 投稿日時 */}
            <time className="text-gray-500 text-sm">
              {new Date(article.createdAt).toLocaleDateString()}
            </time>
            {/* カテゴリ */}
            <span className="text-purple-600 text-sm">
              {article.category.name}
            </span>
          </div>
          <LikeButton
            articleId={id}
            initialLiked={!!article.likes?.length}
            initialCount={article._count.likes}
            isAuthenticated={!!session}
          />
        </div>

        {/* タグ一覧 */}
        <div className="mt-4 space-x-2">
          {article.tags.map((tag) => (
            <span 
              key={tag} 
              className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* 目次 - PC表示時のみ固定表示 */}
      <div className="hidden lg:block fixed right-4 top-24 w-64">
        <TableOfContents items={tocItems} />
      </div>

      {/* 記事本文 */}
      <div className="prose prose-purple max-w-none">
        <Suspense fallback={<LoadingSpinner />}>
          <ArticleContent content={content} />
        </Suspense>
      </div>
    </article>
  );
}
