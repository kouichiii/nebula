'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeSanitize from 'rehype-sanitize';

export default function ArticleContent({ content }: { content: string }) {
  function escapeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  const safeContent = escapeHtml(content);
  return (
    <div className="prose max-w-none" data-color-mode="light">
      <MarkdownPreview
        source={safeContent}
        wrapperElement={{ 'data-color-mode': 'light' }}
        rehypePlugins={[[rehypeSanitize]]}
      />
    </div>
  );
}
