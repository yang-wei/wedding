// Screenshot helper: node shot.js <outfile> [selector]
const puppeteer = require("puppeteer");

(async () => {
  const out = process.argv[2] || "shot.png";
  const selector = process.argv[3] || null;
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:8123/index.html", { waitUntil: "networkidle2", timeout: 60000 });
  // give Framer hydration + appear animations time to settle
  await new Promise((r) => setTimeout(r, 2500));
  if (selector) {
    const el = await page.$(selector);
    if (el) { await el.screenshot({ path: out }); }
    else { console.log("selector not found, full page"); await page.screenshot({ path: out }); }
  } else {
    await page.screenshot({ path: out });
  }
  // report what the hero img actually resolved to
  const heroSrc = await page.evaluate(() => {
    const el = document.querySelector(".framer-1ns6yyg img");
    return el ? (el.currentSrc || el.src) : "(no .framer-1ns6yyg img found)";
  });
  console.log("HERO IMG SRC:", heroSrc);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
