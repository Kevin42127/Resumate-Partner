import {
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  LineRuleType,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
  type ParagraphChild,
} from "docx";
import {
  COLORS,
  CONTENT_WIDTH_TWIP,
  mmToTwip,
  PAGE,
  ptToHalfPt,
  ptToTwip,
  RULE_PT,
  SECTION_LETTER_SPACING_PT,
  SIZE,
  SPACING,
} from "@/lib/design";
import { toResumeView, type Block, type Line, type ResumeView } from "@/lib/resume-content";
import type { Resume } from "@/lib/schema";
import { DOCX_FONT } from "./helpers";

const BULLET_REF = "resume-bullet";
const LINE = Math.round(240 * SPACING.lineHeight);

const run = (text: string, opts: { bold?: boolean; color?: string; size?: number } = {}) =>
  new TextRun({
    text,
    bold: opts.bold,
    color: opts.color,
    size: opts.size ? ptToHalfPt(opts.size) : undefined,
  });

function entryLine(line: Line, before: number): Paragraph {
  const children: ParagraphChild[] = [run(line.primary, { bold: true })];
  if (line.secondary) children.push(run(` · ${line.secondary}`));
  if (line.date) children.push(new TextRun({ children: ["\t", line.date], color: COLORS.muted, size: ptToHalfPt(SIZE.date) }));
  return new Paragraph({
    children,
    keepNext: true,
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH_TWIP }],
    spacing: { before: ptToTwip(before), after: 0 },
  });
}

function blockParagraphs(block: Block, index: number, colon: string): Paragraph[] {
  if (block.kind === "pair") {
    const children: ParagraphChild[] = block.label ? [run(block.label, { bold: true }), run(`${colon}${block.value}`)] : [run(block.value)];
    return [new Paragraph({ children, spacing: { before: index === 0 ? 0 : ptToTwip(SPACING.bulletAfter * 2), after: 0 } })];
  }
  if (block.kind === "paragraphs") {
    return block.paragraphs.map(
      (text) => new Paragraph({ children: [run(text)], spacing: { after: ptToTwip(SPACING.paragraphAfter) } }),
    );
  }
  const out = [entryLine(block.line, index === 0 ? 0 : SPACING.entryBefore)];
  if (block.sub) {
    out.push(new Paragraph({ children: [run(block.sub, { color: COLORS.muted, size: SIZE.date })], keepNext: block.bullets.length > 0 }));
  }
  for (const b of block.bullets) {
    out.push(
      new Paragraph({
        children: [run(b)],
        numbering: { reference: BULLET_REF, level: 0 },
        spacing: { before: ptToTwip(SPACING.bulletAfter), after: 0 },
      }),
    );
  }
  return out;
}

function headerParagraphs(view: ResumeView): Paragraph[] {
  const out: Paragraph[] = [new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(view.name || " ")] })];
  if (view.title) {
    out.push(
      new Paragraph({
        children: [run(view.title, { color: COLORS.muted, size: SIZE.title })],
        spacing: { before: ptToTwip(SPACING.headerAfter), after: 0 },
      }),
    );
  }
  for (const line of [view.contact, view.meta].filter((l) => l.length)) {
    out.push(
      new Paragraph({
        children: [run(line.join(" | "), { color: COLORS.muted, size: SIZE.contact })],
        spacing: { before: ptToTwip(SPACING.headerAfter * 2), after: 0 },
      }),
    );
  }
  return out;
}

export function createResumeDocument(resume: Resume): Document {
  const view = toResumeView(resume);
  const isEn = view.locale === "en";

  const body: Paragraph[] = [...headerParagraphs(view)];
  for (const section of view.sections) {
    body.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.title,
            font: DOCX_FONT,
            size: ptToHalfPt(SIZE.sectionTitle),
            bold: true,
            color: COLORS.accent,
            allCaps: isEn,
            characterSpacing: isEn ? ptToTwip(SECTION_LETTER_SPACING_PT) : undefined,
          }),
        ],
        keepNext: true,
        outlineLevel: 0,
        spacing: { before: ptToTwip(SPACING.sectionBefore), after: ptToTwip(SPACING.sectionAfter), line: LINE },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: RULE_PT * 8, color: COLORS.rule, space: SPACING.ruleGap },
        },
      }),
    );
    section.blocks.forEach((block, i) => body.push(...blockParagraphs(block, i, view.colon)));
  }

  return new Document({
    creator: view.name || "Resume",
    title: view.name ? `${view.name} ${isEn ? "Resume" : "履歷"}` : "Resume",
    styles: {
      default: {
        document: {
          run: {
            font: DOCX_FONT,
            size: ptToHalfPt(SIZE.body),
            color: COLORS.text,
            language: { value: isEn ? "en-US" : "zh-TW", eastAsia: "zh-TW" },
          },
          paragraph: { spacing: { line: LINE, lineRule: LineRuleType.AUTO, after: 0 } },
        },
        title: {
          run: { font: DOCX_FONT, size: ptToHalfPt(SIZE.name), bold: true, color: COLORS.accent },
          paragraph: { spacing: { before: 0, after: 0, line: 240, lineRule: LineRuleType.AUTO } },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: BULLET_REF,
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              style: {
                paragraph: {
                  indent: { left: ptToTwip(SPACING.bulletIndent), hanging: ptToTwip(SPACING.bulletHanging) },
                },
                run: { font: { ascii: "Calibri", hAnsi: "Calibri" } },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: mmToTwip(PAGE.widthMm), height: mmToTwip(PAGE.heightMm) },
            margin: {
              top: mmToTwip(PAGE.marginYMm),
              bottom: mmToTwip(PAGE.marginYMm),
              left: mmToTwip(PAGE.marginXMm),
              right: mmToTwip(PAGE.marginXMm),
            },
          },
        },
        children: body,
      },
    ],
  });
}

export async function buildDocxBlob(resume: Resume): Promise<Blob> {
  return new Blob([await Packer.toArrayBuffer(createResumeDocument(resume))], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

export async function buildDocxBuffer(resume: Resume): Promise<Uint8Array> {
  return new Uint8Array(await Packer.toArrayBuffer(createResumeDocument(resume)));
}
