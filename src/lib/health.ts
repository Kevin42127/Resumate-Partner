import type { Resume, SectionKey } from "./schema";

export type HealthLevel = "error" | "warn" | "tip";
export type HealthIssue = { id: string; level: HealthLevel; values?: Record<string, string | number> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+\..+/i;

const visible = (resume: Resume, key: SectionKey) => !resume.meta.hiddenSections.includes(key);

export function checkResume(resume: Resume): HealthIssue[] {
  const issues: HealthIssue[] = [];
  const { basics } = resume;

  if (!basics.name.trim()) issues.push({ id: "nameMissing", level: "error" });
  if (!basics.email.trim()) issues.push({ id: "emailMissing", level: "error" });
  else if (!EMAIL_RE.test(basics.email.trim())) issues.push({ id: "emailInvalid", level: "warn" });
  if (!basics.phone.trim()) issues.push({ id: "phoneMissing", level: "warn" });
  if (!basics.title.trim()) issues.push({ id: "titleMissing", level: "warn" });
  if (basics.links.some((l) => l.url.trim() && !URL_RE.test(l.url.trim())))
    issues.push({ id: "linkInvalid", level: "warn" });

  if (visible(resume, "work")) {
    if (resume.work.length === 0) issues.push({ id: "workEmpty", level: "warn" });
    const incomplete = resume.work.filter((w) => !w.company.trim() || !w.position.trim()).length;
    if (incomplete > 0) issues.push({ id: "workIncomplete", level: "warn", values: { count: incomplete } });
    const filled = resume.work.filter((w) => w.company.trim() && w.position.trim());
    if (filled.length > 0 && filled.every((w) => !/\d/.test(w.description))) {
      issues.push({ id: "workNoNumbers", level: "tip" });
    }
  }
  if (visible(resume, "education") && resume.education.length === 0)
    issues.push({ id: "educationEmpty", level: "tip" });
  if (visible(resume, "skills") && resume.skills.length === 0) issues.push({ id: "skillsEmpty", level: "tip" });
  const auto = resume.autobiography.trim().length;
  if (visible(resume, "autobiography") && auto > 1000)
    issues.push({ id: "autobiographyLong", level: "tip", values: { count: auto } });

  return issues;
}
