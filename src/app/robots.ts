// this is for SEO
// however, sice there is no sitemap, this is pretty useless
// there is no sitemap because we don't outsiders seeing loops contents

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    // sitemap: process.env.APP_URL + "/sitemap.xml",
  };
}
