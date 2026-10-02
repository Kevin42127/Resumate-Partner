import { expect, test } from "@playwright/test";
import JSZip from "jszip";
import { readFile } from "node:fs/promises";

test("root redirects by Accept-Language", async ({ browser }) => {
  const en = await browser.newContext({ locale: "en-US", extraHTTPHeaders: { "accept-language": "en-US,en;q=0.9" } });
  const page = await en.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await en.close();
});

test("custom language menu switches locale by mouse and keyboard", async ({ page }) => {
  await page.goto("/zh-TW");
  const trigger = page.getByRole("banner").getByRole("button", { name: /語言/ });
  await trigger.click();
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitemradio", { name: /繁體中文/ })).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await trigger.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Download Word");
});

test("home → editor → fill → download .docx, data persists", async ({ page, isMobile }) => {
  await page.goto("/zh-TW");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("下載 Word");
  await page.getByRole("link", { name: "立即開始（免註冊）" }).click();
  await expect(page).toHaveURL(/\/zh-TW\/editor$/);

  await page.getByRole("button", { name: "空白開始" }).click();
  await page.getByLabel("姓名").fill("測試人員");
  await page.getByLabel("職稱／求職目標").fill("產品經理");

  await page.getByRole("button", { name: "工作經歷", exact: true }).click();
  await page.locator("#step-work").getByRole("button", { name: "新增" }).click();
  await page.getByLabel("公司").fill("台積科技");
  await page.locator("#step-work").getByLabel("描述").fill("推動產品上線\n提升營收 20%");

  if (isMobile) await page.getByRole("tab", { name: "預覽" }).click();
  const preview = page.getByRole("article").first();
  await expect(preview).toContainText("測試人員");
  await expect(preview).toContainText("台積科技");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "下載 .docx" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("測試人員_履歷.docx");
  const zip = await JSZip.loadAsync(await readFile((await download.path())!));
  const xml = await zip.file("word/document.xml")!.async("string");
  expect(xml).toContain("測試人員");
  expect(xml).toContain("提升營收 20%");

  await page.reload();
  if (isMobile) await page.getByRole("tab", { name: "預覽" }).click();
  await expect(page.getByRole("article").first()).toContainText("台積科技");
  await expect(page.getByRole("button", { name: "空白開始" })).toHaveCount(0);
});

test("switching UI to English renders preview and export in English", async ({ page, isMobile }) => {
  await page.goto("/zh-TW/editor");
  await page.getByRole("button", { name: "空白開始" }).click();
  await page.getByLabel("姓名").fill("測試人員");
  await page.getByRole("button", { name: "工作經歷", exact: true }).click();
  await page.locator("#step-work").getByRole("button", { name: "新增" }).click();
  await page.getByLabel("公司").fill("台積科技");

  await page.goto("/en/editor");
  if (isMobile) await page.getByRole("tab", { name: "Preview" }).click();
  const preview = page.getByRole("article").first();
  await expect(preview).toContainText("Experience");
  await expect(preview).toContainText("台積科技");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download .docx" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("測試人員_Resume.docx");
});

test("loading example in English editor displays English sections", async ({ page, isMobile }) => {
  await page.goto("/en/editor");
  await page.getByRole("dialog").getByRole("button", { name: "Load example" }).click();
  if (isMobile) await page.getByRole("tab", { name: "Preview" }).click();
  await expect(page.getByRole("article").first()).toContainText("Experience");
  await expect(page.getByRole("article").first()).toContainText("Present");
});
