'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
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

  return (
    <div data-color-mode="light">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            mode === 'edit'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setMode('edit')}
        >
          編集
        </button>
        <button
          className={`px-4 py-2 font-medium ${
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
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={400}
          preview="edit"
          className="!bg-white"
        />
      ) : (
        <div className="border rounded-lg p-4 min-h-[400px] bg-white">
          <MarkdownPreview source={value} />
        </div>
      )}
    </div>
  );
} 