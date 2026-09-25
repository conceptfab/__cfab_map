// Walidacja features_data.json wg rozdz. 6.5 wytycznych. Błąd = kod wyjścia 1.
import fs from "node:fs";
import path from "node:path";
import { HUB_ROOT, OUT_JSON, resolveSource } from "./paths.mjs";

// Tabela 5.0 wytycznych. Rozjazd oznacza, że dokument albo dane są nieaktualne.
const EXPECTED = { ecosystem: 2, module: 30, bridge: 7, feature: 139 };
const STAGES = ["assets", "scene", "inspection", "render", "results", "tracking", "billing", "report"];
const SHORT_MAX = 28;

const data = JSON.parse(fs.readFileSync(OUT_JSON, "utf8"));
// Build bez sąsiednich repozytoriów (np. Vercel): sprawdzamy tylko zacommitowane dane.
const OFFLINE = !fs.existsSync(HUB_ROOT);
const errors = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);
const ids = new Set();
const filled = (l) => l && typeof l.pl === "string" && l.pl.trim() && typeof l.en === "string" && l.en.trim();

for (const n of data.nodes) {
  if (ids.has(n.id)) err(n.id, "zdublowany id");
  ids.add(n.id);
}
const assumptionIds = new Set(data.assumptions.map((a) => a.id));
const blockOrders = new Map();

for (const n of data.nodes) {
  // 1. rodzic istnieje
  if (n.parentId !== null && !ids.has(n.parentId)) err(n.id, `parentId ${n.parentId} nie istnieje`);
  if (n.nodeType === "feature" && n.parentId === null) err(n.id, "funkcja bez rodzica");
  // 2. oba języki
  for (const f of ["title", "shortTitle", "summary"]) if (!filled(n[f])) err(n.id, `brak ${f}.pl albo ${f}.en`);
  // 3. moat z opisem w obu językach
  if (n.techMoat.isUniqueMoat && !filled(n.techMoat.description)) err(n.id, "moat bez opisu PL/EN");
  // 4. liczby wartości biznesowej mają założenie
  const bv = n.businessValue;
  const nonZero = bv.timeSavedHoursMonth || bv.costAvoidedPerSeatMonthUSD || bv.revenueRecoveryPct;
  if (nonZero && !assumptionIds.has(bv.assumptionId)) err(n.id, `liczba bez założenia (${bv.assumptionId || "brak"})`);
  // 5. gotowa funkcja ma istniejące źródło
  if (data.meta.distribution === "internal") {
    if (n.nodeType === "feature" && n.status === "production" && n.sources.length === 0) err(n.id, "funkcja production bez sources");
    if (!OFFLINE) for (const s of n.sources) if (!fs.existsSync(resolveSource(s))) err(n.id, `źródło nie istnieje: ${s}`);
  }
  // 7. krótki tytuł
  for (const l of ["pl", "en"]) {
    const len = [...(n.shortTitle?.[l] ?? "")].length;
    if (len > SHORT_MAX) err(n.id, `shortTitle.${l} ma ${len} znaków (maks. ${SHORT_MAX}): „${n.shortTitle[l]}”`);
  }
  // 8. etap i kolejność
  if (n.nodeType === "feature" || n.nodeType === "bridge") {
    if (n.stage !== null && !STAGES.includes(n.stage)) err(n.id, `nieznany etap ${n.stage}`);
    const key = `${n.parentId}|${n.stage}`;
    const seen = blockOrders.get(key) ?? new Set();
    if (seen.has(n.order)) err(n.id, `order ${n.order} powtórzony w bloku ${key}`);
    seen.add(n.order);
    blockOrders.set(key, seen);
  }
  // status i nota
  if (!["production", "beta", "roadmap"].includes(n.status)) err(n.id, `nieznany status ${n.status}`);
  if (n.status !== "production" && !filled(n.statusNote)) err(n.id, `status ${n.status} bez noty PL/EN`);
  if (!filled(n.summary)) err(n.id, "brak summary");
}

