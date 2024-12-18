import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            },
          );

          if (response.status === 200) {
            const customer = response.data.customer;
            const token = response.data.token;
            return {
              id: customer.id,
              name: customer.name,
              email: customer.email,
              points: customer.points,
              tier: customer.tier,
              token, // Include token for further authenticated requests
            };
          } else {
            return null;
          }
        } catch (error: any) {
          throw new Error(
            error.response?.data?.error || "Authentication failed",
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.points = user.points;
        token.tier = user.tier;
        token.token = user.token; // JWT token from backend
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as number;
        (session.user as any).points = token.points as number;
        (session.user as any).tier = token.tier as string;
        (session as any).accessToken = token.token;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    // No signUp page handled separately
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
