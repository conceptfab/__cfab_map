import type { FeatureNode, FeaturesData, Stage } from "./types";

export type Group = Stage | "foundation";
export type Point = { id: string; node: FeatureNode; group: Group; x: number; y: number; centerX: number; centerY: number; orbitRadius: number; angle: number; direction: number };
export type Relation = "feature" | "module" | "integration";
export type GraphLink = { source: Point; target: Point; kind: string; relation: Relation };
export type Orbit = { id: string; x: number; y: number; radius: number };

// One revolution in six minutes. Nodes from the same application move together,
// so every module keeps its features in the same angular sector.
export function orbitalPosition(point: Point, seconds: number) {
  if (!point.orbitRadius) return { x: point.x, y: point.y };
  const angle = point.angle + seconds * Math.PI / 180 * point.direction;
  return { x: point.centerX + Math.cos(angle) * point.orbitRadius, y: point.centerY + Math.sin(angle) * point.orbitRadius };
}

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

export function layoutGraph(data: FeaturesData, width: number, _height: number) {
  const groups = nodeGroups(data);
  const vertical = width < 700;
  const worldWidth = vertical ? 1120 : 2500;
  const worldHeight = vertical ? 2440 : 1120;
  const centers = [{ app: "cfab_hub", x: 560, y: 560, direction: 1 },
    { app: "timeflow", x: vertical ? 560 : 1940, y: vertical ? 1880 : 560, direction: -1 }];
  const orbits: Orbit[] = [];
  const points: Point[] = data.nodes.map(node => ({ id: node.id, node, group: groups.get(node.id) ?? "foundation", x: 0, y: 0, centerX: 0, centerY: 0, orbitRadius: 0, angle: 0, direction: 0 }));
  const byId = new Map(points.map(p => [p.id, p]));
  for (const center of centers) {
    const owned = points.filter(p => p.node.app === center.app);
    const root = owned.find(p => p.node.nodeType === "ecosystem");
    if (!root) continue;
    root.x = center.x; root.y = center.y;
    for (const radius of [220, 350, 460]) orbits.push({ id: `${center.app}-${radius}`, x: center.x, y: center.y, radius });
    const modules = owned.filter(p => p.node.nodeType === "module").sort((a,b) => a.node.order-b.node.order || a.id.localeCompare(b.id));
    const buckets = modules.map(module => ({ module, features: owned.filter(p => p.node.nodeType === "feature" && p.node.parentId === module.id) }));
    const assigned = new Set(buckets.flatMap(b => b.features.map(p => p.id)));
    const direct = owned.filter(p => p.node.nodeType === "feature" && !assigned.has(p.id));
    // Direct application features occupy their own sector, without a fabricated module.
    const sectors: { module?: Point; features: Point[] }[] = [...buckets, ...(direct.length ? [{ features: direct }] : [])];
    const weights = sectors.map(b => Math.max(2.5, b.features.length / 2));
    const total = weights.reduce((a,b) => a+b,0);
    let cursor = -Math.PI / 2;
    const place = (point: Point, angle: number, radius: number) => {
      Object.assign(point, { centerX: center.x, centerY: center.y, orbitRadius: radius, angle, direction: center.direction });
      Object.assign(point, orbitalPosition(point, 0));
    };
    sectors.forEach((bucket,index) => {
      const span = weights[index] / total * Math.PI * 2;
      if (bucket.module) place(bucket.module, cursor + span / 2, 220);
      const features = [...bucket.features].sort((a,b) => a.node.order-b.node.order || a.id.localeCompare(b.id));
      const slots = Math.ceil(features.length / 2);
      features.forEach((feature,i) => place(feature, cursor + span * ((Math.floor(i/2)+0.5)/slots), i % 2 ? 460 : 350));
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
    const link: GraphLink = { source: point, target: parent, kind: "hierarchy", relation: point.node.nodeType === "module" ? "module" : "feature" };
    hierarchy.set([point.id,parent.id].sort().join("|"),link);
    links.push(link);
  }
  for (const edge of data.edges) {
    const source = byId.get(edge.from), target = byId.get(edge.to);
    if (!source || !target) continue;
    const existing = hierarchy.get([source.id,target.id].sort().join("|"));
    if (existing) { existing.kind = edge.type; existing.relation = "integration"; }
    else links.push({ source, target, kind: edge.type, relation: "integration" });
  }
  return { points, links, byId, orbits, worldWidth, worldHeight };
}
