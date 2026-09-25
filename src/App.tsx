import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import raw from "./generated/features_data.json";
import type { FeaturesData, FeatureNode, LangKey, Status } from "./types";
import { STAGES, t } from "./i18n";
import { buildBlocks, metrics, type Block } from "./layout";
import Cloud from "./Cloud";
import { nodeGroups } from "./graphModel";
import Advantages, { APPS } from "./Advantages";

const data = raw as unknown as FeaturesData;
const groups = nodeGroups(data);

const MARKER: Record<Status, string> = { production: "●", beta: "◐", roadmap: "○" };
type View = "advantages" | "cloud" | "grid";
type ColorBy = "app" | "stage";
// Na wąskim ekranie chmura jest nieczytelna — bez parametru ?view= startuje od Przewag.
const NARROW = typeof matchMedia === "function" && matchMedia("(max-width: 720px)").matches;
const advantageById = new Map(data.advantages.map((advantage) => [advantage.id, advantage]));

function initialLang(): LangKey {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  return fromUrl === "en" ? "en" : "pl";
}

function Chip({ node, lang, onSelect, dimmed }: { node: FeatureNode; lang: LangKey; onSelect: (id: string) => void; dimmed: boolean }) {
  return (
    <li><button className={`chip group-${groups.get(node.id)} app-${node.app} status-${node.status} ${dimmed ? "is-dimmed" : ""}`} data-id={node.id} onClick={() => onSelect(node.id)} title={node.title[lang]}>
      <span className="marker" aria-hidden>{node.nodeType === "bridge" ? "◆" : MARKER[node.status]}</span>
      <span className="label">{node.shortTitle[lang]}{node.status !== "production" && <span className="status-tag">{t(node.status === "beta" ? "statusBeta" : "statusRoadmap", lang)}</span>}</span>
    </button></li>
  );
}

function BlockView({ block, lang, onSelect, highlightIds }: { block: Block; lang: LangKey; onSelect: (id: string) => void; highlightIds: Set<string> | null }) {
  const title = block.title ? block.title[lang] : t("synergy", lang);
  return (
    <section className={`block app-${block.app}`}>
      <h3 className="block-title">
        <span className="app-tag">{APPS.find((app) => app.id === block.app)?.short}</span>
        <span>{title} <span className="count">· {block.items.length}</span></span>
      </h3>
      <ul className="chips">
        {block.items.map((n) => <Chip key={n.id} node={n} lang={lang} onSelect={onSelect} dimmed={Boolean(highlightIds && !highlightIds.has(n.id))} />)}
      </ul>
    </section>
  );
}

