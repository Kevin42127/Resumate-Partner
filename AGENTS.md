<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

- Commands: `npm run lint`, `npm run typecheck` (runs `next typegen` first so `PageProps`/`LayoutProps` exist), `npm test` (Vitest), `npm run build`, `npm run test:e2e` (Playwright on port 3100, needs a build).
- Next.js 16: middleware is `src/proxy.ts`; route `params` are Promises.
- Design is fully unified (one template, fixed fonts/colors/density). All tokens live in `src/lib/design.ts`; never hardcode them in the preview or DOCX builder.
- Preview (`src/components/preview/resume-preview.tsx`) and DOCX (`src/docx/build-docx.ts`) both render from `toResumeView()` in `src/lib/resume-content.ts`.
- DOCX uses only native Word structures (paragraphs, numbering, right tab stops, paragraph borders, images). No tables.
- When adding dependencies use `npm_config_before=<date 7+ days ago>` to avoid freshly published versions.
