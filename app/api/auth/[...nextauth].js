import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('メールアドレスとパスワードを入力してください。');
          }
  
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
  
          if (!user) {
            throw new Error('メールアドレスまたはパスワードが正しくありません。');
          }
  
          const isValid = await compare(credentials.password, user.password);
  
          if (!isValid) {
            throw new Error('メールアドレスまたはパスワードが正しくありません。');
          }
  
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        },
      }),
    ],
    pages: {
      signIn: '/auth/signin',
      error: '/auth/signin',
    },
    callbacks: {
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.sub;
        }
        return session;
      },
    },
  };
  
export default NextAuth(authOptions)