function Card({ node, parent, lang, onClose, onSelect, onOpenAdvantage }: { node: FeatureNode; parent: FeatureNode | null; lang: LangKey; onClose: () => void; onSelect: (id: string) => void; onOpenAdvantage: (id: string) => void }) {
  const connectedIds = new Set<string>();
  if (node.parentId) connectedIds.add(node.parentId);
  data.nodes.forEach(n => { if (n.parentId === node.id) connectedIds.add(n.id); });
  data.edges.forEach(e => { if (e.from === node.id) connectedIds.add(e.to); if (e.to === node.id) connectedIds.add(e.from); });
  const connected = data.nodes.filter(n => connectedIds.has(n.id));
  const statusKey = node.status === "production" ? "statusProduction" : node.status === "beta" ? "statusBeta" : "statusRoadmap";
  const advantage = node.advantageId ? advantageById.get(node.advantageId) : null;
  return (
    <aside className={`card group-${groups.get(node.id)} app-${node.app}`} aria-label={node.title[lang]}>
      <button className="close" onClick={onClose} aria-label={lang === "pl" ? "Zamknij szczegóły" : "Close details"}>×</button>
      {advantage && <button className="card-adv-link" onClick={() => onOpenAdvantage(advantage.id)}>{lang === "pl" ? "Część przewagi" : "Part of advantage"} {advantage.rank} · {advantage.title[lang]} ↗</button>}
      {parent && <p className="card-parent">{parent.title[lang]}{node.version ? ` · ${node.version}` : ""}</p>}
      <p className={`stage-badge group-${groups.get(node.id)}`}><span className="graph-dot" />{STAGES.find(s => s.id === groups.get(node.id))?.[lang] ?? t("foundation",lang)}</p>
      <h2>{node.title[lang]}</h2>
      <p className={`card-status status-${node.status}`}>{MARKER[node.status]} {t(statusKey, lang)}</p>
      <p>{node.summary[lang]}</p>
      {node.statusNote && <p className="card-note">{node.statusNote[lang]}</p>}
      {connected.length > 0 && <section className="card-connections"><h3>{lang === "pl" ? "Połączone elementy" : "Connected nodes"} · {connected.length}</h3><ul>{connected.map(n => <li key={n.id}><button onClick={() => onSelect(n.id)}><span className={`graph-dot group-${groups.get(n.id)} app-${n.app}`} />{n.title[lang]}<span aria-hidden="true">↗</span></button></li>)}</ul></section>}
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
  const [view, setView] = useState<View>(() => { const value = new URLSearchParams(location.search).get("view"); return value === "advantages" || value === "grid" || value === "cloud" ? value : NARROW ? "advantages" : "cloud"; });
  const [colorBy, setColorBy] = useState<ColorBy>(() => new URLSearchParams(location.search).get("color") === "stage" ? "stage" : "app");
  const [cloudUiVisible, setCloudUiVisible] = useState(() => Boolean(new URLSearchParams(location.search).get("adv")));
  const [theme, setTheme] = useState<"paper" | "charcoal">(() => new URLSearchParams(location.search).get("theme") === "charcoal" ? "charcoal" : "paper");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openAdvId, setOpenAdvId] = useState(() => { const id = new URLSearchParams(location.search).get("adv"); return id && advantageById.has(id) ? id : data.advantages[0].id; });
  const [activeAdvId, setActiveAdvId] = useState<string | null>(() => { const params = new URLSearchParams(location.search); const id = params.get("adv"); return (params.get("view") === "cloud" || params.get("view") === "grid") && id && advantageById.has(id) ? id : null; });
  const lastMapView = useRef<"cloud" | "grid">(new URLSearchParams(location.search).get("view") === "grid" ? "grid" : "cloud");
  const selected = selectedId ? data.nodes.find((n) => n.id === selectedId) ?? null : null;
  const territoryLabels = useMemo(() => ({ cfab_hub: "CFAB 4D Hub", synergy: t("synergy", lang), timeflow: "TIMEFLOW" }), [lang]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSelectedId(null);
      if (view !== "advantages") {
        setActiveAdvId(null);
        const url = new URL(location.href);
        url.searchParams.delete("adv");
        history.replaceState(null, "", url);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);
  const columns = useMemo(() => STAGES.map((s) => ({ stage: s, blocks: buildBlocks(data, s.id) })), []);
  const foundation = useMemo(() => buildBlocks(data, null), []);
  const m = useMemo(() => metrics(data), []);
  const statusCounts = useMemo(() => Object.fromEntries((["production", "beta", "roadmap"] as Status[]).map((status) => [status, data.nodes.filter((node) => (node.nodeType === "feature" || node.nodeType === "bridge") && node.status === status).length])) as Record<Status, number>, []);
  const activeAdvantage = activeAdvId ? advantageById.get(activeAdvId) ?? null : null;
  const highlightIds = useMemo(() => activeAdvantage ? new Set(activeAdvantage.ids) : null, [activeAdvantage]);
  const topRef = useRef<HTMLElement>(null);
  const mapKeyRef = useRef<HTMLDivElement>(null);
  const mapBarRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLElement>(null);


  // Przewijanie w pionie z przyklejonym nagłówkiem strony i rzędem etapów:
  // rząd etapów przykleja się tuż pod nagłówkiem, którego wysokość zależy od języka.
  useLayoutEffect(() => {
    const top = topRef.current;
    const update = () => {
      const topHeight = top?.offsetHeight ?? 0;
      const keyHeight = mapKeyRef.current?.offsetHeight ?? 0;
      const barHeight = mapBarRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--sticky-top", `${topHeight}px`);
      document.documentElement.style.setProperty("--mapkey-height", `${keyHeight}px`);
      document.documentElement.style.setProperty("--cloud-chrome-height", `${topHeight + keyHeight + barHeight}px`);
      document.documentElement.style.setProperty("--legend-height", `${legendRef.current?.offsetHeight ?? 0}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    [top, mapKeyRef.current, mapBarRef.current, legendRef.current].forEach((element) => { if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [view, cloudUiVisible, activeAdvId]);

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
  const updateUrl = (next: View, advId: string | null) => {
    const url = new URL(location.href);
    url.searchParams.set("view", next);
    if (advId) url.searchParams.set("adv", advId);
    else url.searchParams.delete("adv");
    history.replaceState(null, "", url);
  };
  const clearAdvantage = () => {
    setActiveAdvId(null);
    if (view !== "advantages") updateUrl(view, null);
  };
  const switchColorBy = (next: ColorBy) => {
    setColorBy(next);
    const url = new URL(location.href);
    if (next === "stage") url.searchParams.set("color", "stage"); else url.searchParams.delete("color");
    history.replaceState(null, "", url);
  };
  const switchView = (next: View) => {
    setView(next);
    if (next === "cloud") setCloudUiVisible(true);
    setSelectedId(null);
    if (next !== "advantages") { lastMapView.current = next; setActiveAdvId(null); }
    updateUrl(next, next === "advantages" ? openAdvId : null);
  };
  const expandAdvantage = (id: string) => { setOpenAdvId(id); updateUrl("advantages", id); };
  const showAdvantageOnMap = (id: string) => { setOpenAdvId(id); setActiveAdvId(id); setSelectedId(null); setCloudUiVisible(true); setView(lastMapView.current); updateUrl(lastMapView.current, id); };
  const openAdvantage = (id: string) => { setOpenAdvId(id); setActiveAdvId(null); setSelectedId(null); setView("advantages"); updateUrl("advantages", id); };
  const selectFromAdvantages = (id: string) => setSelectedId(id);

  // Wersja kompaktowa kafelków z rozdz. 5.6 do nagłówka; pełne etykiety są w pasie liczb (Przewagi).
  const tiles: [string, string | number][] = [
    [t("metricModules", lang), m.modules],
    [t("metricFeatures", lang), m.features],
    [lang === "pl" ? "Mosty 3D" : "3D bridges", m.bridges],
    [lang === "pl" ? "Serwery MCP" : "MCP servers", m.mcp],
    [lang === "pl" ? "Danych w chmurze" : "Data in the cloud", "0 %"],
  ];

  return (
    <div className={`page view-${view} ${activeAdvantage ? "has-advantage" : ""} ${view === "cloud" ? cloudUiVisible ? "cloud-chrome-visible" : "is-immersive" : ""}`} data-graph-theme={theme} data-color-by={colorBy} onPointerDownCapture={() => { if (view === "cloud" && !cloudUiVisible) setCloudUiVisible(true); }} onFocusCapture={() => { if (view === "cloud" && !cloudUiVisible) setCloudUiVisible(true); }}>
      <header className="top" ref={topRef}>
        <div className="intro">
          <h1>CFAB 4D Hub × TIMEFLOW</h1>
          <p className="subtitle">{lang === "pl" ? "Dwa systemy. Wspólna przestrzeń pracy." : "Two systems. One connected workspace."}</p>
        </div>
          <div className="views" role="tablist" aria-label={lang === "pl" ? "Widok mapy" : "Map view"}>
            <button role="tab" aria-selected={view === "advantages"} onClick={() => switchView("advantages")}>{t("viewAdvantages", lang)}</button>
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
      {view !== "advantages" && <div className="map-key" ref={mapKeyRef} aria-label={lang === "pl" ? "Legenda kolorów" : "Colour key"}>
        <span className="color-by" role="group" aria-label={lang === "pl" ? "Koloruj według" : "Colour by"}>
          <button aria-pressed={colorBy === "app"} onClick={() => switchColorBy("app")}>{lang === "pl" ? "Program" : "Application"}</button>
          <button aria-pressed={colorBy === "stage"} onClick={() => switchColorBy("stage")}>{lang === "pl" ? "Etap pracy" : "Work stage"}</button>
        </span>
        {colorBy === "app" ? APPS.map(app => <span key={app.id} className={`app-key app-${app.id}`}><i className="graph-dot" />{app[lang]}</span>) : <>
          {STAGES.map(s => <span key={s.id} className={`group-${s.id}`}><i className="graph-dot" />{s[lang]}</span>)}
          <span className="group-foundation"><i className="graph-dot" />{t("foundation",lang)}</span>
        </>}
      </div>}

      {activeAdvantage && view !== "advantages" && <div className="adv-map-bar" ref={mapBarRef}><span>{lang === "pl" ? "Przewaga" : "Advantage"} {activeAdvantage.rank} {lang === "pl" ? "z" : "of"} {data.advantages.length} · <strong>{activeAdvantage.title[lang]}</strong></span><div><button onClick={() => showAdvantageOnMap(data.advantages[(activeAdvantage.rank + data.advantages.length - 2) % data.advantages.length].id)} aria-label={lang === "pl" ? "Poprzednia przewaga" : "Previous advantage"}>←</button><button onClick={() => showAdvantageOnMap(data.advantages[activeAdvantage.rank % data.advantages.length].id)} aria-label={lang === "pl" ? "Następna przewaga" : "Next advantage"}>→</button><button onClick={clearAdvantage} aria-label={lang === "pl" ? "Wyczyść podświetlenie" : "Clear highlight"}>×</button></div></div>}

      {view === "advantages" ? <Advantages data={data} lang={lang} expandedId={openAdvId} onExpand={expandAdvantage} onSelectNode={selectFromAdvantages} onShowMap={showAdvantageOnMap} /> : view === "cloud" ? (
        <main className="cloud-wrap">
          <Cloud data={data} lang={lang} territoryLabels={territoryLabels} selectedId={selectedId} highlightIds={highlightIds} onSelect={setSelectedId} onOpenAdvantage={openAdvantage} />
        </main>
      ) : (
      <main className="map" aria-label={lang === "pl" ? "Funkcje według etapów pracy" : "Features by work stage"}>
        <div className="columns">
          {columns.map(({ stage, blocks }) => (
            <section key={stage.id} className={`stage-section group-${stage.id}`}>
              <h2 className="column-title"><span className="graph-dot" /><span>{stage[lang]}</span><span className="count">{blocks.reduce((sum,b) => sum+b.items.length,0)}</span><span className="app-share" aria-hidden="true">{APPS.map(app => { const n = blocks.filter(b => b.app === app.id).reduce((sum, b) => sum + b.items.length, 0); return n ? <i key={app.id} className={`app-${app.id}`} style={{ flexGrow: n }} /> : null; })}</span></h2>
              <div className="column">
                {blocks.map(b => <BlockView key={b.key} block={b} lang={lang} onSelect={setSelectedId} highlightIds={highlightIds} />)}
              </div>
            </section>
          ))}
        </div>
        <section className="foundation group-foundation">
          <h2 className="column-title"><span className="graph-dot" />{t("foundation", lang)}</h2>
          <div className="foundation-blocks">
            {foundation.map(b => <BlockView key={b.key} block={b} lang={lang} onSelect={setSelectedId} highlightIds={highlightIds} />)}
          </div>
        </section>
        {selected && <Card node={selected} lang={lang} parent={data.nodes.find(n => n.id === selected.parentId) ?? null} onClose={() => setSelectedId(null)} onSelect={setSelectedId} onOpenAdvantage={openAdvantage} />}
      </main>
      )}

      {view === "cloud" ? <footer className="legend legend-cloud" ref={legendRef} aria-label={lang === "pl" ? "Jak czytać chmurę" : "How to read the cloud"}>
        <div className="legend-group">
          <strong>{lang === "pl" ? "Węzły" : "Nodes"}</strong>
          <span><i className="legend-node legend-app" />{lang === "pl" ? "aplikacja" : "application"}</span>
          <span><i className="legend-node legend-module" />{lang === "pl" ? "moduł · bliższa orbita" : "module · inner orbit"}</span>
          <span><i className="legend-node legend-feature" />{lang === "pl" ? "funkcja · dalsze orbity" : "feature · outer orbits"}</span>
          <span><i className="legend-node legend-bridge" />{lang === "pl" ? "wspólna funkcja · między aplikacjami" : "shared feature · between apps"}</span>
        </div>
        <div className="legend-group">
          <strong>{lang === "pl" ? "Stan" : "Status"}</strong>
          <span><i className="legend-status legend-ready" />{t("statusProduction", lang)} {statusCounts.production}</span>
          <span><i className="legend-status legend-beta" />{t("statusBeta", lang)} {statusCounts.beta}</span>
          <span><i className="legend-status legend-planned" />{t("statusRoadmap", lang)} {statusCounts.roadmap}</span>
        </div>
        <div className="legend-group legend-hint">
          <span>{lang === "pl" ? "Poświata oznacza wskazany węzeł · Linie pokazują powiązania" : "Glow marks the focused node · Lines show connections"}</span>
        </div>
      </footer> : view === "grid" ? <footer className="legend legend-grid" aria-label={lang === "pl" ? "Oznaczenia etapów pracy" : "Work-stage key"}>
        <span>● {t("statusProduction", lang)} {statusCounts.production}</span>
        <span>◐ {t("statusBeta", lang)} {statusCounts.beta}</span>
        <span>○ {t("statusRoadmap", lang)} {statusCounts.roadmap}</span>
        <span>◆ {lang === "pl" ? "wspólna funkcja" : "shared feature"}</span>
        <span className="grid-hint">{lang === "pl" ? "Czytaj od lewej do prawej — tak wygląda dzień pracy." : "Read left to right — that's a working day."}</span>
      </footer> : <footer className="legend legend-advantages"><span>● {t("statusProduction", lang)} {statusCounts.production} · ◐ {t("statusBeta", lang)} {statusCounts.beta} · ○ {t("statusRoadmap", lang)} {statusCounts.roadmap}</span></footer>}
      {view === "advantages" && selected && <Card node={selected} lang={lang} parent={data.nodes.find(n => n.id === selected.parentId) ?? null} onClose={() => setSelectedId(null)} onSelect={setSelectedId} onOpenAdvantage={openAdvantage} />}
    </div>
  );
}
