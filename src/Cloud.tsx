import { useEffect, useMemo, useRef, useState } from "react";
import { ARC_RADIUS, SECTOR_INNER, SECTOR_OUTER, arcPath, layoutGraph, nodeGroups, wedgePath, type GraphLink, type Point } from "./graphModel";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import type { FeaturesData, LangKey } from "./types";
import NodeBubble from "./NodeBubble";
import { STAGES, STAGE_ARC } from "./i18n";

export interface CloudProps {
  data: FeaturesData;
  lang: LangKey;
  territoryLabels: Record<"cfab_hub" | "synergy" | "timeflow", string>;
  selectedId: string | null;
  highlightIds: Set<string> | null;
  onSelect: (id: string | null) => void;
  onOpenAdvantage: (id: string) => void;
}

// Pulses travel at a constant world speed, so a long integration edge takes
// longer than a short one. Files move slower than a data stream (spec 5.5.4).
const PULSE_SPEED = { data_flow: 150, file_exchange: 80 } as const;
const ARC_FONT = 19; // world units ≈ 11 px at the 1440 px fit

type Curve = { s: { x: number; y: number }; t: { x: number; y: number }; c1?: { x: number; y: number }; c2?: { x: number; y: number } };
const curveLength = (c: Curve) => {
  if (!c.c1 || !c.c2) return Math.hypot(c.t.x - c.s.x, c.t.y - c.s.y);
  let length = 0, previous = c.s;
  for (let i = 1; i <= 12; i++) { const p = curvePoint(c, i / 12); length += Math.hypot(p.x - previous.x, p.y - previous.y); previous = p; }
  return length;
};
const curvePoint = (c: Curve, u: number) => {
  if (!c.c1 || !c.c2) return { x: c.s.x + (c.t.x - c.s.x) * u, y: c.s.y + (c.t.y - c.s.y) * u };
  const v = 1 - u;
  return { x: v*v*v*c.s.x + 3*v*v*u*c.c1.x + 3*v*u*u*c.c2.x + u*u*u*c.t.x, y: v*v*v*c.s.y + 3*v*v*u*c.c1.y + 3*v*u*u*c.c2.y + u*u*u*c.t.y };
};
const curvePath = (c: Curve) => c.c1 && c.c2 ? `M ${c.s.x} ${c.s.y} C ${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${c.t.x} ${c.t.y}` : `M ${c.s.x} ${c.s.y} L ${c.t.x} ${c.t.y}`;

