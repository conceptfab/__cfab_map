export type Lang = { pl: string; en: string };
export type LangKey = keyof Lang;
export type Status = "production" | "beta" | "roadmap";
export type NodeType = "ecosystem" | "module" | "bridge" | "feature";
export type App = "cfab_hub" | "timeflow" | "synergy";
export type Stage = "assets" | "scene" | "inspection" | "render" | "results" | "tracking" | "billing" | "report";

export interface FeatureNode {
  id: string;
  nodeType: NodeType;
  app: App;
  module: string;
  parentId: string | null;
  title: Lang;
  shortTitle: Lang;
  summary: Lang;
  category: string;
  stage: Stage | null;
  order: number;
  audiences: string[];
  techMoat: { isUniqueMoat: boolean; description: Lang | null };
  techStack: string[];
  replacesTools: string[];
  status: Status;
  statusNote: Lang | null;
  version: string | null;
  contract: string | null;
  sources: string[];
  keywords: string[];
  advantageId: string | null;
}

export interface Advantage {
  id: string;
  rank: number;
  title: Lang;
  thesis: Lang;
  why: Lang;
  replacesTools: Lang[];
  assumptionId: string | null;
  flow: Lang[] | null;
  ids: string[];
}

export interface Assumption {
  id: string;
  pl: string;
  en: string;
  value: number;
  maxValue?: number;
  unit: string;
  source: string;
}

export interface FeatureEdge {
  id: string;
  from: string;
  to: string;
  type: "hierarchy" | "data_flow" | "ipc" | "file_exchange" | "depends_on" | "replaces";
  label: Lang | null;
  contract: string | null;
  animated: boolean;
  status: Status;
}

export interface FeaturesData {
  meta: { generatedAt: string; hubVersion: string; timeflowVersion: string; sourceCommit: string | null; distribution: string };
  nodes: FeatureNode[];
  edges: FeatureEdge[];
  assumptions: Assumption[];
  advantages: Advantage[];
  alsoStrong: string[];
}
