export const FAQ_KEYS = ["why", "data", "jobsite", "pages", "wordMarks"] as const;
export type FaqKey = (typeof FAQ_KEYS)[number];
