import { formatMonth, formatRange } from "./date-format";
import type { Resume, ResumeLocale, SectionKey } from "./schema";

export const SECTION_LABELS: Record<ResumeLocale, Record<SectionKey, string>> = {
  "zh-TW": {
    work: "工作經歷",
    education: "學歷",
    projects: "專案經歷",
    skills: "專業技能",
    certificates: "證照",
    languages: "語言能力",
    autobiography: "自傳",
  },
  en: {
    work: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    certificates: "Certifications",
    languages: "Languages",
    autobiography: "About Me",
  },
};

const META_LABELS: Record<ResumeLocale, { desiredPosition: string; desiredSalary: string; colon: string; listSep: string }> = {
  "zh-TW": { desiredPosition: "期望職務", desiredSalary: "期望薪資", colon: "：", listSep: "、" },
  en: { desiredPosition: "Desired Position", desiredSalary: "Expected Salary", colon: ": ", listSep: ", " },
};

export const toBullets = (text: string) =>
  text
    .split(/\r?\n/)
    .map((l) => l.trim().replace(/^[-*•·]\s*/, ""))
    .filter(Boolean);

export const toParagraphs = (text: string) =>
  text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

const stripProtocol = (url: string) => url.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");

export type Line = {
  primary: string;
  secondary: string;
  date: string;
};

export type Block =
  | { kind: "entry"; line: Line; sub?: string; bullets: string[] }
  | { kind: "pair"; label: string; value: string }
  | { kind: "paragraphs"; paragraphs: string[] };

export type Section = { key: SectionKey; title: string; blocks: Block[] };

export type ResumeView = {
  locale: ResumeLocale;
  name: string;
  title: string;
  contact: string[];
  meta: string[];
  colon: string;
  sections: Section[];
};

const join = (parts: string[], sep: string) => parts.map((p) => p.trim()).filter(Boolean).join(sep);

/**
 * Normalizes resume data into a render-ready structure shared by the HTML preview and the DOCX builder,
 * so both outputs always contain the same text in the same order.
 */
export function toResumeView(resume: Resume): ResumeView {
  const locale = resume.meta.resumeLocale;
  const L = META_LABELS[locale];
  const { basics } = resume;

  const contact = [
    basics.phone,
    basics.email,
    basics.location,
    ...basics.links.map((l) => stripProtocol(l.url) || l.label),
  ]
    .map((s) => s.trim())
    .filter(Boolean);

  const meta = [
    basics.desiredPosition.trim() && `${L.desiredPosition}${L.colon}${basics.desiredPosition.trim()}`,
    basics.desiredSalary.trim() && `${L.desiredSalary}${L.colon}${basics.desiredSalary.trim()}`,
  ].filter((s): s is string => Boolean(s));

  const build: Record<SectionKey, () => Block[]> = {
    work: () =>
      resume.work
        .filter((w) => w.company.trim() || w.position.trim())
        .map((w) => ({
          kind: "entry",
          line: {
            primary: w.company.trim() || w.position.trim(),
            secondary: join([w.company.trim() ? w.position : "", w.location], " · "),
            date: formatRange(w.start, w.end, w.current, locale),
          },
          bullets: toBullets(w.description),
        })),
    education: () =>
      resume.education
        .filter((e) => e.school.trim())
        .map((e) => ({
          kind: "entry",
          line: {
            primary: e.school.trim(),
            secondary: join([e.field, e.degree], locale === "en" ? ", " : " "),
            date: formatRange(e.start, e.end, e.current, locale),
          },
          bullets: toBullets(e.description),
        })),
    projects: () =>
      resume.projects
        .filter((p) => p.name.trim())
        .map((p) => ({
          kind: "entry",
          line: {
            primary: p.name.trim(),
            secondary: p.role.trim(),
            date: formatRange(p.start, p.end, p.current, locale),
          },
          sub: stripProtocol(p.link) || undefined,
          bullets: toBullets(p.description),
        })),
    skills: () =>
      resume.skills
        .filter((s) => s.items.trim())
        .map((s) => ({
          kind: "pair",
          label: s.group.trim(),
          value: s.items
            .split(/[,，、\n]/)
            .map((i) => i.trim())
            .filter(Boolean)
            .join(L.listSep),
        })),
    certificates: () =>
      resume.certificates
        .filter((c) => c.name.trim())
        .map((c) => ({
          kind: "entry",
          line: { primary: c.name.trim(), secondary: c.issuer.trim(), date: formatMonth(c.date, locale) },
          bullets: [],
        })),
    languages: () =>
      resume.languages
        .filter((l) => l.name.trim())
        .map((l) => ({ kind: "pair", label: l.name.trim(), value: l.level.trim() })),
    autobiography: () => {
      const paragraphs = toParagraphs(resume.autobiography);
      return paragraphs.length ? [{ kind: "paragraphs", paragraphs }] : [];
    },
  };

  const sections = resume.meta.sectionOrder
    .filter((key) => !resume.meta.hiddenSections.includes(key))
    .map((key) => ({ key, title: SECTION_LABELS[locale][key], blocks: build[key]() }))
    .filter((s) => s.blocks.length > 0);

  return {
    locale,
    name: basics.name.trim(),
    title: basics.title.trim(),
    contact,
    meta,
    colon: L.colon,
    sections,
  };
}

export function resumeFileName(resume: Resume): string {
  const name = resume.basics.name.trim().replace(/[\\/:*?"<>|]/g, "") || (resume.meta.resumeLocale === "en" ? "My" : "我的");
  return resume.meta.resumeLocale === "en" ? `${name.replace(/\s+/g, "_")}_Resume.docx` : `${name}_履歷.docx`;
}
