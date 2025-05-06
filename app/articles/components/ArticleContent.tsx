'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';

export default function ArticleContent({ content }: { content: string }) {
  return (
    <div className="prose max-w-none" data-color-mode="light">
      <MarkdownPreview source={content} />
    </div>
  );
}
