import { prisma } from '@/lib/prisma';
import supabase from '@/lib/supabase';
import ArticleContent from '@/app/articles/components/ArticleContent';

interface ArticlePageProps {
  params: { id: string };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = params;

  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      title: true,
      excerpt: true,
      tags: true,
      storagePath: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  });

  if (!article) return <p>記事が見つかりませんでした。</p>;

  const data = await supabase.storage
    .from('articles')
    .download(article.storagePath);
  if (!data) return <p>記事のデータが見つかりませんでした。</p>;
  const { data: fileData, error } = data;
  if (error) {
    console.error('Error downloading file:', error);
    return <p>記事のデータを取得できませんでした。</p>;
  }
  const content = await fileData.text();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-600 text-sm mb-2">
        {article.user?.name}・{new Date(article.createdAt).toLocaleDateString()}
      </p>
      <div className="mb-6 text-sm text-purple-600">
        {article.tags.map((tag) => (
          <span key={tag} className="mr-2">#{tag}</span>
        ))}
      </div>
      <ArticleContent content={content} />
    </div>
  );
}
