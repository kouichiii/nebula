'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isMobile, setIsMobile] = useState(false);

  // 画面サイズチェック
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div data-color-mode="light" className="w-full h-full flex flex-col">
      <div className="flex border-b mb-2">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            mode === 'edit'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setMode('edit')}
        >
          編集
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            mode === 'preview'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setMode('preview')}
        >
          プレビュー
        </button>
      </div>

      {mode === 'edit' ? (
        <div className="flex-grow relative">
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || '')}
            height="100%"
            preview="edit"
            className="!bg-white h-full w-full"
            style={{ minHeight: isMobile ? '250px' : '350px', maxHeight: '100%' }}
            textareaProps={{
              placeholder: 'ここに記事を書いてください...',
            }}
          />
        </div>
      ) : (
        <div
          className="border rounded-lg p-4 flex-grow bg-white overflow-auto"
          style={{ minHeight: isMobile ? '250px' : '350px' }}
        >
          <MarkdownPreview source={value || '内容がありません'} />
        </div>
      )}

      {/* スタイルの上書き */}
      <style jsx global>{`
        /* MDEditorのスタイル調整 */
        .w-md-editor {
          box-shadow: none !important;
        }

        /* モバイル向け */
        @media (max-width: 767px) {
          .w-md-editor {
            margin-bottom: 0 !important;
          }

          /* 下部の余白を削除 */
          .w-md-editor-content {
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}