import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nebula",
  description: "知識の共有と発見のためのプラットフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* モバイル向けナビゲーション */}
        <div className="lg:hidden">
          <Navbar />
        </div>

        {/* デスクトップ向けサイドバー */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* メインコンテンツ */}
        <main className="pt-16 lg:pt-0 lg:pl-64 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
