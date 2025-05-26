import { type TocItem } from '@/lib/utils/tableOfContents';

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <nav className="sticky top-4 bg-gray-50 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-bold mb-4 text-gray-900">目次</h2>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`
              transition-colors duration-200
              ${item.level === 1 ? 'font-semibold' : 'font-normal'}
            `}
            style={{ 
              marginLeft: `${(item.level - 1) * 1.5}rem`,
              fontSize: `${Math.max(1 - (item.level - 1) * 0.1, 0.8)}rem`
            }}
          >
            <a
              href={`#${item.id}`}
              className="text-gray-600 hover:text-purple-600 hover:underline block"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}