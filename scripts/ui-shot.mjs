// UI screenshot tool: node scripts/ui-shot.mjs <url> <out.png> [width] [height] [scrollY] [settleMs]
import { chromium } from "playwright";

const [url, out, w, h, scrollY, settleMs] = process.argv.slice(2);
const browser = await chromium.launch({
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: Number(w) || 1440, height: Number(h) || 900 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);
if (Number(scrollY) > 0) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Number(scrollY));
}
await page.waitForTimeout(Number(settleMs) || 2500);
await page.screenshot({ path: out });

if (errors.length) console.log("CONSOLE ERRORS:\n" + errors.slice(0, 5).join("\n---\n"));
else console.log("no console errors");
console.log("saved", out);
await browser.close();