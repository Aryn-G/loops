import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import mongoDB from "./app/_db/connect";
import Users, { IUsers } from "@/app/_db/models/Users";

// Authentication Providers
export default {
  providers: [
    Google({
      async profile(profile) {
        await mongoDB();
        const foundUser = await Users.findOne<IUsers>({ email: profile.email });

        const ret = {
          // google provides account id with .sub
          // this line below is crucial!
          id: profile.sub ?? profile.id,
          // default role to "Student"
          role:
            foundUser !== null && foundUser.linked === false
              ? foundUser.role
              : profile.role ?? "No",
          linked: true,
          deleted: true,
          ...profile,
        };

        if (foundUser !== null && foundUser.linked === false) {
          await Users.findByIdAndUpdate(
            foundUser._id,
            {
              $set: { ...profile, linked: true, deleted: false },
            },
            { strict: false, runValidators: false }
          );
        }

        return ret;
      },
      authorization: {
        params: {
          scope: "openid email profile",
          access_type: "offline",
          response_type: "code",
          // prompt: "none",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig;
