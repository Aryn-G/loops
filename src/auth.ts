import NextAuth, { DefaultSession, Session, User } from "next-auth";
import mongoDB, { getMongoDBClient } from "./app/_mongo/connect";
import authConfig from "./auth.config";
import Users, { IUsers } from "./app/_mongo/models/Users";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { headers } from "next/headers";
import Sessions from "./app/_mongo/models/Sessions";
import { ModifiedMongoDBAdapter } from "./app/_lib/ModifiedMongoDBAdapter";

declare module "next-auth" {
  interface Session {
    user: {
      picture?: string;
      role?: "Student" | "Loops" | "Admin";
    } & DefaultSession["user"];
    // userAgent: string;
    id: string;
    sessionToken: string;
    userId: string;
    expires: string;
    browser: string;
    device: string;
    deviceVendor?: string;
    deviceModel?: string;
    os: string;
    location: string;
    ip: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore
  adapter: ModifiedMongoDBAdapter(getMongoDBClient()),
  // adapter: MongoDBAdapter(getMongoDBClient()),
  session: { strategy: "database" },
  callbacks: {
    async session({ session }) {
      return { ...session };
      // console.log({ ...session._doc, user: session.user });
      // return { ...session._doc, user: session.user };
    },
  },
  pages: {
    error: "/",
    signIn: "/",
    signOut: "/",
    newUser: "/",
    verifyRequest: "/",
  },
  ...authConfig,
});
