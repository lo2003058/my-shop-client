import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      points: number;
      tier: string | null;
      image?: string | null;
    };
    accessToken?: string;
  }

  interface User {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    points: number;
    tier: string | null;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    points: number;
    tier: string | null;
    token: string;
  }
}
