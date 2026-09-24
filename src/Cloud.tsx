import { useEffect, useMemo, useRef, useState } from "react";
import { layoutGraph, orbitalPosition, type Point } from "./graphModel";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import type { FeaturesData, LangKey } from "./types";

export interface CloudProps {
  data: FeaturesData;
  lang: LangKey;
  territoryLabels: Record<"cfab_hub" | "synergy" | "timeflow", string>;
  selectedId: string | null;
  highlightIds: Set<string> | null;
  onSelect: (id: string | null) => void;
}

export default function Cloud({ data, lang, territoryLabels, selectedId, highlightIds, onSelect }: CloudProps) {

  const svgRef = useRef<SVGSVGElement>(null);
  const behaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [size, setSize] = useState({ width: 1200, height: 720 });
  const graph = useMemo(() => layoutGraph(data, size.width, size.height), [data, size]);
  const [transform, setTransform] = useState(zoomIdentity);
  const [hover, setHover] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showLabels, setShowLabels] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [phase, setPhase] = useState(0);
  const elapsed = useRef(0);
  const moving = !paused && !reducedMotion && !hover && !selectedId && !query.trim();
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!moving) return;
    let frame: number;
    let previous = performance.now();
    let painted = previous;
    const tick = (now: number) => {
      if (!document.hidden) elapsed.current += Math.min(now - previous, 100) / 1000;
      previous = now;
      if (now - painted >= 50) { setPhase(elapsed.current); painted = now; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [moving]);
  const pl = lang === "pl";
  const fit = useMemo(() => {
    if (size.width < 700) {
      const k = Math.min(size.width/1120, Math.max(150,size.height-160)/1120);
      return zoomIdentity.translate(size.width/2,(size.height+90)/2).scale(k).translate(-560,-560);
    }
    const k = Math.min(size.width / graph.worldWidth, Math.max(100,size.height - 140) / graph.worldHeight);
    return zoomIdentity.translate(size.width / 2, size.height / 2).scale(k).translate(-graph.worldWidth/2, -graph.worldHeight/2);
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
    const behavior = zoom<SVGSVGElement, unknown>().scaleExtent([0.12, 4]).filter(e => !e.button && (e.type === "wheel" || !e.target.closest(".graph-node, .graph-labels text"))).on("start", e => { if (e.sourceEvent) setPaused(true); }).on("zoom", e => setTransform(e.transform));
    behaviorRef.current = behavior;
    const svg = select(svgRef.current!);
    svg.call(behavior).on("dblclick.zoom", null).call(behavior.transform, fit);
    return () => { behavior.on("zoom", null).on("start", null); svg.on(".zoom", null); behaviorRef.current = null; };
  }, [fit]);
  const moveTo = (id: string) => {
    onSelect(id);
    const target = graph.byId.get(id)!;
    if (target.node.nodeType === "bridge" && size.width >= 1150) {
      if (behaviorRef.current) select(svgRef.current!).call(behaviorRef.current.transform, fit);
      return;
    }
    const point = orbitalPosition(target, phase);
    const k = Math.max(fit.k * 1.8, 1);
    if (behaviorRef.current) select(svgRef.current!).call(behaviorRef.current.transform, zoomIdentity.translate(size.width * (size.width > 700 ? 0.36 : 0.5), size.height * 0.43).scale(k).translate(-point.x, -point.y));
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
  const dimmed = (id: string) => focus ? !related.has(id) : query.trim() ? !matchIds.has(id) : highlightIds ? !highlightIds.has(id) : false;
  const position = (p: Point) => orbitalPosition(p, phase);
  const bridgeNetwork = size.width >= 1150;
  const bridges = graph.points.filter(p => p.node.nodeType === "bridge");
  const bridgePath = bridges.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const previous = bridges[i - 1];
    const middleY = (previous.y + p.y) / 2;
    return `C ${previous.x} ${middleY} ${p.x} ${middleY} ${p.x} ${p.y}`;
  }).join(" ");
  const radius = (p: Point) => p.node.nodeType === "ecosystem" ? 6 : p.node.nodeType === "module" ? 5 : p.node.nodeType === "bridge" ? 4 : 3.2;
  // Stable labels: try nearby free positions before using a short leader line.
  // Selection never reorders labels or shrinks the text.
  const occupied: {x: number; y: number; w: number; h: number}[] = graph.points.filter(p => p.node.nodeType === "ecosystem").map(p => ({x:p.x*transform.k+transform.x-72,y:p.y*transform.k+transform.y-40,w:144,h:80}));
  const labelWidth = (text: string, fontSize: number) => text.length * fontSize * 0.53 + 8;
  const labels = [...graph.points].sort((a,b) => {
    const rank = (p: Point) => related.has(p.id) || matchIds.has(p.id) ? 0 : p.node.nodeType === "module" ? 1 : p.node.nodeType === "bridge" ? 2 : 3;
    return rank(a) - rank(b);
  }).flatMap(p => {
    if (p.node.nodeType === "ecosystem" || (bridgeNetwork && p.node.nodeType === "bridge")) return [];
    const detail = p.node.nodeType === "feature";
    if (detail && focus && !related.has(p.id) && !matchIds.has(p.id)) return [];
    if (detail && !showLabels && transform.k < 0.85 && !related.has(p.id) && !matchIds.has(p.id)) return [];
    const pos = position(p);
    const x = pos.x * transform.k + transform.x, y = pos.y * transform.k + transform.y;
    if (x < -20 || x > size.width + 20 || y < -20 || y > size.height + 20) return [];
    const text = p.node.shortTitle[lang];
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
    return [{p, x:box.x+4, y:box.y+fontSize, nodeX:x, nodeY:y, fontSize, text,
      leader: Math.hypot(box.x + w/2 - x, box.y + h/2 - y) > w/2+18}];
  });
  const scaleBy = (factor: number) => { if (behaviorRef.current) select(svgRef.current!).call(behaviorRef.current.scaleBy, factor); };
  const reset = () => {
    onSelect(null); setQuery("");
    const k = Math.min(size.width/graph.worldWidth, Math.max(100,size.height-160)/graph.worldHeight);
    const overview = zoomIdentity.translate(size.width/2,(size.height+30)/2).scale(k).translate(-graph.worldWidth/2,-graph.worldHeight/2);
    if (behaviorRef.current) select(svgRef.current!).call(behaviorRef.current.transform, overview);
  };
  const viewApp = (point: Point) => {
    onSelect(null); setQuery("");
    if (behaviorRef.current) select(svgRef.current!).call(behaviorRef.current.transform,
      zoomIdentity.translate(size.width/2,(size.height+90)/2).scale(fit.k).translate(-point.x,-point.y));
  };

  return <>
    <div className="graph-search">
      <label><span aria-hidden="true">⌕</span><input aria-label={pl ? "Szukaj w mapie" : "Search the map"} placeholder={pl ? "Znajdź funkcję lub moduł…" : "Find a feature or module…"} value={query} onChange={e => {setQuery(e.target.value); onSelect(null);}} onKeyDown={e => { if (e.key === "Escape") setQuery(""); }} />{query && <button onClick={() => setQuery("")} aria-label={pl ? "Wyczyść wyszukiwanie" : "Clear search"}>×</button>}</label>
      {query.trim() && <div className="graph-results"><p role="status">{matches.length} {pl ? "wyników" : "results"}</p>{matches.slice(0, 12).map(p => <button key={p.id} onClick={() => {moveTo(p.id); setQuery("");}}><span className={`graph-dot group-${p.group}`} />{p.node.title[lang]}</button>)}</div>}
    </div>
    <div className="orbit-app-switch" aria-label={pl ? "Przejdź do aplikacji" : "Go to application"}>
      {graph.points.filter(p => p.node.nodeType === "ecosystem").map(p => <button key={p.id} onClick={() => viewApp(p)}>{p.node.shortTitle[lang]}</button>)}
    </div>
    <svg ref={svgRef} className="cloud" data-motion={moving ? "running" : "paused"} aria-label={pl ? "Interaktywna mapa powiązań" : "Interactive relationship graph"} onClick={e => {if (e.target === e.currentTarget) onSelect(null);}}>
      {bridgeNetwork && <g className="bridge-backdrop" transform={transform.toString()} aria-hidden="true">
        <path className="bridge-spine-glow" d={bridgePath} />
        <path className="bridge-spine" d={bridgePath} />
      </g>}
      <g className="orbit-tracks" transform={transform.toString()} aria-hidden="true">
        {graph.orbits.map(orbit => <circle key={orbit.id} cx={orbit.x} cy={orbit.y} r={orbit.radius} vectorEffect="non-scaling-stroke" />)}
      </g>
      <g className="graph-edges" transform={transform.toString()}>
        {graph.links.map(l => {
          const s = position(l.source), t = position(l.target);
          const lit = l.source.id === active || l.target.id === active;
          const bridgeLink = bridgeNetwork && (l.source.node.nodeType === "bridge" || l.target.node.nodeType === "bridge");
          const shared = { key: `${l.source.id}-${l.target.id}-${l.kind}`, "data-relation": l.relation, "data-kind": l.kind,
            className: `group-${l.source.group} relation-${l.relation} ${bridgeLink ? "bridge-link" : ""} ${lit ? "is-lit" : ""}`,
            opacity: lit ? 1 : active ? 0.025 : bridgeLink ? 0.5 : l.relation === "integration" ? 0.045 : l.relation === "module" ? 0.12 : 0.18,
            vectorEffect: "non-scaling-stroke" as const };
          if (bridgeLink) {
            const bend = Math.abs(t.x - s.x) * 0.48;
            const direction = Math.sign(t.x - s.x);
            return <path {...shared} d={`M ${s.x} ${s.y} C ${s.x + bend * direction} ${s.y} ${t.x - bend * direction} ${t.y} ${t.x} ${t.y}`} />;
          }
          return <line {...shared} x1={s.x} y1={s.y} x2={t.x} y2={t.y} />;
        })}
      </g>
      {bridgeNetwork && bridges.length > 0 && <text className="bridge-network-title" x={graph.worldWidth/2*transform.k+transform.x} y={(bridges[0].y-53)*transform.k+transform.y} textAnchor="middle">{territoryLabels.synergy}</text>}
      {graph.points.map(p => {const pos = position(p); const x = pos.x*transform.k+transform.x, y = pos.y*transform.k+transform.y; const bridgeIndex = bridges.findIndex(b => b.id === p.id); return <g key={p.id} className={`graph-node group-${p.group} status-${p.node.status} ${p.node.nodeType === "ecosystem" ? "orbit-center" : ""} ${p.node.nodeType === "bridge" && bridgeNetwork ? "bridge-node" : ""} ${p.id===active ? "is-active" : ""}`} transform={`translate(${x},${y})`} opacity={dimmed(p.id) ? 0.15 : 1} role="button" tabIndex={0} aria-label={p.node.title[lang]} aria-pressed={selectedId===p.id}
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
          <circle className="graph-point" r={radius(p)} />
        </>}

      </g>;})}
      <g className="graph-labels">{labels.map(({p,x,y,nodeX,nodeY,fontSize,text,leader}) => <g key={p.id} opacity={dimmed(p.id) ? 0.32 : 1}>
        {leader && <line x1={nodeX} y1={nodeY} x2={x} y2={y-5} className="label-leader" />}
        <text x={x} y={y} fontSize={fontSize} textAnchor="start" className={`${p.node.nodeType === "ecosystem" ? "graph-root" : ""} ${p.node.nodeType === "module" ? "graph-module" : ""}`} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} onClick={() => moveTo(p.id)}>{text}</text>
      </g>)}</g>
    </svg>
    <div className="graph-controls" aria-label={pl ? "Sterowanie mapą" : "Graph controls"}>
      <button onClick={() => setShowLabels(!showLabels)} aria-pressed={showLabels} title={pl ? "Pokaż podpisy funkcji" : "Show feature labels"}>{pl ? "Podpisy funkcji" : "Feature labels"}</button>
      <button className="orbit-motion-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused} disabled={reducedMotion} title={reducedMotion ? (pl ? "Ograniczenie ruchu w ustawieniach systemu" : "System reduced motion preference") : undefined}>{paused ? (pl ? "Wznów orbity" : "Resume orbits") : (pl ? "Zatrzymaj orbity" : "Pause orbits")}</button>
      <span className="control-divider" />
      <button onClick={() => scaleBy(1.35)} aria-label={pl ? "Przybliż" : "Zoom in"}>+</button>
      <button onClick={() => scaleBy(1/1.35)} aria-label={pl ? "Oddal" : "Zoom out"}>−</button>
      <button onClick={reset} aria-label={pl ? "Pokaż całą mapę" : "Fit map"}>⤢</button>
    </div>
  </>;
}
