import type { FeatureEdge, FeatureNode, FeaturesData, Lang, Stage } from "./types";
import { STAGES } from "./i18n";

export type Group = Stage | "foundation";
export type Point = { id: string; node: FeatureNode; group: Group; x: number; y: number; centerX: number; centerY: number; orbitRadius: number; angle: number };
export type Relation = "feature" | "module" | "integration";
export type GraphLink = { id: string; source: Point; target: Point; kind: string; relation: Relation; label: Lang | null; animated: boolean };
export type Orbit = { id: string; x: number; y: number; radius: number };
// Annular wedge behind one module's features: the ring reads as a share chart.
export type Sector = { id: string; app: FeatureNode["app"]; group: Group; module: Point | null; count: number; x: number; y: number; start: number; end: number };
// Contiguous run of sectors of one stage, labelled on the outer arc.
export type StageArc = { id: string; app: FeatureNode["app"]; group: Group; x: number; y: number; start: number; end: number };

export const SECTOR_INNER = 250;
export const SECTOR_OUTER = 500;
export const ARC_RADIUS = 516;

const STAGE_ORDER: Record<Group, number> = { ...Object.fromEntries(STAGES.map((s, i) => [s.id, i])), foundation: STAGES.length } as Record<Group, number>;

export function nodeGroups(data: FeaturesData): Map<string, Group> {
  const groups = new Map<string, Group>();
  for (const node of data.nodes) {
    if (node.stage) { groups.set(node.id, node.stage); continue; }
    if (node.nodeType !== "module") { groups.set(node.id, "foundation"); continue; }
    const counts = new Map<Group, number>();
    data.nodes.filter(n => n.parentId === node.id).forEach(n => {
      const stage = n.stage ?? "foundation";
      counts.set(stage, (counts.get(stage) ?? 0) + 1);
    });
    // A module uses its largest work-stage group. Individual features keep their own stage.
    groups.set(node.id, [...counts].sort((a,b) => b[1]-a[1])[0]?.[0] ?? "foundation");
  }
  return groups;
}

function majorityGroup(points: Point[]): Group {
  const counts = new Map<Group, number>();
  points.forEach(p => counts.set(p.group, (counts.get(p.group) ?? 0) + 1));
  return [...counts].sort((a,b) => b[1]-a[1] || STAGE_ORDER[a[0]] - STAGE_ORDER[b[0]])[0]?.[0] ?? "foundation";
}

