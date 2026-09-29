import type { LangKey, Stage } from "./types";

// Słownik interfejsu. Teksty ekranu startowego i nazwy etapów — rozdz. 5.6 wytycznych.
export const STAGES: { id: Stage; pl: string; en: string }[] = [
  { id: "assets", pl: "Zasoby", en: "Assets" },
  { id: "scene", pl: "Scena", en: "Scene" },
  { id: "inspection", pl: "Inspekcja i naprawa", en: "Inspect & fix" },
  { id: "render", pl: "Render", en: "Render" },
  { id: "results", pl: "Wyniki", en: "Results" },
  { id: "tracking", pl: "Czas pracy", en: "Time tracking" },
  { id: "billing", pl: "Koszty i wycena", en: "Costs & estimates" },
  { id: "report", pl: "Raporty i rentowność", en: "Reports & profitability" },
];

// Krótkie nazwy etapów na łuki wokół orbit (chmura); pełne nazwy zostają w legendzie.
export const STAGE_ARC: Record<Stage | "foundation", { pl: string; en: string }> = {
  assets: { pl: "Zasoby", en: "Assets" },
  scene: { pl: "Scena", en: "Scene" },
  inspection: { pl: "Inspekcja", en: "Inspection" },
  render: { pl: "Render", en: "Render" },
  results: { pl: "Wyniki", en: "Results" },
  tracking: { pl: "Czas pracy", en: "Time" },
  billing: { pl: "Wycena", en: "Costs" },
  report: { pl: "Raporty", en: "Reports" },
  foundation: { pl: "Fundament", en: "Foundation" },
};

const STRINGS = {
  viewAdvantages: { pl: "Przewagi", en: "Advantages" },
  mapTitle: { pl: "Mapa funkcjonalności", en: "Feature map" },
  viewCloud: { pl: "Chmura", en: "Cloud" },
  viewGrid: { pl: "Etapy pracy", en: "Work stages" },
  edgeData: { pl: "przepływ danych", en: "data flow" },
  edgeIpc: { pl: "most IPC", en: "IPC bridge" },
  edgeFile: { pl: "wymiana plików", en: "file exchange" },
  moat: { pl: "Dlaczego trudno to skopiować", en: "Why it's hard to copy" },
  stack: { pl: "Technologia", en: "Technology" },
  replaces: { pl: "Zastępuje", en: "Replaces" },
  contract: { pl: "Kontrakt", en: "Contract" },
  explore: {
    pl: "Najedź na punkt, żeby zobaczyć, z czym się łączy. Kółko myszy przybliża.",
    en: "Hover any node to see what it connects to. Scroll to zoom.",
  },
  foundation: { pl: "Fundament", en: "Foundation" },
  synergy: { pl: "Połączenie Huba i TIMEFLOW", en: "Hub and TIMEFLOW integration" },
  features: { pl: "funkcji", en: "features" },
  metricSystems: { pl: "Systemy", en: "Systems" },
  metricModules: { pl: "Moduły", en: "Modules" },
  metricFeatures: { pl: "Funkcje aplikacji", en: "Application features" },
  metricBridges: { pl: "Mosty do programów 3D", en: "3D app bridges" },
  metricMcp: { pl: "Serwery MCP dla agentów AI", en: "MCP servers for AI agents" },
  metricIntegrations: { pl: "Integracje Hub–TIMEFLOW", en: "Hub–TIMEFLOW integrations" },
} satisfies Record<string, { pl: string; en: string }>;

export type StringKey = keyof typeof STRINGS;
export const t = (key: StringKey, lang: LangKey) => STRINGS[key][lang];
