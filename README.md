# Resumate Partner

免註冊、下載 Word（.docx）的現代簡約履歷產生器。填表單 → 即時 A4 預覽 → 下載可再編輯的 Word 檔。

- Next.js 16（App Router）+ TypeScript + Tailwind CSS v4
- `docx` 在瀏覽器端產生 Word 檔，資料只存在 localStorage（Zustand persist），可匯入/匯出 JSON
- next-intl：`/zh`、`/en`，`src/proxy.ts` 依 `Accept-Language` 導向
- 統一設計：所有字體、字級、顏色、間距都在 `src/lib/design.ts`，預覽（`components/preview`）與 Word（`src/docx`）共用
- 預覽與 Word 都從 `toResumeView()`（`src/lib/resume-content.ts`）取得相同的文字與順序

## 開發

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm test             # Vitest：schema、日期格式、解開 docx 檢查內容/字體/色碼
npm run build
npm run test:e2e     # Playwright（需先 build；首次執行 npx playwright install chromium）
```

## 部署到 Vercel

1. 推到 GitHub，在 Vercel 匯入此 repo（Framework 會自動偵測為 Next.js，不需 `vercel.json`）。
2. 選填環境變數 `NEXT_PUBLIC_SITE_URL`（例如 `https://your-domain.com`），用於 canonical、sitemap、OG；未設定時會使用 Vercel 的正式網域。
3. 如需流量統計，在 Vercel 專案中啟用 Web Analytics（只記錄頁面瀏覽與下載事件，不含履歷內容）。