export function layoutGraph(data: FeaturesData, width: number, _height: number) {
  const groups = nodeGroups(data);
  const vertical = width < 700;
  const worldWidth = vertical ? 1120 : 2500;
  const worldHeight = vertical ? 2440 : 1120;
  const centers = [{ app: "cfab_hub", x: 560, y: 560 },
    { app: "timeflow", x: vertical ? 560 : 1940, y: vertical ? 1880 : 560 }];
  const orbits: Orbit[] = [];
  const sectors: Sector[] = [];
  const stageArcs: StageArc[] = [];
  const points: Point[] = data.nodes.map(node => ({ id: node.id, node, group: groups.get(node.id) ?? "foundation", x: 0, y: 0, centerX: 0, centerY: 0, orbitRadius: 0, angle: 0 }));
  const byId = new Map(points.map(p => [p.id, p]));
  const byStage = (a: Point, b: Point) => STAGE_ORDER[a.group] - STAGE_ORDER[b.group] || a.node.order - b.node.order || a.id.localeCompare(b.id);
  for (const center of centers) {
    const owned = points.filter(p => p.node.app === center.app);
    const root = owned.find(p => p.node.nodeType === "ecosystem");
    if (!root) continue;
    root.x = center.x; root.y = center.y;
    for (const radius of [220, 350, 460]) orbits.push({ id: `${center.app}-${radius}`, x: center.x, y: center.y, radius });
    const modules = owned.filter(p => p.node.nodeType === "module");
    const buckets = modules.map(module => ({ module, features: owned.filter(p => p.node.nodeType === "feature" && p.node.parentId === module.id) }));
    const assigned = new Set(buckets.flatMap(b => b.features.map(p => p.id)));
    const direct = owned.filter(p => p.node.nodeType === "feature" && !assigned.has(p.id));
    // Direct application features occupy their own sector, without a fabricated module.
    const sectorList: { module: Point | null; features: Point[]; group: Group }[] = [
      ...buckets.map(b => ({ ...b, group: b.module.group })),
      ...(direct.length ? [{ module: null, features: direct, group: majorityGroup(direct) }] : []),
    ];
    // Sectors follow the working day: stage order, then module order. Foundation
    // comes last and sits centred at the bottom of the ring.
    sectorList.sort((a, b) => STAGE_ORDER[a.group] - STAGE_ORDER[b.group] || (a.module?.node.order ?? 1000) - (b.module?.node.order ?? 1000));
    const weights = sectorList.map(b => Math.max(2.5, b.features.length / 2));
    const total = weights.reduce((a,b) => a+b,0);
    const foundationSpan = sectorList.reduce((sum, s, i) => s.group === "foundation" ? sum + weights[i] / total * Math.PI * 2 : sum, 0);
    let cursor = Math.PI / 2 + foundationSpan / 2;
    const place = (point: Point, angle: number, radius: number) => {
      Object.assign(point, { centerX: center.x, centerY: center.y, orbitRadius: radius, angle,
        x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius });
    };
    sectorList.forEach((bucket,index) => {
      const span = weights[index] / total * Math.PI * 2;
      if (bucket.module) place(bucket.module, cursor + span / 2, 220);
      const features = [...bucket.features].sort(byStage);
      const slots = Math.ceil(features.length / 2);
      features.forEach((feature,i) => place(feature, cursor + span * ((Math.floor(i/2)+0.5)/slots), i % 2 ? 460 : 350));
      sectors.push({ id: bucket.module?.id ?? `${center.app}-direct`, app: center.app as FeatureNode["app"], group: bucket.group, module: bucket.module, count: features.length, x: center.x, y: center.y, start: cursor, end: cursor + span });
      const last = stageArcs[stageArcs.length - 1];
      if (last && last.app === center.app && last.group === bucket.group) last.end = cursor + span;
      else stageArcs.push({ id: `${center.app}-${bucket.group}`, app: center.app as FeatureNode["app"], group: bucket.group, x: center.x, y: center.y, start: cursor, end: cursor + span });
      cursor += span;
    });
  }
  const bridges = points.filter(p => p.node.app === "synergy");
  bridges.forEach((p,i) => {
    p.x = vertical ? 340 + (i % 2) * 440 : worldWidth / 2 + (i % 2 ? 120 : -120);
    p.y = vertical ? 1110 + Math.floor(i/2) * 66 : 325 + i * 66;
  });
  const links: GraphLink[] = [];
  const hierarchy = new Map<string, GraphLink>();
  for (const point of points) {
    const parent = point.node.parentId ? byId.get(point.node.parentId) : undefined;
    if (!parent) continue;
    const link: GraphLink = { id: `h-${point.id}`, source: point, target: parent, kind: "hierarchy", relation: point.node.nodeType === "module" ? "module" : "feature", label: null, animated: false };
    hierarchy.set([point.id,parent.id].sort().join("|"),link);
    links.push(link);
  }
  const flows = (edge: FeatureEdge) => edge.animated && (edge.type === "data_flow" || edge.type === "file_exchange");
  for (const edge of data.edges) {
    const source = byId.get(edge.from), target = byId.get(edge.to);
    if (!source || !target) continue;
    const existing = hierarchy.get([source.id,target.id].sort().join("|"));
    if (existing) { Object.assign(existing, { id: edge.id, source, target, kind: edge.type, relation: "integration", label: edge.label, animated: flows(edge) }); }
    else links.push({ id: edge.id, source, target, kind: edge.type, relation: "integration", label: edge.label, animated: flows(edge) });
  }
  return { points, links, byId, orbits, sectors, stageArcs, worldWidth, worldHeight };
}

// SVG arc helpers shared by wedges and stage labels. Angles are in SVG space (y down).
export const polar = (x: number, y: number, r: number, a: number) => `${x + Math.cos(a) * r} ${y + Math.sin(a) * r}`;
export function wedgePath(s: { x: number; y: number; start: number; end: number }, inner: number, outer: number, gap = 0.012) {
  const a0 = s.start + gap / 2, a1 = s.end - gap / 2;
  if (a1 <= a0) return "";
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${polar(s.x, s.y, outer, a0)} A ${outer} ${outer} 0 ${large} 1 ${polar(s.x, s.y, outer, a1)} L ${polar(s.x, s.y, inner, a1)} A ${inner} ${inner} 0 ${large} 0 ${polar(s.x, s.y, inner, a0)} Z`;
}
// Text on the lower half is drawn along a reversed arc so it never reads upside down.
export function arcPath(s: { x: number; y: number; start: number; end: number }, r: number, gap = 0.03) {
  const a0 = s.start + gap, a1 = s.end - gap;
  const mid = (a0 + a1) / 2;
  const below = Math.sin(mid) > 0;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return below
    ? { d: `M ${polar(s.x, s.y, r, a1)} A ${r} ${r} 0 ${large} 0 ${polar(s.x, s.y, r, a0)}`, below, length: r * (a1 - a0) }
    : { d: `M ${polar(s.x, s.y, r, a0)} A ${r} ${r} 0 ${large} 1 ${polar(s.x, s.y, r, a1)}`, below, length: r * (a1 - a0) };
}
