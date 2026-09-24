// Zrzut mapy (domyślnie okno 1440 × 900) + pomiar czytelności (rozdz. 5.5.6, 12.4):
// czy mapa mieści się bez przewijania i czy żaden chip nie ma uciętego tekstu.
// Użycie: node scripts/shot.mjs [pl|en] [1440x900]   (najpierw npm run build)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { ROOT } from "./paths.mjs";

const lang = process.argv[2] === "en" ? "en" : "pl";
const [width, height] = (process.argv[3] ?? "1440x900").split("x").map(Number);
const dist = path.join(ROOT, "dist");
const outDir = path.join(ROOT, "shots");
fs.mkdirSync(outDir, { recursive: true });

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".ttf": "font/ttf" };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(dist, rel === "/" ? "index.html" : rel);
  if (!file.startsWith(dist) || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const url = `http://127.0.0.1:${server.address().port}/?lang=${lang}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(url);
await page.evaluate(() => document.fonts.ready);

const report = await page.evaluate(() => {
  const chips = [...document.querySelectorAll(".chip .label")];
  const cut = chips.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent);
  const columns = [...document.querySelectorAll(".column")].map((c) => ({
    title: c.querySelector(".column-title")?.textContent, bottom: Math.round(c.getBoundingClientRect().bottom),
  }));
  const minFont = Math.min(...[...document.querySelectorAll("body *")].filter((el) => el.childElementCount === 0 && el.textContent.trim())
    .map((el) => parseFloat(getComputedStyle(el).fontSize)));
  return { chips: chips.length, cut, pageHeight: document.documentElement.scrollHeight, columns, minFont };
});

const base = path.join(outDir, `mapa-${lang}-${width}x${height}`);
await page.screenshot({ path: `${base}.png` });
await page.screenshot({ path: `${base}-full.png`, fullPage: true });
await browser.close();
server.close();

console.log(JSON.stringify({ ...report, fitsOneScreen: report.pageHeight <= height, shot: `${base}.png` }, null, 2));
