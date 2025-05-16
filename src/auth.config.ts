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
          // default role to "No"
          role:
            foundUser !== null && foundUser.linked === false
              ? foundUser.role
              : profile.role ?? "No",
          // default account to be linked and deleted
          linked: true,
          deleted: true,
          ...profile,
        };

        // if found a user, or an unlinked user, link account / update account
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
      // neccesary for account linking logic
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig;
