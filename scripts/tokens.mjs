// Eksport tokenów systemu projektowego CFAB (shared/cfab_ui/tokens.json) do
// zmiennych CSS i kopia fontów Geist. Jedno źródło prawdy dla Qt, Slinta i weba
// (rozdz. 9.2 wytycznych) — kod mapy nie zawiera literałów kolorów.
import fs from "node:fs";
import path from "node:path";
import { ROOT, HUB_ROOT } from "./paths.mjs";

const uiDir = path.join(HUB_ROOT, "shared/cfab_ui");
const tokens = JSON.parse(fs.readFileSync(path.join(uiDir, "tokens.json"), "utf8"));
const lines = [":root {"];

for (const [name, value] of Object.entries(tokens)) {
  if (typeof value === "string") lines.push(`  --${name.replaceAll("_", "-")}: ${value};`);
}
for (const [name, value] of Object.entries(tokens.dimensions)) {
  lines.push(`  --${name.replaceAll("_", "-")}: ${value}px;`);
}
for (const [name, t] of Object.entries(tokens.typography)) {
  const key = name.replace(/^type_/, "").replaceAll("_", "-");
  lines.push(`  --type-${key}-size: ${t.size}px;`, `  --type-${key}-weight: ${t.weight};`);
}
lines.push(`  --font-ui: "${tokens.fonts.ui.family}", system-ui, sans-serif;`);
lines.push(`  --font-mono: "${tokens.fonts.mono.family}", ui-monospace, monospace;`);
lines.push("}");

const faces = [];
const fontOut = path.join(ROOT, "src/generated/fonts");
fs.mkdirSync(fontOut, { recursive: true });
for (const font of Object.values(tokens.fonts)) {
  for (const file of font.files) {
    fs.copyFileSync(path.join(uiDir, "fonts", file), path.join(fontOut, file));
    const weight = /SemiBold/.test(file) ? 600 : 400;
    faces.push(`@font-face { font-family: "${font.family}"; src: url("./fonts/${file}") format("truetype"); font-weight: ${weight}; font-display: block; }`);
  }
}
fs.copyFileSync(path.join(uiDir, "fonts/OFL.txt"), path.join(fontOut, "OFL.txt"));

const out = path.join(ROOT, "src/generated/tokens.css");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `/* Wygenerowane przez scripts/tokens.mjs z shared/cfab_ui/tokens.json — nie edytuj ręcznie. */\n${faces.join("\n")}\n${lines.join("\n")}\n`);
console.log(`tokens.css: ${lines.length - 2} zmiennych, ${faces.length} fontów`);
