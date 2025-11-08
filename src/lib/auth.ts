import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { graphqlRequest } from "@/lib/utils/graphql-client";
import { LOGIN } from "@/lib/graphql/queries";
import { print } from "graphql";

export const authOptions: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await graphqlRequest<{
            login: { token: string; user: { id: string; email: string; name?: string | null } };
          }>({
            query: print(LOGIN),
            variables: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          if (response.errors || !response.data?.login) {
            return null;
          }

          const { token, user } = response.data.login;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            token,
          };
        } catch {
          // Silently fail for authentication - don't log sensitive errors
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.authToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.authToken = token.authToken as string;
      }
      return session;
    },
  },
};

export const { auth } = NextAuth(authOptions);

