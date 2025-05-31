'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { FaBold, FaItalic, FaHeading, FaList, FaListOl, FaCode, FaQuoteRight, FaLink, FaImage } from 'react-icons/fa';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // マークダウン形式の挿入ヘルパー
  const insertMarkdown = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      // エディタにアクセスできない場合、値を直接変更
      let updatedValue = value;
      const selectionStart = 0;
      const selectionEnd = 0;
      
      switch (type) {
        case 'bold':
          updatedValue = value + '**太字テキスト**';
          break;
        case 'italic':
          updatedValue = value + '*斜体テキスト*';
          break;
        case 'heading':
          updatedValue = value + '\n# 見出し';
          break;
        case 'list':
          updatedValue = value + '\n- リスト項目';
          break;
        case 'ordered-list':
          updatedValue = value + '\n1. 番号付きリスト';
          break;
        case 'code':
          updatedValue = value + '`コード`';
          break;
        case 'quote':
          updatedValue = value + '\n> 引用文';
          break;
        case 'link':
          updatedValue = value + '[リンクテキスト](https://example.com)';
          break;
        case 'image':
          updatedValue = value + '![画像の説明](https://example.com/image.jpg)';
          break;
      }
      
      onChange(updatedValue);
      return;
    }
    
    // テキストエリアの選択範囲を取得
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let beforeText = value.substring(0, start);
    let afterText = value.substring(end);
    let newText = '';
    let cursorOffset = 0;
    
    switch (type) {
      case 'bold':
        newText = `**${selectedText || '太字テキスト'}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'italic':
        newText = `*${selectedText || '斜体テキスト'}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'heading':
        // 行の先頭に#を追加
        const isAtLineStart = start === 0 || value.charAt(start - 1) === '\n';
        if (isAtLineStart) {
          newText = `# ${selectedText || '見出し'}`;
        } else {
          newText = `\n# ${selectedText || '見出し'}`;
        }
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'list':
        newText = selectedText ? selectedText.split('\n').map(line => `- ${line}`).join('\n') : '- リスト項目';
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'ordered-list':
        if (selectedText) {
          newText = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        } else {
          newText = '1. 番号付きリスト';
        }
        cursorOffset = selectedText ? 0 : 3;
        break;
      case 'code':
        newText = `\`${selectedText || 'コード'}\``;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'quote':
        newText = selectedText ? selectedText.split('\n').map(line => `> ${line}`).join('\n') : '> 引用文';
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'link':
        newText = `[${selectedText || 'リンクテキスト'}](https://example.com)`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'image':
        newText = `![${selectedText || '画像の説明'}](https://example.com/image.jpg)`;
        cursorOffset = selectedText ? 0 : 2;
        break;
    }
    
    const updatedValue = beforeText + newText + afterText;
    onChange(updatedValue);
    
    // カーソル位置の調整（非同期で行う必要がある）
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + newText.length - cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // テキストエリアの参照を取得
  useEffect(() => {
    if (isMobile) {
      const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
      textareaRef.current = textarea;
    }
  }, [isMobile, mode]);

  return (
    <div data-color-mode="light" className="w-full h-full flex flex-col relative">
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

      {/* モバイル用ツールバー */}
      {isMobile && mode === 'edit' && (
        <div className="flex overflow-x-auto pb-2 mb-2 gap-1 -mx-1 px-1">
          <button
            onClick={() => insertMarkdown('heading')}
            className="p-2 rounded bg-purple-50 text-purple-700 flex-shrink-0"
            aria-label="見出し"
          >
            <FaHeading />
          </button>
          <button
            onClick={() => insertMarkdown('bold')}
            className="p-2 rounded bg-purple-50 text-purple-700 flex-shrink-0"
            aria-label="太字"
          >
            <FaBold />
          </button>
          <button
            onClick={() => insertMarkdown('italic')}
            className="p-2 rounded bg-purple-50 text-purple-700 flex-shrink-0"
            aria-label="斜体"
          >
            <FaItalic />
          </button>
          <button
            onClick={() => insertMarkdown('list')}
            className="p-2 rounded bg-purple-50 text-purple-700 flex-shrink-0"
            aria-label="リスト"
          >
            <FaList />
          </button>
          <button
            onClick={() => insertMarkdown('ordered-list')}
            className="p-2 rounded bg-purple-50 text-purple-700 flex-shrink-0"
            aria-label="番号付きリスト"
          >
            <FaListOl />
          </button>
          <button
            onClick={() => insertMarkdown('code')}
            className="p-2 rounded bg-purple-50 text-purple-700 flex-shrink-0"
            aria-label="コード"
          >
            <FaCode />
          </button>
          <button
            onClick={() => insertMarkdown('quote')}
            className="p-2 rounded bg-purple-50 text-purple-700 flex-shrink-0"
            aria-label="引用"
          >
            <FaQuoteRight />
          </button>
          <button
            onClick={() => insertMarkdown('link')}
            className="p-2 rounded bg-purple-50 text-purple-700 flex-shrink-0"
            aria-label="リンク"
          >
            <FaLink />
          </button>
          <button
            onClick={() => insertMarkdown('image')}
            className="p-2 rounded bg-purple-50 text-purple-700 flex-shrink-0"
            aria-label="画像"
          >
            <FaImage />
          </button>
        </div>
      )}

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
            // モバイルでは標準ツールバーを非表示
            hideToolbar={isMobile}
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex-grow bg-white overflow-auto" style={{ minHeight: isMobile ? '250px' : '350px' }}>
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