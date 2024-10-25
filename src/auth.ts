import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoDB, { getMongoDBClient } from "./app/_mongo/connect";
import authConfig from "./auth.config";
import Users, { IUsers } from "./app/_mongo/models/Users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore
  adapter: MongoDBAdapter(getMongoDBClient()!),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
      } else {
        await mongoDB();
        const dbUser = await Users.findById<IUsers>(token.sub);
        if (dbUser) {
          token.role = dbUser?.toJSON().role;
          token.image = dbUser?.toJSON().picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.image = token.image;
      }
      // console.log(session);
      return {
        ...session,
      };
    },
    async signIn({ account, profile }) {
      // if (account?.provider == "google") {
      //   return profile?.email_verified && profile.email?.endsWith("@ncssm.edu");
      // }

      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("REDIRECT");
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },
  ...authConfig,
});
