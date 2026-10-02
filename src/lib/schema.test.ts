import { describe, expect, it } from "vitest";
import { formatRange } from "./date-format";
import { getSampleResume } from "./sample-data";
import { createEmptyResume, parseResumeJson, SECTION_KEYS } from "./schema";

describe("schema", () => {
  it("round-trips exported JSON", () => {
    const resume = getSampleResume("zh-TW");
    const result = parseResumeJson(JSON.stringify(resume));
    expect(result).toEqual({ ok: true, resume });
  });

  it("fills defaults for partial input and normalizes section order", () => {
    const result = parseResumeJson(JSON.stringify({ basics: { name: "A" }, meta: { sectionOrder: ["skills"] } }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.resume.basics.name).toBe("A");
    expect(result.resume.work).toEqual([]);
    expect(result.resume.meta.sectionOrder[0]).toBe("skills");
    expect(result.resume.meta.sectionOrder).toHaveLength(SECTION_KEYS.length);
  });

  it("rejects invalid JSON and invalid shapes", () => {
    expect(parseResumeJson("{oops").ok).toBe(false);
    expect(parseResumeJson(JSON.stringify({ work: "nope" })).ok).toBe(false);
    expect(parseResumeJson(JSON.stringify({ meta: { version: 99 } })).ok).toBe(false);
  });

  it("drops the legacy photo field from older backups", () => {
    const result = parseResumeJson(JSON.stringify({ basics: { name: "A", photo: "data:image/png;base64,AAAA" } }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.resume.basics).not.toHaveProperty("photo");
  });

  it("creates an empty resume in the requested locale", () => {
    expect(createEmptyResume("en").meta.resumeLocale).toBe("en");
  });
});

describe("formatRange", () => {
  it("formats per locale", () => {
    expect(formatRange("2023-07", "", true, "zh-TW")).toBe("2023/07 – 至今");
    expect(formatRange("2023-07", "2024-1", false, "en")).toBe("Jul 2023 – Jan 2024");
    expect(formatRange("", "2024-01", false, "zh-TW")).toBe("2024/01");
    expect(formatRange("", "", false, "en")).toBe("");
  });
});
