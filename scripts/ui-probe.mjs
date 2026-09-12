import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo({ top: 1100, behavior: "instant" }));
await page.waitForTimeout(3000);

const probe = await page.evaluate(() => {
  const out = {};
  const el = (sel) => document.querySelector(sel);
  const bg = (el) => el && getComputedStyle(el).backgroundColor;
  out.htmlBg = bg(document.documentElement);
  out.bodyBg = bg(document.body);
  out.mainBg = bg(document.querySelector("main"));
  const canvas = document.querySelector("main canvas");
  out.canvasExists = !!canvas;
  if (canvas) {
    out.canvasSize = [canvas.width, canvas.height];
    out.canvasVisible = getComputedStyle(canvas).visibility;
    // sample center pixel via 2d copy
    try {
      const c2 = document.createElement("canvas");
      c2.width = 2; c2.height = 2;
      const cx = c2.getContext("2d");
      cx.drawImage(canvas, canvas.width / 2 - 1, canvas.height / 2 - 1, 2, 2, 0, 0, 2, 2);
      const d = cx.getImageData(0, 0, 1, 1).data;
      out.canvasPixel = Array.from(d);
    } catch (e) { out.canvasPixel = "readfail: " + e.message; }
  }
  // find which element paints white at mid-viewport
  const mid = document.elementFromPoint(720, 450);
  out.elementAtMid = mid ? mid.className?.toString?.().slice(0, 90) ?? mid.tagName : null;
  let n = mid;
  const chain = [];
  while (n && chain.length < 8) { chain.push((n.tagName || "") + "." + (typeof n.className === "string" ? n.className.slice(0, 40) : "")); n = n.parentElement; }
  out.chain = chain;
  return out;
});
console.log(JSON.stringify(probe, null, 1));

// shot with ONLY the ember canvas removed (first canvas under main)
await page.evaluate(() => {
  const main = document.querySelector("main");
  const first = main?.querySelector("canvas");
  window.__removed = first;
  first?.remove();
});
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/shot-noember.png" });
// restore, then remove the books-showcase canvas instead
await page.evaluate(() => {
  const main = document.querySelector("main");
  const ember = main?.querySelector("canvas");
  if (ember && window.__emberRef) main.prepend(window.__emberRef);
  const all = [...document.querySelectorAll("canvas")];
  const showcase = all.find((c) => c !== window.__emberRef);
  showcase?.remove();
});
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/shot-noshowcase.png" });
console.log("saved /tmp/shot-noember.png /tmp/shot-noshowcase.png");
await browser.close();