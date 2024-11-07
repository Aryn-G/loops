import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google({
      profile(profile) {
        return { role: profile.role ?? "Student", ...profile };
      },
      // allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "openid email profile",
          // prompt: "none",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
} satisfies NextAuthConfig;
