import React from 'react';
import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import { getArticleContent } from '../../../app/models/article';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

function TableOfContents({ content }: { content: string | null }) {
  if (!content) return null;

  const headings = content
    .split('\n')
    .filter(line => line.startsWith('#'))
    .map(line => {
      const level = line.split('#').length - 1;
      const text = line.replace(/^#+\s*/, '');
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return { level, text, id };
    });

  if (headings.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">目次</h2>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <li
              key={index}
              style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}
              className="hover:text-purple-600 transition-colors"
            >
              <a
                href={`#${heading.id}`}
                className="block py-1"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      category: true
    }
  });

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-600">記事が見つかりませんでした</h1>
        <Link href="/articles" className="text-purple-600 hover:text-purple-800 mt-4 inline-block">
          記事一覧に戻る
        </Link>
      </div>
    );
  }

  const content = article.mongoId ? await getArticleContent(article.mongoId) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          {article.user.iconUrl && (
            <img
              src={article.user.iconUrl}
              alt={article.user.name}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-lg">{article.user.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(article.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-8">{article.title}</h1>
        
        <TableOfContents content={content} />

        <div className="prose prose-purple max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => {
                const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h1 id={id} className="text-3xl font-bold mt-8 mb-4 scroll-mt-20" {...props} />;
              },
              h2: ({ node, ...props }) => {
                const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h2 id={id} className="text-2xl font-bold mt-6 mb-3 ml-4 scroll-mt-20" {...props} />;
              },
              h3: ({ node, ...props }) => {
                const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h3 id={id} className="text-xl font-bold mt-5 mb-3 ml-8 scroll-mt-20" {...props} />;
              },
              h4: ({ node, ...props }) => {
                const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h4 id={id} className="text-lg font-bold mt-4 mb-2 ml-12 scroll-mt-20" {...props} />;
              },
              h5: ({ node, ...props }) => {
                const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h5 id={id} className="text-base font-bold mt-3 mb-2 ml-16 scroll-mt-20" {...props} />;
              },
              h6: ({ node, ...props }) => {
                const id = props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h6 id={id} className="text-sm font-bold mt-2 mb-2 ml-20 scroll-mt-20" {...props} />;
              },
              p: ({ node, ...props }) => {
                const prevHeading = node?.position?.start.line ? 
                  content?.split('\n').slice(0, node.position.start.line - 1).reverse().find(line => line.startsWith('#')) : null;
                const headingLevel = prevHeading ? prevHeading.split('#').length - 1 : 0;
                const indent = Math.min(headingLevel * 4 + 4, 20);
                return <p className={`my-4 ml-${indent}`} {...props} />;
              },
              ul: ({ node, ...props }) => {
                const prevHeading = node?.position?.start.line ? 
                  content?.split('\n').slice(0, node.position.start.line - 1).reverse().find(line => line.startsWith('#')) : null;
                const headingLevel = prevHeading ? prevHeading.split('#').length - 1 : 0;
                const indent = Math.min(headingLevel * 4 + 8, 24);
                return <ul className={`list-disc ml-${indent} my-4`} {...props} />;
              },
              ol: ({ node, ...props }) => {
                const prevHeading = node?.position?.start.line ? 
                  content?.split('\n').slice(0, node.position.start.line - 1).reverse().find(line => line.startsWith('#')) : null;
                const headingLevel = prevHeading ? prevHeading.split('#').length - 1 : 0;
                const indent = Math.min(headingLevel * 4 + 8, 24);
                return <ol className={`list-decimal ml-${indent} my-4`} {...props} />;
              },
              blockquote: ({ node, ...props }) => {
                const prevHeading = node?.position?.start.line ? 
                  content?.split('\n').slice(0, node.position.start.line - 1).reverse().find(line => line.startsWith('#')) : null;
                const headingLevel = prevHeading ? prevHeading.split('#').length - 1 : 0;
                const indent = Math.min(headingLevel * 4 + 4, 20);
                return <blockquote className={`border-l-4 border-purple-500 pl-4 my-4 ml-${indent} italic`} {...props} />;
              },
              code: ({ node, inline, ...props }) => {
                if (inline) {
                  return <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />;
                }
                const prevHeading = node?.position?.start.line ? 
                  content?.split('\n').slice(0, node.position.start.line - 1).reverse().find(line => line.startsWith('#')) : null;
                const headingLevel = prevHeading ? prevHeading.split('#').length - 1 : 0;
                const indent = Math.min(headingLevel * 4 + 4, 20);
                return <code className={`block bg-gray-100 rounded p-4 my-4 ml-${indent} overflow-x-auto`} {...props} />;
              },
              img: ({ node, ...props }) => {
                const prevHeading = node?.position?.start.line ? 
                  content?.split('\n').slice(0, node.position.start.line - 1).reverse().find(line => line.startsWith('#')) : null;
                const headingLevel = prevHeading ? prevHeading.split('#').length - 1 : 0;
                const indent = Math.min(headingLevel * 4 + 4, 20);
                return <img className={`my-4 ml-${indent} max-w-full rounded-lg`} {...props} />;
              },
              a: ({ node, ...props }) => {
                const prevHeading = node?.position?.start.line ? 
                  content?.split('\n').slice(0, node.position.start.line - 1).reverse().find(line => line.startsWith('#')) : null;
                const headingLevel = prevHeading ? prevHeading.split('#').length - 1 : 0;
                const indent = Math.min(headingLevel * 4 + 4, 20);
                return <a className={`text-purple-600 hover:text-purple-800 ml-${indent}`} {...props} />;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link
            href="/articles"
            className="text-purple-600 hover:text-purple-800"
          >
            ← 記事一覧に戻る
          </Link>
        </div>
      </article>
    </div>
  );
}