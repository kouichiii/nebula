export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  userId: string;
  createdAt: string;
  category: string;
  tags: string[];
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'Next.jsでモダンなWebアプリケーションを構築する方法',
    content: `# Next.jsでモダンなWebアプリケーションを構築する方法

## はじめに

Next.jsは、Reactベースのフレームワークで、モダンなWebアプリケーションの開発を効率化するための様々な機能を提供しています。

## 主な特徴

### 1. サーバーサイドレンダリング（SSR）
- パフォーマンスの向上
- SEO対策
- 初期表示の高速化

### 2. 静的サイト生成（SSG）
- ビルド時のページ生成
- 高速なページロード
- 低いサーバー負荷

### 3. API Routes
- バックエンド機能の実装
- サーバーレス関数
- データベースとの連携

## 実装例

\`\`\`typescript
// pages/index.tsx
import { GetStaticProps } from 'next'

export default function Home({ posts }) {
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // データの取得処理
  return {
    props: {
      posts: []
    }
  }
}
\`\`\`

## まとめ

Next.jsを使用することで、モダンでパフォーマンスの高いWebアプリケーションを効率的に構築することができます。`,
    excerpt: 'Next.jsを使用して、パフォーマンスの高いWebアプリケーションを構築する方法を解説します。',
    userId: 'user1',
    createdAt: '2024-03-15',
    category: 'プログラミング',
    tags: ['Next.js', 'React', 'TypeScript']
  },
  {
    id: '2',
    title: 'TypeScriptの型システムを活用した堅牢なコード設計',
    content: `# TypeScriptの型システムを活用した堅牢なコード設計

## 型システムの重要性

TypeScriptの型システムを活用することで、開発時のエラーを早期に発見し、保守性の高いコードを書くことができます。

## 主要な型機能

### 1. インターフェース
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // オプショナル
}
\`\`\`

### 2. 型エイリアス
\`\`\`typescript
type Point = {
  x: number;
  y: number;
};
\`\`\`

### 3. ジェネリクス
\`\`\`typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}
\`\`\`

## 実践的な活用例

1. 厳密な型チェック
2. コード補完の活用
3. リファクタリングの安全性

## まとめ

TypeScriptの型システムを適切に活用することで、より安全で保守性の高いコードを書くことができます。`,
    excerpt: 'TypeScriptの型システムを最大限に活用し、バグの少ない堅牢なコードを書く方法を紹介します。',
    userId: 'user2',
    createdAt: '2024-03-14',
    category: 'プログラミング',
    tags: ['TypeScript', '型システム', '設計']
  },
  {
    id: '3',
    title: 'Tailwind CSSで美しいUIを効率的に構築するコツ',
    content: `# Tailwind CSSで美しいUIを効率的に構築するコツ

## Tailwind CSSの特徴

Tailwind CSSは、ユーティリティファーストのCSSフレームワークで、効率的なUI構築を可能にします。

## 主要な機能

### 1. ユーティリティクラス
- 柔軟なスタイリング
- 一貫性のあるデザイン
- レスポンシブ対応

### 2. カスタマイズ
\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
      },
    },
  },
}
\`\`\`

### 3. コンポーネント設計
- 再利用可能なスタイル
- メンテナンス性の向上
- 一貫性のあるデザイン

## 実践的なテクニック

1. コンポーネントの抽象化
2. カスタムユーティリティの作成
3. レスポンシブデザインの実装

## まとめ

Tailwind CSSを活用することで、効率的で美しいUIを構築することができます。`,
    excerpt: 'Tailwind CSSの活用方法と、効率的なUI構築のテクニックを解説します。',
    userId: 'user3',
    createdAt: '2024-03-13',
    category: 'デザイン',
    tags: ['Tailwind CSS', 'CSS', 'UI/UX']
  }
]; 