// Records a product tour video of the site with Playwright.
// Usage: start a prod server first (npm run build && npm start), then:
//   node scripts/record-tour.mjs [baseUrl]
// Output: videos/tour-<timestamp>.webm
import { chromium } from "playwright";
import { mkdirSync, copyFileSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = "videos";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 2,
  recordVideo: { dir: "videos/tmp", size: { width: 1280, height: 720 } },
});
const page = await ctx.newPage();

const wait = (ms) => page.waitForTimeout(ms);
const smoothScrollTo = async (y) => {
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: "smooth" }), y);
};
// Scroll through a range like a person skimming
const skim = async (from, to, steps = 6, pause = 700) => {
  for (let i = 1; i <= steps; i++) {
    await smoothScrollTo(from + ((to - from) * i) / steps);
    await wait(pause);
  }
};

// 1. Hero
await page.goto(`${BASE}/zh`, { waitUntil: "domcontentloaded" });
await wait(2500);

// 2. Skim the landing page sections
const docHeight = await page.evaluate(() => document.body.scrollHeight);
await skim(0, docHeight, 7, 800);
await wait(800);
await smoothScrollTo(0);
await wait(1200);

// 3. Into the editor — click the primary CTA/link to editor
await page.locator('a[href="/zh/editor"]').first().click();
await wait(2500);

// 4. Welcome dialog → load the sample resume
const dialog = page.locator("[role=dialog]");
if (await dialog.count()) {
  await dialog.locator("button").last().click();
  await wait(1500);
}

// 5. Skim the editor form
await skim(0, 500, 3, 700);

// 6. Switch resume language to English — preview re-renders live
const enSeg = page.locator('button:has-text("English")').first();
if (await enSeg.count()) {
  await enSeg.click();
  await wait(1500);
}

// 7. Scroll preview column into view & click download
const dlBtn = page.locator('button:has-text("下載"), button:has-text("Download")').last();
if (await dlBtn.count()) {
  const dl = page.waitForEvent("download", { timeout: 15000 }).catch(() => null);
  await dlBtn.click();
  await dl;
  await wait(2000);
}

await ctx.close(); // finalizes the video file
const src = await page.video().path().catch(() => null);
await browser.close();

if (src) {
  const dest = `${OUT}/tour-${Date.now()}.webm`;
  copyFileSync(src, dest);
  console.log("saved:", dest);
} else {
  console.log("no video produced");
}
