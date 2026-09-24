// Składa features_data.json ze źródła treści (data/source.mjs) i z numerów
// wersji w repozytoriach Huba i TIMEFLOW (rozdz. 10.1 wytycznych).
// Użycie: node scripts/build-data.mjs [--public]
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { HUB_ROOT, TF_ROOT, OUT_JSON, OUT_PUBLIC_JSON } from "./paths.mjs";
import { ecosystems, modules, bridges, features, assumptions, advantages, alsoStrong, edges } from "../data/source.mjs";

const PUBLIC = process.argv.includes("--public");
const read = (p) => fs.readFileSync(p, "utf8").trim();

const release = JSON.parse(read(path.join(HUB_ROOT, "RELEASE.json")));
const hubVersion = read(path.join(HUB_ROOT, "VERSION"));
const timeflowVersion = read(path.join(TF_ROOT, "VERSION"));
let sourceCommit = null;
try {
  sourceCommit = execSync("git rev-parse --short HEAD", { cwd: HUB_ROOT }).toString().trim();
} catch { /* repo bez gita — pole zostaje puste */ }

const lang = ([pl, en]) => ({ pl, en });
const langOrNull = (v) => (v ? lang(v) : null);
const appOf = (id) => (id.startsWith("hub") ? "cfab_hub" : id.startsWith("tf") ? "timeflow" : "synergy");
const ZERO_BV = { timeSavedHoursMonth: 0, costAvoidedPerSeatMonthUSD: 0, revenueRecoveryPct: 0, financialGainType: "cost_reduction", assumptionId: "" };

const nodes = [];
const versionOf = new Map();

ecosystems.forEach((e, i) => {
  const version = e.versionFrom === "package" ? hubVersion : timeflowVersion;
  versionOf.set(e.id, version);
  nodes.push({
    id: e.id, nodeType: "ecosystem", app: e.app, module: "", parentId: null,
    title: lang(e.t), shortTitle: lang(e.sh), summary: lang(e.d),
    category: "core", stage: null, order: i, audiences: [],
    techMoat: { isUniqueMoat: false, description: null },
    techStack: e.tech, replacesTools: [], businessValue: { ...ZERO_BV },
    status: "production", statusNote: null, version, contract: null, sources: [], keywords: [],
  });
});

// Status modułu wynika z jego funkcji: gotowy, gdy ma choć jedną gotową funkcję.
const featuresOf = (moduleId) => features.filter((f) => f.p === moduleId);
function moduleStatus(moduleId) {
  const own = featuresOf(moduleId);
  if (own.length === 0 || own.some((f) => f.st === "production")) return "production";
  return own.some((f) => f.st === "beta") ? "beta" : "roadmap";
}

modules.forEach((m, i) => {
  const version = m.part ? release.parts[m.part] ?? null : timeflowVersion;
  versionOf.set(m.id, version);
  nodes.push({
    id: m.id, nodeType: "module", app: appOf(m.id), module: m.p, parentId: m.p,
    title: lang(m.t), shortTitle: lang(m.t), summary: lang(m.d),
    category: m.c, stage: null, order: i, audiences: [],
    techMoat: { isUniqueMoat: false, description: null },
    techStack: [], replacesTools: [], businessValue: { ...ZERO_BV },
    status: moduleStatus(m.id), statusNote: null, version,
    contract: null, sources: m.part ? [`hub:${m.part}`] : [], keywords: [m.t[0].toLowerCase(), m.t[1].toLowerCase()],
  });
});

function leaf(f, nodeType, id, parent, order) {
  return {
    id, nodeType, app: appOf(id), module: parent ?? "", parentId: parent ?? null,
    title: lang(f.t), shortTitle: lang(f.sh), summary: lang(f.d),
    category: f.c ?? "integration", stage: f.s, order,
    audiences: f.aud ?? (id.startsWith("hub") ? ["artist", "tech_director"] : id.startsWith("tf") ? ["artist", "agency_owner"] : ["agency_owner", "investor"]),
    techMoat: { isUniqueMoat: Boolean(f.m), description: langOrNull(f.m) },
    techStack: f.tech ?? [], replacesTools: f.rep ?? [],
    businessValue: { ...ZERO_BV, ...(f.bv ?? {}) },
    status: f.st, statusNote: langOrNull(f.note),
    version: parent ? versionOf.get(parent) ?? null : null,
    contract: f.k ?? null, sources: f.src ?? [], keywords: f.kw ?? [],
  };
}

bridges.forEach((b, i) => nodes.push(leaf(b, "bridge", b.id, null, i)));

const orderInBlock = new Map();
for (const f of features) {
  const key = `${f.p}|${f.s}`;
  const order = orderInBlock.get(key) ?? 0;
  orderInBlock.set(key, order + 1);
  nodes.push(leaf(f, "feature", `${f.p}.${f.id}`, f.p, order));
}

const edgeList = edges.map(([from, to, type, label, contract, status], i) => ({
  id: `e${String(i + 1).padStart(3, "0")}.${from}->${to}`,
  from, to, type, label: label ? lang(label.length === 1 ? [label[0], label[0]] : label) : null,
  contract, animated: type === "data_flow" || type === "file_exchange", status,
}));

const advantageIdOf = new Map();
for (const advantage of advantages) for (const id of advantage.ids) {
  if (!advantageIdOf.has(id)) advantageIdOf.set(id, advantage.id);
}
for (const node of nodes) node.advantageId = advantageIdOf.get(node.id) ?? null;
const advantageList = advantages.map((advantage) => ({
  id: advantage.id,
  rank: advantage.rank,
  title: lang(advantage.t),
  thesis: lang(advantage.d),
  why: lang(advantage.why),
  replacesTools: advantage.rep.map(lang),
  assumptionId: advantage.assumptionId,
  flow: advantage.flow?.map(lang) ?? null,
  ids: advantage.ids,
}));

if (PUBLIC) {
  // Poziom inwestorski / publiczny (rozdz. 11.2): bez ścieżek, zostaje nazwa modułu.
  const titleOf = new Map(nodes.map((n) => [n.id, n.title.en]));
  for (const n of nodes) n.sources = n.parentId && n.nodeType === "feature" ? [titleOf.get(n.parentId)] : [];
}

const data = {
  meta: {
    generatedAt: new Date().toISOString(),
    hubVersion, timeflowVersion,
    contracts: release.contracts,
    sourceCommit,
    distribution: PUBLIC ? "investor" : "internal",
  },
  nodes, edges: edgeList,
  assumptions, advantages: advantageList, alsoStrong,
};

for (const out of PUBLIC ? [OUT_JSON, OUT_PUBLIC_JSON] : [OUT_JSON]) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
}
const count = (t) => nodes.filter((n) => n.nodeType === t).length;
console.log(`features_data.json: ${nodes.length} elementów (ecosystem ${count("ecosystem")}, module ${count("module")}, bridge ${count("bridge")}, feature ${count("feature")}), ${edgeList.length} relacji, poziom ${data.meta.distribution}`);
