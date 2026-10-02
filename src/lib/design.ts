export const COLORS = {
  text: "1A1A1A",
  muted: "6B7280",
  accent: "1F3A5F",
  rule: "D1D5DB",
} as const;

export const FONT = {
  eastAsia: "Microsoft JhengHei",
  latin: "Calibri",
  previewStack: '"Calibri", "Microsoft JhengHei", "Noto Sans TC", sans-serif',
} as const;

export const SIZE = {
  name: 20,       // professional resume name: 18–22 pt
  title: 11.5,
  contact: 10,    // standard readable size
  sectionTitle: 12, // standard heading size
  entryTitle: 10.5,
  date: 10,
  body: 10.5,
} as const;

export const SPACING = {
  lineHeight: 1.2,  // Word default multiple 1.15 ≈ 1.2
  sectionBefore: 14,
  sectionAfter: 6,
  ruleGap: 2,
  entryBefore: 8,
  bulletAfter: 2,
  paragraphAfter: 5,
  headerAfter: 3,
  bulletIndent: 14,
  bulletHanging: 10,
} as const;

export const PAGE = {
  widthMm: 210,
  heightMm: 297,
  marginYMm: 20,   // Standard resume margin (0.79 in / moderate)
  marginXMm: 20,   // Standard resume margin (0.79 in / moderate)
} as const;

export const RULE_PT = 0.5;
export const SECTION_LETTER_SPACING_PT = 1;

export const ptToTwip = (pt: number) => Math.round(pt * 20);
export const ptToHalfPt = (pt: number) => Math.round(pt * 2);
export const mmToTwip = (mm: number) => Math.round((mm * 1440) / 25.4);
export const ptToPx = (pt: number) => (pt * 96) / 72;

export const CONTENT_WIDTH_TWIP = mmToTwip(PAGE.widthMm - PAGE.marginXMm * 2);

export const hex = (c: string) => `#${c}`;
