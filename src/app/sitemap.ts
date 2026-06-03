import type { MetadataRoute } from "next";

const SITE_URL = "https://pixawallet.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
