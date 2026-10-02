import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1440, height: 900 });

// 1. FAQ test
await p.goto("http://localhost:3000/zh-TW");
await p.waitForTimeout(600);
const faqBtn = p.getByText("為什麼是 Word，不是 PDF？");
await faqBtn.scrollIntoViewIfNeeded();
await faqBtn.click();
await p.waitForTimeout(350);
await p.screenshot({ path: "tests/shot-faq.png" });

// 2. Editor MonthPicker test
await p.goto("http://localhost:3000/zh-TW/editor");
await p.getByRole("dialog").getByRole("button", { name: "載入範例" }).click();
await p.waitForTimeout(600);

// Open Work experience
await p.getByRole("button", { name: "工作經歷", exact: true }).click();
await p.waitForTimeout(300);
// Click first item to expand its fields
await p.locator('#step-work').getByRole('button', { name: /ABC 科技/ }).first().click();
await p.waitForTimeout(300);

// Click MonthPicker button
const monthBtn = p.locator('#step-work').getByRole('button', { name: /開始/ }).first();
await monthBtn.click();
await p.waitForTimeout(300);
await p.screenshot({ path: "tests/shot-monthpicker.png" });

// 3. Confirm Dialog test (Clear data)
await p.keyboard.press("Escape");
await p.waitForTimeout(200);
await p.getByRole("button", { name: "清除資料" }).click();
await p.waitForTimeout(300);
await p.screenshot({ path: "tests/shot-dialog-clear.png" });

// 4. Confirm Dialog test (Load sample)
await p.getByRole("button", { name: "取消" }).click();
await p.waitForTimeout(200);
await p.getByRole("button", { name: "載入範例" }).click();
await p.waitForTimeout(300);
await p.screenshot({ path: "tests/shot-dialog-sample.png" });

await b.close();
