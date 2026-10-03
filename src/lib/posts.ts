export const POSTS = ["getting-started", "job-sites"] as const;
export type PostSlug = (typeof POSTS)[number];
export const isPostSlug = (slug: string): slug is PostSlug =>
  (POSTS as readonly string[]).includes(slug);

export const JOB_SITE_URLS: Record<string, string> = {
  "104": "https://www.104.com.tw",
  "1111": "https://www.1111.com.tw",
  cake: "https://www.cake.me",
  yourator: "https://www.yourator.co",
  linkedin: "https://www.linkedin.com",
  indeed: "https://www.indeed.com",
};

export type PostSection = {
  h?: string;
  p?: string[];
  sites?: { key: string; name: string; note: string }[];
};
