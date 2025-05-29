export interface TocItem {
  id: string;
  level: number;
  text: string;
}

/**
 * テキストから安定したIDを生成する関数
 */
export function generateIdFromText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  try {
    // 特殊文字を除去し、スペースをハイフンに変換
    let id = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')  // 英数字とハイフン以外を除去
      .replace(/\-+/g, '-')     // 連続するハイフンを単一のハイフンに
      .replace(/^-+|-+$/g, ''); // 先頭と末尾のハイフンを除去
    
    // 日本語など非ASCII文字を含む場合は異なる処理
    if (/[^\x00-\x7F]/.test(text)) {
      // 簡易的にハッシュ値を生成
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash |= 0; // 32ビット整数に変換
      }
      id = `heading-${Math.abs(hash).toString(16)}`;
    }
    
    return id || '';
  } catch (error) {
    console.error('Error in generateIdFromText:', error);
    return '';
  }
}

/**
 * マークダウンから目次を生成する関数
 */
export function generateTableOfContents(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    
    if (text) {
      const id = generateIdFromText(text);
      if (id) {
        items.push({ level, text, id });
      }
    }
  }

  return items;
}