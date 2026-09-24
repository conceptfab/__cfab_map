import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import raw from "./generated/features_data.json";
import type { FeaturesData, FeatureNode, LangKey, Status } from "./types";
import { STAGES, t } from "./i18n";
import { buildBlocks, metrics, type Block } from "./layout";
import Cloud from "./Cloud";
import { nodeGroups } from "./graphModel";

const data = raw as unknown as FeaturesData;
const groups = nodeGroups(data);

const MARKER: Record<Status, string> = { production: "●", beta: "◐", roadmap: "○" };

function initialLang(): LangKey {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  return fromUrl === "en" ? "en" : "pl";
}

function Chip({ node, lang, onSelect }: { node: FeatureNode; lang: LangKey; onSelect: (id: string) => void }) {
  return (
    <li><button className={`chip group-${groups.get(node.id)} status-${node.status}`} data-id={node.id} onClick={() => onSelect(node.id)} title={node.title[lang]}>
      <span className="marker" aria-hidden>{node.nodeType === "bridge" ? "◆" : MARKER[node.status]}</span>
      <span className="label">{node.shortTitle[lang]}</span>
    </button></li>
  );
}

function BlockView({ block, lang, onSelect }: { block: Block; lang: LangKey; onSelect: (id: string) => void }) {
  const title = block.title ? block.title[lang] : t("synergy", lang);
  return (
    <section className={`block app-${block.app}`}>
      <h3 className="block-title">
        {title} <span className="count">· {block.items.length}</span>
      </h3>
      <ul className="chips">
        {block.items.map((n) => <Chip key={n.id} node={n} lang={lang} onSelect={onSelect} />)}
      </ul>
    </section>
  );
}

function Card({ node, parent, lang, onClose, onSelect }: { node: FeatureNode; parent: FeatureNode | null; lang: LangKey; onClose: () => void; onSelect: (id: string) => void }) {
  const connectedIds = new Set<string>();
  if (node.parentId) connectedIds.add(node.parentId);
  data.nodes.forEach(n => { if (n.parentId === node.id) connectedIds.add(n.id); });
  data.edges.forEach(e => { if (e.from === node.id) connectedIds.add(e.to); if (e.to === node.id) connectedIds.add(e.from); });
  const connected = data.nodes.filter(n => connectedIds.has(n.id));
  const statusKey = node.status === "production" ? "statusProduction" : node.status === "beta" ? "statusBeta" : "statusRoadmap";
  return (
    <aside className={`card group-${groups.get(node.id)}`} aria-label={node.title[lang]}>
      <button className="close" onClick={onClose} aria-label={lang === "pl" ? "Zamknij szczegóły" : "Close details"}>×</button>
      {parent && <p className="card-parent">{parent.title[lang]}{node.version ? ` · ${node.version}` : ""}</p>}
      <p className={`stage-badge group-${groups.get(node.id)}`}><span className="graph-dot" />{STAGES.find(s => s.id === groups.get(node.id))?.[lang] ?? t("foundation",lang)}</p>
      <h2>{node.title[lang]}</h2>
      <p className={`card-status status-${node.status}`}>{MARKER[node.status]} {t(statusKey, lang)}</p>
      <p>{node.summary[lang]}</p>
      {node.statusNote && <p className="card-note">{node.statusNote[lang]}</p>}
      {connected.length > 0 && <section className="card-connections"><h3>{lang === "pl" ? "Połączone elementy" : "Connected nodes"} · {connected.length}</h3><ul>{connected.map(n => <li key={n.id}><button onClick={() => onSelect(n.id)}><span className={`graph-dot group-${groups.get(n.id)}`} />{n.title[lang]}<span aria-hidden="true">↗</span></button></li>)}</ul></section>}
      {node.techMoat.isUniqueMoat && node.techMoat.description && (
        <section><h3>{t("moat", lang)}</h3><p>{node.techMoat.description[lang]}</p></section>
      )}
      {node.techStack.length > 0 && <section><h3>{t("stack", lang)}</h3><p>{node.techStack.join(" · ")}</p></section>}
      {node.replacesTools.length > 0 && <section><h3>{t("replaces", lang)}</h3><p>{node.replacesTools.join(" · ")}</p></section>}
      {node.contract && <section><h3>{t("contract", lang)}</h3><p className="mono">{node.contract}</p></section>}
    </aside>
  );
}

