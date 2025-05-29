'use client';

import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateIdFromText } from '@/lib/utils/tableOfContents';

interface ArticleContentProps {
  content: string | null | undefined;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const markdownContent: string = content ?? '';

  // 見出しコンポーネントを一括生成する関数
  const createHeadingComponent = (level: number) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements;

    return ({ children, ...props }: any) => {
      // テキストを抽出
      const text =
        typeof children === 'string'
          ? children
          : Array.isArray(children)
          ? children.map((node) => (typeof node === 'string' ? node : '')).join('')
          : '';

      // 一意のIDを生成
      const id =
        generateIdFromText(text) ||
        `heading-${level}-${Math.random().toString(36).substr(2, 9)}`;

      // 見出しレベルに応じたクラス名を追加
      const headingClasses = {
        1: 'text-3xl font-bold mt-8 mb-4',
        2: 'text-2xl font-bold mt-6 mb-3',
        3: 'text-xl font-semibold mt-5 mb-2',
        4: 'text-lg font-semibold mt-4 mb-2',
        5: 'text-base font-medium mt-3 mb-2',
        6: 'text-sm font-medium mt-3 mb-1',
      }[level];

      return (
        <Component
          id={id}
          data-heading-id={id}
          tabIndex={-1}
          className={headingClasses}
          {...props}
        >
          {children}
        </Component>
      );
    };
  };

  // 各見出しレベルのコンポーネントを生成
  const components = {
    h1: createHeadingComponent(1),
    h2: createHeadingComponent(2),
    h3: createHeadingComponent(3),
    h4: createHeadingComponent(4),
    h5: createHeadingComponent(5),
    h6: createHeadingComponent(6),
  };

  return (
    <div className="prose prose-lg max-w-none" data-color-mode="light">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                h1: [...(defaultSchema.attributes?.h1 || []), 'id', 'data-heading-id', 'tabindex', 'className'],
                h2: [...(defaultSchema.attributes?.h2 || []), 'id', 'data-heading-id', 'tabindex', 'className'],
                h3: [...(defaultSchema.attributes?.h3 || []), 'id', 'data-heading-id', 'tabindex', 'className'],
                h4: [...(defaultSchema.attributes?.h4 || []), 'id', 'data-heading-id', 'tabindex', 'className'],
                h5: [...(defaultSchema.attributes?.h5 || []), 'id', 'data-heading-id', 'tabindex', 'className'],
                h6: [...(defaultSchema.attributes?.h6 || []), 'id', 'data-heading-id', 'tabindex', 'className'],
                code: [...(defaultSchema.attributes?.code || []), 'className'],
              },
            },
          ],
        ]}
        components={components}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
