import NextAuth, { DefaultSession } from "next-auth";
import { getMongoDBClient } from "./app/_db/connect";
import authConfig from "./auth.config";
import { ModifiedMongoDBAdapter } from "./app/_db/ModifiedMongoDBAdapter";

// extend default Auth.js Session type
declare module "next-auth" {
  interface Session {
    user: {
      picture?: string;
      role?: "Student" | "Loops" | "Admin";
    } & DefaultSession["user"];
    id: string;
    sessionToken: string;
    userId: string;
    expires: string;
    browser: string;
    device: string;
    deviceVendor?: string;
    deviceModel?: string;
    os: string;
    ip: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // debug: true,
  // @ts-ignore
  adapter: ModifiedMongoDBAdapter(getMongoDBClient()),
  session: {
    strategy: "database", // use database sessions
    updateAge: 60 * 60 * 24, // update every day
    maxAge: 60 * 60 * 24 * 30, // expires in 30 days
  },
  // set all error pages to home
  pages: {
    error: "/",
    signIn: "/",
    signOut: "/",
    newUser: "/",
    verifyRequest: "/",
  },
  ...authConfig,
});
