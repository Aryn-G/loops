// import type { NextConfig } from "next";

import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  cacheOnNavigation: true,
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [
    { url: "/~offline", revision: crypto.randomUUID() },
  ],
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist({
  // Your Next.js config
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          // {
          //   key: "Content-Security-Policy",
          //   value: "default-src 'self'; script-src 'self'",
          // },
        ],
      },
    ];
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/manifest.json",
  //       destination: "/manifest.webmanifest",
  //     },
  //   ];
  // },
  experimental: {
    authInterrupts: true,
    // ppr: true,
  },
});

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "*.googleusercontent.com",
//         pathname: "**",
//       },
//     ],
//   },

//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           {
//             key: "X-Content-Type-Options",
//             value: "nosniff",
//           },
//           {
//             key: "X-Frame-Options",
//             value: "DENY",
//           },
//           {
//             key: "Referrer-Policy",
//             value: "strict-origin-when-cross-origin",
//           },
//         ],
//       },
//       {
//         source: "/sw.js",
//         headers: [
//           {
//             key: "Content-Type",
//             value: "application/javascript; charset=utf-8",
//           },
//           {
//             key: "Cache-Control",
//             value: "no-cache, no-store, must-revalidate",
//           },
//           {
//             key: "Content-Security-Policy",
//             value: "default-src 'self'; script-src 'self'",
//           },
//         ],
//       },
//     ];
//   },

//   // experimental: {
//   //   authInterrupts: true,
//   // },
// };

// export default nextConfig;