export default function Cloud({ data, lang, territoryLabels, selectedId, highlightIds, onSelect, onOpenAdvantage }: CloudProps) {

  const svgRef = useRef<SVGSVGElement>(null);
  const behaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [size, setSize] = useState({ width: 1200, height: 720 });
  const graph = useMemo(() => layoutGraph(data, size.width, size.height), [data, size]);
  const groups = useMemo(() => nodeGroups(data), [data]);
  const childCount = useMemo(() => {
    const counts = new Map<string, number>();
    data.nodes.forEach(n => { if (n.nodeType === "feature" && n.parentId) counts.set(n.parentId, (counts.get(n.parentId) ?? 0) + 1); });
    return counts;
  }, [data]);
  const [transform, setTransform] = useState(zoomIdentity);
  const transformRef = useRef(zoomIdentity);
  const viewAnimationRef = useRef<number | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [trail, setTrail] = useState<string[]>([]);
  const [stageIndex, setStageIndex] = useState<number | null>(null);
  const [showLabels, setShowLabels] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setStageIndex(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  // Pulses are SMIL animations: pausing the SVG clock stops every one of them at once.
  const flowing = !paused && !reducedMotion;
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (flowing) svg.unpauseAnimations(); else svg.pauseAnimations();
  }, [flowing]);
  const pl = lang === "pl";
  const fit = useMemo(() => {
    if (size.width < 700) {
      const k = Math.min(size.width/1120, Math.max(150,size.height-160)/1120);
      return zoomIdentity.translate(size.width/2,(size.height+90)/2).scale(k).translate(-560,-560);
    }
    // Leave room for the header and colour key above and the legend below.
    const k = Math.min(size.width / graph.worldWidth, Math.max(100,size.height - 170) / graph.worldHeight);
    return zoomIdentity.translate(size.width / 2, (size.height + 44) / 2).scale(k).translate(-graph.worldWidth/2, -graph.worldHeight/2);
  }, [size, graph.worldWidth, graph.worldHeight]);
  useEffect(() => {
    const el = svgRef.current!;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const behavior = zoom<SVGSVGElement, unknown>().scaleExtent([0.12, 4]).filter(e => !e.button && (e.type === "wheel" || !e.target.closest(".graph-node, .graph-node-popped, .graph-labels text, .node-bubble"))).on("start", e => {
      if (e.sourceEvent) {
        if (viewAnimationRef.current !== null) cancelAnimationFrame(viewAnimationRef.current);
        viewAnimationRef.current = null;
      }
    }).on("zoom", e => {
      transformRef.current = e.transform;
      setTransform(e.transform);
    });
    behaviorRef.current = behavior;
    const svg = select(svgRef.current!);
    svg.call(behavior).on("dblclick.zoom", null).call(behavior.transform, fit);
    return () => {
      if (viewAnimationRef.current !== null) cancelAnimationFrame(viewAnimationRef.current);
      viewAnimationRef.current = null;
      behavior.on("zoom", null).on("start", null);
      svg.on(".zoom", null);
      behaviorRef.current = null;
    };
  }, [fit]);
  const moveViewTo = (target: typeof zoomIdentity) => {
    const behavior = behaviorRef.current;
    const svgElement = svgRef.current;
    if (!behavior || !svgElement) return;
    if (viewAnimationRef.current !== null) cancelAnimationFrame(viewAnimationRef.current);
    if (reducedMotion) {
      select(svgElement).call(behavior.transform, target);
      viewAnimationRef.current = null;
      return;
    }

    const start = transformRef.current;
    const startedAt = performance.now();
    const duration = 460;
    const frame = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = zoomIdentity
        .translate(
          start.x + (target.x - start.x) * eased,
          start.y + (target.y - start.y) * eased
        )
        .scale(start.k + (target.k - start.k) * eased);
      select(svgElement).call(behavior.transform, next);
      if (progress < 1) viewAnimationRef.current = requestAnimationFrame(frame);
      else viewAnimationRef.current = null;
    };
    viewAnimationRef.current = requestAnimationFrame(frame);
  };
  const moveTo = (id: string) => {
    setTrail((previous) => [...previous.filter((item) => item !== id), id].slice(-4));
    onSelect(id);
    const target = graph.byId.get(id)!;
    if (target.node.nodeType === "bridge" && size.width >= 1150) {
      moveViewTo(fit);
      return;
    }
    const k = Math.max(fit.k * 1.8, 1);
    moveViewTo(zoomIdentity.translate(size.width * (size.width > 700 ? 0.36 : 0.5), size.height * 0.43).scale(k).translate(-target.x, -target.y));
  };
  const focus = selectedId;
  const active = selectedId ?? hover;
  const related = new Set<string>();
  if (active) {
    related.add(active);
    graph.links.forEach(l => { if (l.source.id === active) related.add(l.target.id); if (l.target.id === active) related.add(l.source.id); });
  }
  const matches = query.trim() ? graph.points.filter(p => `${p.node.title[lang]} ${p.node.summary[lang]}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) : [];
  const matchIds = new Set(matches.map(p => p.id));
  const stageIds = stageIndex === null ? null : new Set(data.nodes.filter((node) => node.stage === STAGES[stageIndex].id).map((node) => node.id));
  const effectiveHighlight = highlightIds ?? stageIds;
  const dimmed = (id: string) => focus ? !related.has(id) : query.trim() ? !matchIds.has(id) : effectiveHighlight ? !effectiveHighlight.has(id) : false;
  const hasFocus = Boolean(active || query.trim() || effectiveHighlight);
  const bridgeNetwork = size.width >= 1150;
  const bridges = graph.points.filter(p => p.node.nodeType === "bridge");
  const radius = (p: Point) => p.node.nodeType === "ecosystem" ? 6 : p.node.nodeType === "module" ? 5 : p.node.nodeType === "bridge" ? 4 : 3.2;
  const curve = (l: GraphLink): Curve => {
    const s = l.source, t = l.target;
    if (bridgeNetwork && (s.node.nodeType === "bridge" || t.node.nodeType === "bridge" || s.node.app !== t.node.app)) {
      const bend = Math.abs(t.x - s.x) * 0.48;
      const direction = Math.sign(t.x - s.x);
      return { s, t, c1: { x: s.x + bend * direction, y: s.y }, c2: { x: t.x - bend * direction, y: t.y } };
    }
    if (l.relation !== "integration") return { s, t };
    // Flows inside one application arc away from its centre instead of slicing through it.
    const dx = t.x - s.x, dy = t.y - s.y, length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length, ny = dx / length;
    const midX = (s.x + t.x) / 2, midY = (s.y + t.y) / 2;
    const cx = s.orbitRadius ? s.centerX : t.centerX, cy = s.orbitRadius ? s.centerY : t.centerY;
    const sign = (midX - cx) * nx + (midY - cy) * ny >= 0 ? 1 : -1;
    const bend = length * 0.22 * sign;
    return { s, t, c1: { x: s.x + dx / 3 + nx * bend, y: s.y + dy / 3 + ny * bend }, c2: { x: s.x + dx * 2 / 3 + nx * bend, y: s.y + dy * 2 / 3 + ny * bend } };
  };
  // Hover only highlights/reveals labels; it must never change their placement.
  // Otherwise a label moves out from under the pointer and toggles hover again.
  const labelPriority = focus ? related : new Set<string>();
  const occupied: {x: number; y: number; w: number; h: number}[] = graph.points.filter(p => p.node.nodeType === "ecosystem").map(p => ({x:p.x*transform.k+transform.x-72,y:p.y*transform.k+transform.y-40,w:144,h:80}));
  const labelWidth = (text: string, fontSize: number) => text.length * fontSize * 0.53 + 8;
  const labels = [...graph.points].sort((a,b) => {
    const rank = (p: Point) => labelPriority.has(p.id) || matchIds.has(p.id) ? 0 : p.node.nodeType === "module" ? 1 : p.node.nodeType === "bridge" ? 2 : 3;
    return rank(a) - rank(b);
  }).flatMap(p => {
    if (p.node.nodeType === "ecosystem" || (bridgeNetwork && p.node.nodeType === "bridge")) return [];
    const detail = p.node.nodeType === "feature";
    if (detail && focus && !related.has(p.id) && !matchIds.has(p.id)) return [];
    const x = p.x * transform.k + transform.x, y = p.y * transform.k + transform.y;
    if (x < -20 || x > size.width + 20 || y < -20 || y > size.height + 20) return [];
    const count = p.node.nodeType === "module" ? childCount.get(p.id) : undefined;
    const text = count ? `${p.node.shortTitle[lang]} · ${count}` : p.node.shortTitle[lang];
    const fontSize = detail ? 13 : 14;
    const w = labelWidth(text, fontSize), h = fontSize + 5;
    const candidates = p.node.nodeType === "bridge" ? [{x:x-w/2,y:y+10,w,h}] : [];
    for (let distance = 0; distance <= 32; distance += 16) {
      candidates.push({x:x+9+distance,y:y-h/2,w,h}, {x:x-w-9-distance,y:y-h/2,w,h},
        {x:x-w/2,y:y+10+distance,w,h}, {x:x-w/2,y:y-h-10-distance,w,h});
    }
    const box = candidates.find(c => c.x > 5 && c.x+c.w < size.width-5 && c.y > 66 && c.y+c.h < size.height-65 && !occupied.some(b => c.x < b.x+b.w+5 && c.x+c.w+5 > b.x && c.y < b.y+b.h+3 && c.y+c.h+3 > b.y));
    if (!box) return [];
    occupied.push(box);
    // Reserve space even for a hidden label so revealing it cannot move others.
    if (detail && !showLabels && transform.k < 0.85 && !related.has(p.id) && !matchIds.has(p.id)) return [];
    return [{p, x:box.x+4, y:box.y+fontSize, nodeX:x, nodeY:y, fontSize, text,
      leader: Math.hypot(box.x + w/2 - x, box.y + h/2 - y) > w/2+18}];
  });
  // Stage names ride the outer arc; a name that would overflow its arc is dropped.
  const stageArcs = graph.stageArcs.flatMap(arc => {
    const label = STAGE_ARC[arc.group][lang].toLocaleUpperCase();
    const geometry = arcPath(arc, ARC_RADIUS + (Math.sin((arc.start + arc.end) / 2) > 0 ? ARC_FONT * 0.8 : 0));
    if (label.length * ARC_FONT * 0.78 > geometry.length) return [];
    return [{ ...arc, label, ...geometry }];
  });
  const scaleBy = (factor: number) => { if (behaviorRef.current) select(svgRef.current!).call(behaviorRef.current.scaleBy, factor); };
  const reset = () => {
    onSelect(null); setQuery(""); setTrail([]); setStageIndex(null);
    const k = Math.min(size.width/graph.worldWidth, Math.max(100,size.height-160)/graph.worldHeight);
    const overview = zoomIdentity.translate(size.width/2,(size.height+30)/2).scale(k).translate(-graph.worldWidth/2,-graph.worldHeight/2);
    moveViewTo(overview);
  };
  const viewApp = (point: Point) => {
    onSelect(null); setQuery("");
    moveViewTo(zoomIdentity.translate(size.width/2,(size.height+90)/2).scale(fit.k).translate(-point.x,-point.y));
  };

  return <>
    <div className="graph-search">
      <label><span aria-hidden="true">⌕</span><input aria-label={pl ? "Szukaj w mapie" : "Search the map"} placeholder={pl ? "Znajdź funkcję lub moduł…" : "Find a feature or module…"} value={query} onChange={e => {setQuery(e.target.value); onSelect(null);}} onKeyDown={e => { if (e.key === "Escape") setQuery(""); }} />{query && <button onClick={() => setQuery("")} aria-label={pl ? "Wyczyść wyszukiwanie" : "Clear search"}>×</button>}</label>
      {query.trim() && <div className="graph-results"><p role="status">{matches.length} {pl ? "wyników" : "results"}</p>{matches.slice(0, 12).map(p => <button key={p.id} onClick={() => {moveTo(p.id); setQuery("");}}><span className={`graph-dot group-${p.group} app-${p.node.app}`} />{p.node.title[lang]}</button>)}</div>}
    </div>
    <div className="orbit-app-switch" aria-label={pl ? "Przejdź do aplikacji" : "Go to application"}>
      {graph.points.filter(p => p.node.nodeType === "ecosystem").map(p => <button key={p.id} onClick={() => viewApp(p)}>{p.node.shortTitle[lang]}</button>)}
    </div>
    {!highlightIds && <div className="graph-stage-lens">
      {stageIndex === null ? <button onClick={() => { onSelect(null); setStageIndex(0); }}>{pl ? "Spacer po etapach" : "Walk through stages"} →</button> : <><span>{String(stageIndex + 1).padStart(2, "0")}/08 · {STAGES[stageIndex][lang]}</span><button onClick={() => { onSelect(null); setStageIndex((stageIndex + 7) % 8); }} aria-label={pl ? "Poprzedni etap" : "Previous stage"}>←</button><button onClick={() => { onSelect(null); setStageIndex((stageIndex + 1) % 8); }} aria-label={pl ? "Następny etap" : "Next stage"}>→</button><button onClick={() => setStageIndex(null)} aria-label={pl ? "Zamknij spacer" : "Close stage walk"}>×</button></>}
    </div>}
    <svg ref={svgRef} className={`cloud ${hasFocus ? "has-focus" : ""}`} data-flow={flowing ? "running" : "paused"} aria-label={pl ? "Interaktywna mapa powiązań" : "Interactive relationship graph"} onClick={e => {if (e.target === e.currentTarget) onSelect(null);}}>
      <defs>
        <filter id="popout-shadow" x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.45)" />
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="rgba(0,0,0,0.28)" />
        </filter>
      </defs>
      {/* Module wedges: the ring becomes a share chart of the scope. */}
      <g className="sector-wedges" transform={transform.toString()} aria-hidden="true">
        {graph.sectors.map(sector => {
          const lit = effectiveHighlight ? [...effectiveHighlight].some(id => graph.byId.get(id)?.node.parentId === sector.id) : active ? related.has(sector.id) || [...related].some(id => graph.byId.get(id)?.node.parentId === sector.id) : true;
          return <path key={sector.id} className={`sector-wedge group-${sector.group} app-${sector.app} ${lit ? "is-lit" : ""}`} d={wedgePath(sector, SECTOR_INNER, SECTOR_OUTER)} />;
        })}
      </g>
      <g className="orbit-tracks" transform={transform.toString()} aria-hidden="true">
        {graph.orbits.map(orbit => <circle key={orbit.id} cx={orbit.x} cy={orbit.y} r={orbit.radius} vectorEffect="non-scaling-stroke" />)}
      </g>
      <g className="stage-arcs" transform={transform.toString()} aria-hidden="true">
        {stageArcs.map(arc => <g key={arc.id} className={`stage-arc group-${arc.group} app-${arc.app}`}>
          <path id={`arc-${arc.id}`} d={arc.d} fill="none" stroke="none" />
          <text fontSize={ARC_FONT}><textPath href={`#arc-${arc.id}`} startOffset="50%" textAnchor="middle">{arc.label}</textPath></text>
        </g>)}
      </g>
      <g className="graph-edges" transform={transform.toString()}>
        {graph.links.map((l, index) => {
          const c = curve(l);
          const advantageTrace = !active && Boolean(highlightIds?.has(l.source.id) && highlightIds?.has(l.target.id) && l.relation === "integration");
          const lit = l.source.id === active || l.target.id === active || advantageTrace;
          const bridgeLink = Boolean(c.c1) && (l.source.node.nodeType === "bridge" || l.target.node.nodeType === "bridge");
          const speed = PULSE_SPEED[l.kind as keyof typeof PULSE_SPEED];
          const duration = speed ? Math.max(1.4, curveLength(c) / speed) : 0;
          const muted = Boolean(active || highlightIds);
          // The line stays faint at rest; the pulse riding it carries the message.
          const lineOpacity = lit ? 1 : muted ? 0.025 : bridgeLink ? 0.5 : l.animated ? 0.14 : l.relation === "integration" ? 0.045 : l.relation === "module" ? 0.12 : 0.18;
          return <g key={l.id} data-relation={l.relation} data-kind={l.kind}
            className={`edge group-${l.source.group} app-${l.source.node.app} relation-${l.relation} ${bridgeLink ? "bridge-link" : ""} ${lit ? "is-lit" : ""} ${advantageTrace ? "is-advantage-trace" : ""}`}>
            <path id={`edge-${l.id}`} d={curvePath(c)} vectorEffect="non-scaling-stroke" opacity={lineOpacity} />
            {l.animated && !reducedMotion && <g className={`flow-pulse kind-${l.kind}`} opacity={lit ? 1 : muted ? 0.05 : 0.8}>
              {l.kind === "file_exchange"
                ? <rect x={-3.5} y={-3.5} width={7} height={7} transform="rotate(45)" />
                : <><circle className="pulse-glow" r={11} /><circle className="pulse-core" r={4} /></>}
              <animateMotion dur={`${duration.toFixed(2)}s`} begin={`-${((index * 0.83) % duration).toFixed(2)}s`} repeatCount="indefinite"><mpath href={`#edge-${l.id}`} /></animateMotion>
            </g>}
          </g>;
        })}
      </g>
      {bridgeNetwork && bridges.length > 0 && <text className="bridge-network-title" x={graph.worldWidth/2*transform.k+transform.x} y={(bridges[0].y-53)*transform.k+transform.y} textAnchor="middle">{territoryLabels.synergy}</text>}
      {graph.points.map(p => {const x = p.x*transform.k+transform.x, y = p.y*transform.k+transform.y; const bridgeIndex = bridges.findIndex(b => b.id === p.id); return <g key={p.id} className={`graph-node group-${p.group} app-${p.node.app} status-${p.node.status} ${p.node.nodeType === "ecosystem" ? "orbit-center" : ""} ${p.node.nodeType === "bridge" && bridgeNetwork ? "bridge-node" : ""} ${p.id===active ? "is-active" : ""}`} transform={`translate(${x},${y})`} opacity={dimmed(p.id) ? 0.15 : 1} role="button" tabIndex={0} aria-label={p.node.title[lang]} aria-pressed={selectedId===p.id}
        onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p.id)} onBlur={() => setHover(null)}
        onKeyDown={e => {if (e.key === "Enter" || e.key === " ") {e.preventDefault(); moveTo(p.id);} if(e.key === "Escape") onSelect(null);}}
        onClick={() => moveTo(p.id)}>
        {p.node.nodeType === "ecosystem" ? <>
          <circle className="orbit-center-disc" r={52} />
          <text className="orbit-center-title" textAnchor="middle" y={-3}>{p.node.shortTitle[lang]}</text>
          <text className="orbit-center-caption" textAnchor="middle" y={17}>{pl ? "APLIKACJA" : "APPLICATION"}</text>
        </> : p.node.nodeType === "bridge" && bridgeNetwork ? <>
          <circle className="bridge-hit" r={17} />
          <circle className="bridge-halo" r={10} />
          <circle className="bridge-core" r={4.5} />
          <text className="bridge-label" x={bridgeIndex % 2 ? -18 : 18} y={4} textAnchor={bridgeIndex % 2 ? "end" : "start"}>{p.node.shortTitle[lang]}</text>
        </> : <>
          <circle className="graph-hit" r={Math.max(10,radius(p)+5)} />
          <circle className="graph-ring" r={radius(p)+5} />
          {p.node.techMoat.isUniqueMoat && <circle className="graph-moat" r={radius(p)+3} />}
          <circle className="graph-point" r={radius(p)} />
        </>}

      </g>;})}
      <g className="graph-labels">{labels.map(({p,x,y,nodeX,nodeY,fontSize,text,leader}) => <g key={p.id} opacity={dimmed(p.id) ? 0.32 : 1}>
        {leader && <line x1={nodeX} y1={nodeY} x2={x} y2={y-5} className="label-leader" />}
        <text x={x} y={y} fontSize={fontSize} textAnchor="start" className={`${p.node.nodeType === "ecosystem" ? "graph-root" : ""} ${p.node.nodeType === "module" ? "graph-module" : ""}`} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} onClick={() => moveTo(p.id)}>{text}</text>
      </g>)}</g>
      {/* What travels along a lit edge, written at its midpoint. */}
      <g className="edge-labels" aria-hidden="true">{active && graph.links.filter(l => l.label && (l.source.id === active || l.target.id === active)).map(l => {
        const m = curvePoint(curve(l), 0.5);
        return <text key={l.id} className={`edge-label group-${l.source.group} app-${l.source.node.app}`} x={m.x*transform.k+transform.x} y={m.y*transform.k+transform.y - 7} textAnchor="middle">{l.label![lang]}</text>;
      })}</g>
      {/* Foreground 3D popped-out node layer */}
      {selectedId && (() => {
        const p = graph.byId.get(selectedId);
        if (!p) return null;
        const x = p.x * transform.k + transform.x;
        const y = p.y * transform.k + transform.y;
        const baseR = radius(p);
        const poppedR = Math.max(13, baseR * 2.4);

        return (
          <g
            key={`popped-${p.id}`}
            className="graph-node-popped-position"
            transform={`translate(${x},${y})`}
          >
            <g
              className={`graph-node-popped group-${p.group} app-${p.node.app} status-${p.node.status}`}
              role="button"
              tabIndex={0}
              aria-label={pl ? `Zamknij szczegóły: ${p.node.title[lang]}` : `Close details: ${p.node.title[lang]}`}
              onClick={() => onSelect(null)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
                  event.preventDefault();
                  onSelect(null);
                }
              }}
            >
            {/* 3D Ground shadow */}
            <ellipse className="popout-ground-shadow" cx={0} cy={poppedR * 0.95} rx={poppedR * 1.55} ry={poppedR * 0.55} />

            {/* Luminous pulsing outer aura */}
            <circle className="popout-aura-pulse" r={poppedR * 2.3} />
            <circle className="popout-aura-inner" r={poppedR * 1.55} />

            {/* Elevated illuminated rim */}
            <circle className="popout-rim" r={poppedR + 3.5} />

            {/* Main 3D Sphere */}
            <circle className="popout-sphere" r={poppedR} filter="url(#popout-shadow)" />

            {/* Specular 3D Highlight */}
            <ellipse
              className="popout-shine"
              cx={-poppedR * 0.35}
              cy={-poppedR * 0.35}
              rx={poppedR * 0.45}
              ry={poppedR * 0.28}
              transform={`rotate(-28, ${-poppedR * 0.35}, ${-poppedR * 0.35})`}
            />

            {/* Status / Type glyphs */}
            {p.node.status === "beta" && (
              <path
                className="popout-glyph-beta"
                d={`M 0 ${-poppedR} A ${poppedR} ${poppedR} 0 0 1 0 ${poppedR} Z`}
              />
            )}
            {p.node.status === "roadmap" && (
              <circle className="popout-glyph-roadmap" r={poppedR * 0.52} />
            )}
            {p.node.nodeType === "bridge" && (
              <polygon
                className="popout-glyph-bridge"
                points={`0,${-poppedR * 0.65} ${poppedR * 0.65},0 0,${poppedR * 0.65} ${-poppedR * 0.65},0`}
              />
            )}
            </g>
          </g>
        );
      })()}
    </svg>
    {selectedId && (() => {
      const selectedPoint = graph.byId.get(selectedId);
      if (!selectedPoint) return null;
      const screenX = selectedPoint.x * transform.k + transform.x;
      const screenY = selectedPoint.y * transform.k + transform.y;
      return (
        <NodeBubble
          key={selectedPoint.id}
          node={selectedPoint.node}
          parent={data.nodes.find((n) => n.id === selectedPoint.node.parentId) ?? null}
          lang={lang}
          data={data}
          groups={groups}
          position={{ x: screenX, y: screenY }}
          containerSize={size}
          onClose={() => onSelect(null)}
          onSelect={moveTo}
          onOpenAdvantage={onOpenAdvantage}
        />
      );
    })()}
    {selectedId && trail.length > 1 && <nav className="graph-trail" aria-label={pl ? "Odwiedzone węzły" : "Visited nodes"}><span>{pl ? "Twoja ścieżka" : "Your path"}</span>{trail.map((id, index) => <span key={id} className="graph-trail-item">{index > 0 && <i aria-hidden="true">›</i>}<button aria-current={id === selectedId} onClick={() => moveTo(id)}>{graph.byId.get(id)?.node.shortTitle[lang] ?? id}</button></span>)}</nav>}
    <div className="graph-controls" aria-label={pl ? "Sterowanie mapą" : "Graph controls"}>
      <button onClick={() => setShowLabels(!showLabels)} aria-pressed={showLabels} title={pl ? "Pokaż podpisy funkcji" : "Show feature labels"}>{pl ? "Podpisy funkcji" : "Feature labels"}</button>
      <button className="orbit-motion-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused} disabled={reducedMotion} title={reducedMotion ? (pl ? "Ograniczenie ruchu w ustawieniach systemu" : "System reduced motion preference") : undefined}>{paused ? (pl ? "Wznów przepływ" : "Resume flow") : (pl ? "Zatrzymaj przepływ" : "Pause flow")}</button>
      <span className="control-divider" />
      <button onClick={() => scaleBy(1.35)} aria-label={pl ? "Przybliż" : "Zoom in"}>+</button>
      <button onClick={() => scaleBy(1/1.35)} aria-label={pl ? "Oddal" : "Zoom out"}>−</button>
      <button onClick={reset} aria-label={pl ? "Pokaż całą mapę" : "Fit map"}>⤢</button>
    </div>
  </>;
}
