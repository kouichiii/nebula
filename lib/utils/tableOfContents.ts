export interface TocItem {
  level: number;
  text: string;
  id: string;
}

export function generateTableOfContents(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    toc.push({ level, text, id });
  }
  
  return toc;
}