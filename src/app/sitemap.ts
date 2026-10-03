import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { POSTS } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

const PATHS = ["", "/editor", "/privacy", "/terms", "/about", "/blog", ...POSTS.map((s) => `/blog/${s}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
    })),
  );
}
