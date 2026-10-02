import { COLORS, FONT, hex, PAGE, RULE_PT, SECTION_LETTER_SPACING_PT, SIZE, SPACING } from "@/lib/design";
import { toResumeView, type Block } from "@/lib/resume-content";
import type { Resume } from "@/lib/schema";

const pt = (n: number) => `${n}pt`;

function BlockView({ block, first, colon }: { block: Block; first: boolean; colon: string }) {
  if (block.kind === "pair") {
    return (
      <p style={{ marginTop: first ? 0 : pt(SPACING.bulletAfter * 2) }}>
        {block.label && <strong style={{ fontWeight: 700 }}>{block.label}</strong>}
        {block.label ? `${colon}${block.value}` : block.value}
      </p>
    );
  }
  if (block.kind === "paragraphs") {
    return block.paragraphs.map((p, i) => (
      <p key={i} style={{ marginBottom: pt(SPACING.paragraphAfter) }}>
        {p}
      </p>
    ));
  }
  const { line } = block;
  return (
    <div style={{ marginTop: first ? 0 : pt(SPACING.entryBefore), breakInside: "avoid" }}>
      <p style={{ display: "flex", alignItems: "baseline", gap: pt(8) }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ fontWeight: 700 }}>{line.primary}</strong>
          {line.secondary && ` · ${line.secondary}`}
        </span>
        {line.date && (
          <span style={{ fontSize: pt(SIZE.date), color: hex(COLORS.muted), whiteSpace: "nowrap" }}>{line.date}</span>
        )}
      </p>
      {block.sub && <p style={{ fontSize: pt(SIZE.date), color: hex(COLORS.muted) }}>{block.sub}</p>}
      {block.bullets.length > 0 && (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {block.bullets.map((b, i) => (
            <li
              key={i}
              style={{
                position: "relative",
                marginTop: pt(SPACING.bulletAfter),
                paddingLeft: pt(SPACING.bulletIndent),
              }}
            >
              <span
                aria-hidden
                style={{ position: "absolute", left: pt(SPACING.bulletIndent - SPACING.bulletHanging) }}
              >
                •
              </span>
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Pure HTML rendering of the resume, sized in pt/mm so it mirrors the DOCX output from the same design tokens. */
export function ResumePreview({ resume }: { resume: Resume }) {
  const view = toResumeView(resume);
  const isEn = view.locale === "en";

  return (
    <article
      lang={view.locale}
      style={{
        fontFamily: FONT.previewStack,
        fontSize: pt(SIZE.body),
        lineHeight: SPACING.lineHeight,
        color: hex(COLORS.text),
        wordBreak: "break-word",
      }}
    >
      <header>
        <h1 style={{ fontSize: pt(SIZE.name), fontWeight: 700, color: hex(COLORS.accent), lineHeight: 1.15, margin: 0 }}>
          {view.name || "\u00a0"}
        </h1>
        {view.title && (
          <p style={{ fontSize: pt(SIZE.title), color: hex(COLORS.muted), marginTop: pt(SPACING.headerAfter) }}>
            {view.title}
          </p>
        )}
        {[view.contact, view.meta]
          .filter((l) => l.length)
          .map((line, i) => (
            <p
              key={i}
              style={{ fontSize: pt(SIZE.contact), color: hex(COLORS.muted), marginTop: pt(SPACING.headerAfter * 2) }}
            >
              {line.join(" | ")}
            </p>
          ))}
      </header>
      {view.sections.map((section) => (
        <section key={section.key}>
          <h2
            style={{
              fontSize: pt(SIZE.sectionTitle),
              fontWeight: 700,
              color: hex(COLORS.accent),
              textTransform: isEn ? "uppercase" : "none",
              letterSpacing: isEn ? pt(SECTION_LETTER_SPACING_PT) : 0,
              marginTop: pt(SPACING.sectionBefore),
              marginBottom: pt(SPACING.sectionAfter),
              paddingBottom: pt(SPACING.ruleGap),
              borderBottom: `${RULE_PT}pt solid ${hex(COLORS.rule)}`,
              breakAfter: "avoid",
            }}
          >
            {section.title}
          </h2>
          {section.blocks.map((block, i) => (
            <BlockView key={i} block={block} first={i === 0} colon={view.colon} />
          ))}
        </section>
      ))}
    </article>
  );
}
