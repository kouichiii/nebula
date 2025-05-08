import Link from "next/link";

export default function ProfileEditPage() {
  return (
    <div>
      <h1>開発中</h1>
      <h2>実装予定機能</h2>
        <ul>
          <li>プロフィール画像の変更</li>
          <li>プロフィール名の変更</li>
          <li>バイオ情報の設定</li>
        </ul>
        <Link href="/profile">戻る</Link>
    </div>
  );
}


