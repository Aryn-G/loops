import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Authentication Providers
export default {
  providers: [
    Google({
      profile(profile) {
        return {
          // google provides account id with .sub
          id: profile.sub ?? profile.id,
          // default role to "Student"
          role: profile.role ?? "Student",
          ...profile,
        };
      },
      authorization: {
        params: {
          scope: "openid email profile",
          access_type: "offline",
          response_type: "code",
          // prompt: "none",
        },
      },
    }),
  ],
} satisfies NextAuthConfig;