for (const e of data.edges) {
  if (!ids.has(e.from)) err(e.id, `from ${e.from} nie istnieje`);
  if (!ids.has(e.to)) err(e.id, `to ${e.to} nie istnieje`);
  if (e.label && !filled(e.label)) err(e.id, "etykieta bez PL/EN");
}

// Przewaga jest tezą popartą gotowymi funkcjami, nie dowolną flagą na węźle.
if (!Array.isArray(data.advantages) || data.advantages.length < 3 || data.advantages.length > 6) {
  err("advantages", "wymagane 3–6 przewag");
}
const advantageIds = new Set();
const ranks = new Set();
const evidenceOwner = new Map();
for (const a of data.advantages ?? []) {
  if (advantageIds.has(a.id)) err(a.id, "zdublowany id przewagi");
  advantageIds.add(a.id);
  if (!Number.isInteger(a.rank) || ranks.has(a.rank)) err(a.id, `nieunikalny lub nieprawidłowy rank ${a.rank}`);
  ranks.add(a.rank);
  for (const field of ["title", "thesis", "why"]) if (!filled(a[field])) err(a.id, `brak ${field}.pl albo ${field}.en`);
  if (!Array.isArray(a.replacesTools) || a.replacesTools.some((item) => !filled(item))) err(a.id, "brak tłumaczenia replacesTools");
  if (a.flow !== null && (!Array.isArray(a.flow) || a.flow.some((step) => !filled(step)))) err(a.id, "brak tłumaczenia flow");
  if (a.assumptionId !== null && !assumptionIds.has(a.assumptionId)) err(a.id, `assumptionId ${a.assumptionId} nie istnieje`);
  if (!Array.isArray(a.ids) || a.ids.length < 5) err(a.id, "mniej niż 5 dowodów");
  for (const id of a.ids ?? []) {
    const node = data.nodes.find((item) => item.id === id);
    if (!node) err(a.id, `dowód ${id} nie istnieje`);
    else if (node.status !== "production" || !["feature", "bridge"].includes(node.nodeType)) err(a.id, `dowód ${id} nie jest gotową funkcją`);
    if (evidenceOwner.has(id)) err(a.id, `dowód ${id} należy też do ${evidenceOwner.get(id)}`);
    evidenceOwner.set(id, a.id);
  }
}
if (!Array.isArray(data.alsoStrong)) err("alsoStrong", "brak listy");
for (const id of data.alsoStrong ?? []) if (!ids.has(id)) err("alsoStrong", `węzeł ${id} nie istnieje`);
for (const node of data.nodes) if (node.advantageId !== (evidenceOwner.get(node.id) ?? null)) err(node.id, "advantageId nie zgadza się z listą dowodów");

// 6. wersje zgodne z repozytorium Huba
if (!OFFLINE) {
  const hubVersion = fs.readFileSync(path.join(HUB_ROOT, "VERSION"), "utf8").trim();
  const release = JSON.parse(fs.readFileSync(path.join(HUB_ROOT, "RELEASE.json"), "utf8"));
  if (data.meta.hubVersion !== hubVersion) err("meta", `hubVersion ${data.meta.hubVersion} ≠ VERSION ${hubVersion}`);
  if (JSON.stringify(data.meta.contracts) !== JSON.stringify(release.contracts)) err("meta", "contracts ≠ RELEASE.json");
}

// 9. liczby z tabeli 5.0
for (const [type, expected] of Object.entries(EXPECTED)) {
  const actual = data.nodes.filter((n) => n.nodeType === type).length;
  if (actual !== expected) err("licznik", `${type}: ${actual} w danych, ${expected} w tabeli 5.0`);
}

if (errors.length) {
  console.error(`Walidacja: ${errors.length} błędów\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log(`Walidacja: OK (${data.nodes.length} elementów, ${data.edges.length} relacji)${OFFLINE ? " — bez repozytorium Huba: pominięto źródła i wersje" : ""}`);
