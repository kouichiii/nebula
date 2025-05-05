'use client';
import React from 'react';
import { useState } from 'react';

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  content: string;
}

interface Props {
  items: TableOfContentsItem[];
}

export default function TableOfContents({ items }: Props) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };

  return (
    <nav className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-purple-900 mb-4">目次</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 1}rem` }}>
            <a
              href={`#${item.id}`}
              className="block font-medium text-purple-800 hover:text-purple-600 transition-colors"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
} 