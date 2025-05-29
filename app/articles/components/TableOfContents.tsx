'use client';

import { useState, useEffect } from 'react';
import { type TocItem } from '@/lib/utils/tableOfContents';

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // スクロール時に現在表示されている見出しをハイライト
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) setActiveId(id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    // すべての見出し要素を監視
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    headings.forEach(heading => observer.observe(heading));

    return () => {
      headings.forEach(heading => observer.unobserve(heading));
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID "${id}" not found`);
      return;
    }
    
    // ヘッダーの高さを考慮したスクロール
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // アクセシビリティのためにフォーカスを設定
    element.focus({ preventScroll: true });
    
    // URLのハッシュを更新
    history.pushState(null, '', `#${id}`);
    
    // アクティブな見出しを更新
    setActiveId(id);
  };

  return (
    <nav className="overflow-y-auto max-h-[calc(100vh-12rem)]">
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li
            key={index}
            className={`
              transition-colors duration-200
              ${item.level === 1 ? 'font-semibold' : 'font-normal'}
            `}
            style={{ 
              marginLeft: `${(item.level - 1) * 0.75}rem`,
              fontSize: `${Math.max(0.9 - (item.level - 1) * 0.05, 0.75)}rem`
            }}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`
                text-gray-600 hover:text-purple-600 block py-1 px-2 rounded
                ${activeId === item.id ? 'bg-purple-50 text-purple-600 font-medium' : ''}
              `}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}