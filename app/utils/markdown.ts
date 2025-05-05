interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  content: string;
}

export function extractTableOfContents(content: string): TableOfContentsItem[] {
  const lines = content.split('\n');
  const toc: TableOfContentsItem[] = [];
  let currentHeading: TableOfContentsItem | null = null;
  let currentContent: string[] = [];
  const idCounts: { [key: string]: number } = {};

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      // 前の見出しとその内容を保存
      if (currentHeading) {
        currentHeading.content = currentContent.join('\n').trim();
        toc.push(currentHeading);
      }

      // 新しい見出しを作成
      const level = headingMatch[1].length;
      const title = headingMatch[2];
      
      // ベースとなるIDを生成
      const baseId = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // 重複を避けるためにカウンターを使用
      if (!idCounts[baseId]) {
        idCounts[baseId] = 0;
      }
      const count = idCounts[baseId]++;
      const id = count === 0 ? baseId : `${baseId}-${count}`;

      currentHeading = {
        id,
        title,
        level,
        content: '',
      };
      currentContent = [];
    } else if (currentHeading && line.trim()) {
      currentContent.push(line);
    }
  }

  // 最後の見出しとその内容を保存
  if (currentHeading) {
    currentHeading.content = currentContent.join('\n').trim();
    toc.push(currentHeading);
  }

  return toc;
} 