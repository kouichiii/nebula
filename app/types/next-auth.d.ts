// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      iconUrl: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    iconUrl: string;
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    iconUrl: string;
  }

  interface ArticleCard {
    id: string;
    title: string;
    excerpt: string;
    user: {
      name: string;
      iconUrl: string;
    };
    category: {
      name: string;
    };
  }
  
}
