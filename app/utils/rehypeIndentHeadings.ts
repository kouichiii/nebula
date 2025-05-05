import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

const headingIndentClass = [
  '',
  'indent-h1',
  'indent-h2',
  'indent-h3',
  'indent-h4',
  'indent-h5',
  'indent-h6',
];

export default function rehypeIndentHeadings() {
  return (tree: Root) => {
    let lastHeading: Element | null = null;
    let lastLevel = 0;
    let buffer: Element[] = [];
    const newChildren: any[] = [];

    for (const node of tree.children as Element[]) {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        // 直前の見出しグループをまとめてラップ
        if (lastHeading && buffer.length > 0) {
          newChildren.push(lastHeading);
          newChildren.push({
            type: 'element',
            tagName: 'div',
            properties: { className: [headingIndentClass[lastLevel]] },
            children: buffer,
          });
        } else if (lastHeading) {
          newChildren.push(lastHeading);
        }
        lastHeading = node;
        lastLevel = parseInt(node.tagName[1]);
        buffer = [];
      } else if (lastHeading) {
        buffer.push(node);
      } else {
        newChildren.push(node);
      }
    }
    // 最後の見出しグループ
    if (lastHeading) {
      newChildren.push(lastHeading);
      if (buffer.length > 0) {
        newChildren.push({
          type: 'element',
          tagName: 'div',
          properties: { className: [headingIndentClass[lastLevel]] },
          children: buffer,
        });
      }
    }
    tree.children = newChildren;
  };
} 