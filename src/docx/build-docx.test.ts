import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { getSampleResume } from "@/lib/sample-data";
import type { Resume } from "@/lib/schema";
import { buildDocxBlob, buildDocxBuffer } from "./build-docx";

async function unzip(resume: Resume) {
  const zip = await JSZip.loadAsync(await buildDocxBuffer(resume));
  const doc = await zip.file("word/document.xml")!.async("string");
  const styles = await zip.file("word/styles.xml")!.async("string");
  const text = [...doc.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((m) => m[1]).join("");
  return { zip, doc, styles, text };
}

describe("buildDocx", () => {
  it("contains all zh-TW content in reading order with the unified design", async () => {
    const { doc, styles, text } = await unzip(getSampleResume("zh-TW"));
    const order = ["王小明", "資深前端工程師", "0912-345-678", "工作經歷", "ABC 科技", "2022/03 – 至今", "XYZ 電商", "學歷", "國立台灣大學", "專案經歷", "專業技能", "TypeScript、React", "證照", "語言能力", "TOEIC 885", "自傳"];
    let last = -1;
    for (const s of order) {
      const idx = text.indexOf(s);
      expect(idx, s).toBeGreaterThan(last);
      last = idx;
    }
    expect(styles).toContain('w:eastAsia="Microsoft JhengHei"');
    expect(styles).toContain('w:ascii="Calibri"');
    expect(styles).toContain("1F3A5F");
    expect(styles).toContain('<w:sz w:val="40"/>');
    expect(styles).toContain('<w:sz w:val="21"/>');
    expect(doc).toContain('<w:outlineLvl w:val="0"/>');
    expect(doc).not.toContain("<w:tbl>");
    expect(doc).toContain("<w:numPr>");
  });

  it("uses English labels, all caps headings and Present", async () => {
    const { doc, text } = await unzip(getSampleResume("en"));
    expect(text).toContain("Experience");
    expect(text).toContain("Mar 2022 – Present");
    expect(text).toContain("About Me");
    expect(doc).toContain("<w:caps/>");
  });

  it("respects hidden sections and custom order", async () => {
    const resume = getSampleResume("zh-TW");
    resume.meta.hiddenSections = ["projects"];
    resume.meta.sectionOrder = ["education", "work", "projects", "skills", "certificates", "languages", "autobiography"];
    const { text } = await unzip(resume);
    expect(text).not.toContain("專案經歷");
    expect(text.indexOf("學歷")).toBeLessThan(text.indexOf("工作經歷"));
  });

  it("downloads with the docx MIME type, not zip", async () => {
    const blob = await buildDocxBlob(getSampleResume("zh-TW"));
    expect(blob.type).toBe("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  });

  it("renders section headings without style or numbering references", async () => {
    const { doc } = await unzip(getSampleResume("zh-TW"));
    const headings = doc.split("</w:p>").filter((p) => p.includes("<w:outlineLvl"));
    expect(headings.length).toBe(7);
    for (const h of headings) {
      expect(h).not.toContain("pStyle");
      expect(h).not.toContain("numPr");
    }
    expect(doc).not.toContain("Heading1");
  });

  it("contains no images or floating objects", async () => {
    const { zip, doc } = await unzip(getSampleResume("zh-TW"));
    expect(Object.keys(zip.files).some((f) => f.startsWith("word/media/"))).toBe(false);
    expect(doc).not.toContain("<wp:anchor");
  });
});
