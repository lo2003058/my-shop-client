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
              firstName: customer.firstName,
              lastName: customer.lastName,
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
        token.id = user.id as number;
        token.points = user.points;
        token.tier = user.tier;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.token = user.token; // JWT token from backend
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as number;
        session.user.points = token.points as number;
        session.user.tier = token.tier as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.accessToken = token.token;
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
