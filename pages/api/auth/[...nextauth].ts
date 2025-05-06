import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { JWT } from 'next-auth/jwt';

export const authOptions = {
  providers: [
    // Credentials（自前認証）
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await res.json();
        if (res.ok && user.id) return { id: user.id };
        return null;
      },
    }),

    // Google 認証
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: '/auth/signin',
  },

  session: {
    strategy: 'jwt' as const,
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string } }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      return {
        user: {
          id: token.id as string,
        },
        expires: session.expires,
      };
    },
  },
};

export default NextAuth(authOptions);
