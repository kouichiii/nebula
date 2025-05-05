export interface User {
  id: string;
  name: string;
  iconUrl?: string;
  bio?: string;
}

export const users: User[] = [
  {
    id: 'user1',
    name: '山田太郎',
    iconUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'フロントエンドエンジニア。ReactとNext.jsが好き。',
  },
  {
    id: 'user2',
    name: '佐藤花子',
    iconUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'TypeScriptと設計が得意なエンジニア。',
  },
  {
    id: 'user3',
    name: '鈴木一郎',
    iconUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: 'UI/UXデザイナー。Tailwind CSS愛用者。',
  },
]; 