export default function App() {
  const [lang, setLang] = useState<LangKey>(initialLang);
  const [view, setView] = useState<"cloud" | "grid">(() => (new URLSearchParams(location.search).get("view") === "grid" ? "grid" : "cloud"));
  const [theme, setTheme] = useState<"paper" | "charcoal">(() => new URLSearchParams(location.search).get("theme") === "charcoal" ? "charcoal" : "paper");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? data.nodes.find((n) => n.id === selectedId) ?? null : null;
  const territoryLabels = useMemo(() => ({ cfab_hub: "CFAB 4D Hub", synergy: t("synergy", lang), timeflow: "TIMEFLOW" }), [lang]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const columns = useMemo(() => STAGES.map((s) => ({ stage: s, blocks: buildBlocks(data, s.id) })), []);
  const foundation = useMemo(() => buildBlocks(data, null), []);
  const m = useMemo(() => metrics(data), []);
  const topRef = useRef<HTMLElement>(null);


  // Przewijanie w pionie z przyklejonym nagłówkiem strony i rzędem etapów:
  // rząd etapów przykleja się tuż pod nagłówkiem, którego wysokość zależy od języka.
  useLayoutEffect(() => {
    const top = topRef.current;
    if (!top) return;
    const update = () => document.documentElement.style.setProperty("--sticky-top", `${top.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(top);
    return () => observer.disconnect();
  }, []);

  const switchLang = (next: LangKey) => {
    setLang(next);
    const url = new URL(location.href);
    url.searchParams.set("lang", next);
    history.replaceState(null, "", url);
    document.documentElement.lang = next;
  };
  const switchTheme = (next: "paper" | "charcoal") => {
    setTheme(next);
    const url = new URL(location.href);
    url.searchParams.set("theme", next);
    history.replaceState(null, "", url);
  };
  const switchView = (next: "cloud" | "grid") => {
    setView(next);
    const url = new URL(location.href);
    url.searchParams.set("view", next);
    history.replaceState(null, "", url);
  };

  const tiles: [string, string | number][] = [
    [t("metricSystems", lang), m.systems],
    [t("metricModules", lang), m.modules],
    [t("metricFeatures", lang), m.features],
    [t("metricBridges", lang), m.bridges],
    [t("metricMcp", lang), m.mcp],
    [t("metricCloud", lang), "0 %"],
  ];

  return (
    <div className={`page view-${view}`} data-graph-theme={theme}>
      <header className="top" ref={topRef}>
        <div className="intro">
          <h1>CFAB 4D Hub × TIMEFLOW</h1>
          <p className="subtitle">{lang === "pl" ? "Dwa systemy. Wspólna przestrzeń pracy." : "Two systems. One connected workspace."}</p>
        </div>
          <div className="views" role="tablist" aria-label={lang === "pl" ? "Widok mapy" : "Map view"}>
            <button role="tab" aria-selected={view === "cloud"} onClick={() => switchView("cloud")}>{t("viewCloud", lang)}</button>
            <button role="tab" aria-selected={view === "grid"} onClick={() => switchView("grid")}>{t("viewGrid", lang)}</button>
          </div>
        <dl className="metrics">
          {tiles.map(([label, value]) => (
            <div key={label} className="metric"><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
        <div className="header-actions">
          <div className="theme-switch" role="group" aria-label={lang === "pl" ? "Kolory mapy" : "Map colours"}>
            <button aria-pressed={theme === "paper"} onClick={() => switchTheme("paper")}>{lang === "pl" ? "Papier" : "Paper"}</button>
            <button aria-pressed={theme === "charcoal"} onClick={() => switchTheme("charcoal")}>{lang === "pl" ? "Grafit" : "Charcoal"}</button>
          </div>
        <div className="lang" role="group" aria-label="Language">
          {(["pl", "en"] as LangKey[]).map((l) => (
            <button key={l} aria-pressed={lang === l} onClick={() => switchLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
        </div>
      </header>
      <div className="map-key" aria-label={lang === "pl" ? "Kolory etapów pracy" : "Work-stage colours"}>
        <span className="key-caption">{lang === "pl" ? "Obszary pracy" : "Work areas"}</span>
        {STAGES.map(s => <span key={s.id} className={`group-${s.id}`}><i className="graph-dot" />{s[lang]}</span>)}
        <span className="group-foundation"><i className="graph-dot" />{t("foundation",lang)}</span>
      </div>

      {view === "cloud" ? (
        <main className="cloud-wrap">
          <Cloud data={data} lang={lang} territoryLabels={territoryLabels} selectedId={selectedId} highlightIds={null} onSelect={setSelectedId} />
        </main>
      ) : (
      <main className="map" aria-label={lang === "pl" ? "Funkcje według etapów pracy" : "Features by work stage"}>
        <div className="columns">
          {columns.map(({ stage, blocks }) => (
            <section key={stage.id} className={`stage-section group-${stage.id}`}>
              <h2 className="column-title"><span className="graph-dot" /><span>{stage[lang]}</span><span className="count">{blocks.reduce((sum,b) => sum+b.items.length,0)}</span></h2>
              <div className="column">
                {blocks.map(b => <BlockView key={b.key} block={b} lang={lang} onSelect={setSelectedId} />)}
              </div>
            </section>
          ))}
        </div>
        <section className="foundation group-foundation">
          <h2 className="column-title"><span className="graph-dot" />{t("foundation", lang)}</h2>
          <div className="foundation-blocks">
            {foundation.map(b => <BlockView key={b.key} block={b} lang={lang} onSelect={setSelectedId} />)}
          </div>
        </section>
        {selected && <Card node={selected} lang={lang} parent={data.nodes.find(n => n.id === selected.parentId) ?? null} onClose={() => setSelectedId(null)} onSelect={setSelectedId} />}
      </main>
      )}

      {view === "cloud" ? <footer className="legend legend-cloud" aria-label={lang === "pl" ? "Jak czytać chmurę" : "How to read the cloud"}>
        <div className="legend-group">
          <strong>{lang === "pl" ? "Węzły" : "Nodes"}</strong>
          <span><i className="legend-node legend-app" />{lang === "pl" ? "aplikacja" : "application"}</span>
          <span><i className="legend-node legend-module" />{lang === "pl" ? "moduł · bliższa orbita" : "module · inner orbit"}</span>
          <span><i className="legend-node legend-feature" />{lang === "pl" ? "funkcja · dalsze orbity" : "feature · outer orbits"}</span>
          <span><i className="legend-node legend-bridge" />{lang === "pl" ? "wspólna funkcja · między aplikacjami" : "shared feature · between apps"}</span>
        </div>
        <div className="legend-group">
          <strong>{lang === "pl" ? "Stan" : "Status"}</strong>
          <span><i className="legend-status legend-ready" />{t("statusProduction", lang)}</span>
          <span><i className="legend-status legend-beta" />{t("statusBeta", lang)}</span>
          <span><i className="legend-status legend-planned" />{t("statusRoadmap", lang)}</span>
        </div>
        <div className="legend-group legend-hint">
          <span>{lang === "pl" ? "Poświata oznacza wskazany węzeł · Linie pokazują powiązania" : "Glow marks the focused node · Lines show connections"}</span>
        </div>
      </footer> : <footer className="legend legend-grid" aria-label={lang === "pl" ? "Oznaczenia etapów pracy" : "Work-stage key"}>
        <span>● {t("statusProduction", lang)}</span>
        <span>◐ {t("statusBeta", lang)}</span>
        <span>○ {t("statusRoadmap", lang)}</span>
        <span>◆ {lang === "pl" ? "wspólna funkcja" : "shared feature"}</span>
      </footer>}
    </div>
  );
}
