import { z } from "zod";

export const SCHEMA_VERSION = 1;

export const RESUME_LOCALES = ["zh-TW", "en"] as const;
export type ResumeLocale = (typeof RESUME_LOCALES)[number];

export const SECTION_KEYS = [
  "work",
  "education",
  "projects",
  "skills",
  "certificates",
  "languages",
  "autobiography",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

const str = z.string().max(5000).default("");
const id = z.string().min(1);

const linkSchema = z.object({ id, label: str, url: str });

const educationSchema = z.object({
  id,
  school: str,
  field: str,
  degree: str,
  start: str,
  end: str,
  current: z.boolean().default(false),
  description: str,
});

const workSchema = z.object({
  id,
  company: str,
  position: str,
  location: str,
  start: str,
  end: str,
  current: z.boolean().default(false),
  description: str,
});

const projectSchema = z.object({
  id,
  name: str,
  role: str,
  link: str,
  start: str,
  end: str,
  current: z.boolean().default(false),
  description: str,
});

const skillSchema = z.object({ id, group: str, items: str });
const certificateSchema = z.object({ id, name: str, issuer: str, date: str });
const languageSchema = z.object({ id, name: str, level: str });

export const resumeSchema = z.object({
  basics: z
    .object({
      name: str,
      title: str,
      phone: str,
      email: str,
      location: str,
      links: z.array(linkSchema).default([]),
      desiredPosition: str,
      desiredSalary: str,
    })
    .prefault({}),
  education: z.array(educationSchema).default([]),
  work: z.array(workSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: z.array(skillSchema).default([]),
  certificates: z.array(certificateSchema).default([]),
  languages: z.array(languageSchema).default([]),
  autobiography: z.string().max(20000).default(""),
  meta: z
    .object({
      version: z.literal(SCHEMA_VERSION).default(SCHEMA_VERSION),
      resumeLocale: z.enum(RESUME_LOCALES).default("zh-TW"),
      sectionOrder: z
        .array(z.enum(SECTION_KEYS))
        .default([...SECTION_KEYS])
        .transform(normalizeOrder),
      hiddenSections: z.array(z.enum(SECTION_KEYS)).default([]),
    })
    .prefault({}),
});

export type Resume = z.infer<typeof resumeSchema>;
export type Education = Resume["education"][number];
export type Work = Resume["work"][number];
export type Project = Resume["projects"][number];
export type Skill = Resume["skills"][number];
export type Certificate = Resume["certificates"][number];
export type Language = Resume["languages"][number];
export type Link = Resume["basics"]["links"][number];

export type ListKey = "education" | "work" | "projects" | "skills" | "certificates" | "languages";
export type ListItem<K extends ListKey> = Resume[K][number];

function normalizeOrder(order: SectionKey[]): SectionKey[] {
  const unique = [...new Set(order)];
  return [...unique, ...SECTION_KEYS.filter((k) => !unique.includes(k))];
}

export function createEmptyResume(resumeLocale: ResumeLocale = "zh-TW"): Resume {
  return resumeSchema.parse({ meta: { resumeLocale } });
}

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function createListItem<K extends ListKey>(key: K): ListItem<K> {
  const base = { id: newId() };
  const items: { [P in ListKey]: ListItem<P> } = {
    education: { ...base, school: "", field: "", degree: "", start: "", end: "", current: false, description: "" },
    work: { ...base, company: "", position: "", location: "", start: "", end: "", current: false, description: "" },
    projects: { ...base, name: "", role: "", link: "", start: "", end: "", current: false, description: "" },
    skills: { ...base, group: "", items: "" },
    certificates: { ...base, name: "", issuer: "", date: "" },
    languages: { ...base, name: "", level: "" },
  };
  return items[key];
}

export type ParseResult = { ok: true; resume: Resume } | { ok: false; error: string };

export function parseResumeJson(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "JSON" };
  }
  const result = resumeSchema.safeParse(raw);
  if (!result.success) {
    const issue = result.error.issues[0];
    return { ok: false, error: `${issue.path.join(".") || "root"}: ${issue.message}` };
  }
  return { ok: true, resume: result.data };
}
