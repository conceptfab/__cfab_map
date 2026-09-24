import type { App, FeatureNode, FeaturesData, Stage } from "./types";

// Układ mapy zakresu (rozdz. 5.1.1): kolumna = etap, w kolumnie bloki
// w kolejności Hub → Pomost → TIMEFLOW, w bloku funkcje wg pola order.
// Wszystko wynika z danych; ta sama wersja danych daje zawsze ten sam układ.

export interface Block {
  key: string;          // parentId (albo "synergy") + etap
  ownerId: string;      // moduł, program albo "synergy"
  app: App;
  title: FeatureNode["title"] | null; // null = integracja aplikacji (tytuł ze słownika)
  items: FeatureNode[];
}

const APP_ORDER: Record<App, number> = { cfab_hub: 0, synergy: 1, timeflow: 2 };

export function buildBlocks(data: FeaturesData, stage: Stage | null): Block[] {
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  const groups = new Map<string, Block>();

  for (const n of data.nodes) {
    if ((n.nodeType !== "feature" && n.nodeType !== "bridge") || n.stage !== stage) continue;
    const ownerId = n.nodeType === "bridge" ? "synergy" : n.parentId!;
    let block = groups.get(ownerId);
    if (!block) {
      const owner = byId.get(ownerId);
      block = { key: `${ownerId}|${stage}`, ownerId, app: n.app, title: owner ? owner.title : null, items: [] };
      groups.set(ownerId, block);
    }
    block.items.push(n);
  }

  // Kolejność bloków: program, potem moduły wg railu/nawigacji; funkcje
  // przypięte wprost do programu (poza nawigacją) na końcu jego części.
  const rank = (b: Block) => {
    const owner = byId.get(b.ownerId);
    const moduleOrder = owner?.nodeType === "module" ? owner.order : 1000;
    return APP_ORDER[b.app] * 10000 + moduleOrder;
  };
  const blocks = [...groups.values()].sort((a, b) => rank(a) - rank(b));
  for (const b of blocks) b.items.sort((x, y) => (x.nodeType === y.nodeType ? x.order - y.order : x.nodeType === "bridge" ? 1 : -1));
  return blocks;
}

export function metrics(data: FeaturesData) {
  const count = (type: FeatureNode["nodeType"]) => data.nodes.filter((n) => n.nodeType === type).length;
  // Mosty DCC = funkcje z kontraktem protokołu mostu, poza planowanymi (tabela 2.7 bez RizomUV).
  const bridges = data.nodes.filter(
    (n) => n.nodeType === "feature" && n.contract?.includes("bridge_protocol") && n.status !== "roadmap",
  ).length;
  return {
    systems: count("ecosystem"),
    modules: count("module"),
    features: count("feature"),
    bridges,
    mcp: 2, // stała z tabeli kafelków w rozdz. 5.6: MCP Huba + MCP TIMEFLOW
  };
}
