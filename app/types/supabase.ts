// types/supabase.ts

export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    iconUrl: string;
    bio: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  iconUrl: string;
  bio: string;
}

export interface JWT {
  id: string;
  name: string;
  email: string;
  iconUrl: string;
}

export interface ArticleCard {
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
