import type { App, FeaturesData, LangKey, FeatureNode, Status } from "./types";
import { metrics } from "./layout";
import { t } from "./i18n";

export const APPS: { id: App; pl: string; en: string; short: string }[] = [
  { id: "cfab_hub", pl: "CFAB 4D Hub", en: "CFAB 4D Hub", short: "Hub" },
  { id: "synergy", pl: "Połączenie", en: "Integration", short: "Hub+TF" },
  { id: "timeflow", pl: "TIMEFLOW", en: "TIMEFLOW", short: "TF" },
];

function AppShare({ nodes }: { nodes: FeatureNode[] }) {
  return <span className="app-share" aria-hidden="true">{APPS.map((app) => {
    const n = nodes.filter((node) => node.app === app.id).length;
    return n ? <i key={app.id} className={`app-${app.id}`} style={{ flexGrow: n }} /> : null;
  })}</span>;
}

export function KpiStrip({ data, lang }: { data: FeaturesData; lang: LangKey }) {
  const pl = lang === "pl";
  const m = metrics(data);
  const items = data.nodes.filter((n) => n.nodeType === "feature" || n.nodeType === "bridge");
  const count = (s: Status) => items.filter((n) => n.status === s).length;
  const ready = count("production");
  const tiles: [string | number, string][] = [
    [m.features, t("metricFeatures", lang)],
    [m.modules, t("metricModules", lang)],
    [m.systems, t("metricSystems", lang)],
    [m.bridges, t("metricBridges", lang)],
    [m.mcp, t("metricMcp", lang)],
    ["0 %", t("metricCloud", lang)],
  ];
  return <section className="kpi-strip" aria-label={pl ? "Najważniejsze liczby" : "Key numbers"}>
    <dl className="kpi-tiles">{tiles.map(([value, label], index) => <div key={label} className={`kpi ${index === tiles.length - 1 ? "kpi-accent" : ""}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="kpi-ready">
      <span className="kpi-ready-label"><b>{ready}</b> {pl ? `z ${items.length} funkcji gotowych w kodzie` : `of ${items.length} features shipped in code`}</span>
      <span className="kpi-ready-bar" role="img" aria-label={`${ready} / ${items.length}`}>
        <i className="seg-production" style={{ flexGrow: ready }} />
        <i className="seg-beta" style={{ flexGrow: count("beta") }} />
        <i className="seg-roadmap" style={{ flexGrow: count("roadmap") }} />
      </span>
      <span className="kpi-ready-rest">◐ {t("statusBeta", lang)} {count("beta")} · ○ {t("statusRoadmap", lang)} {count("roadmap")}</span>
    </div>
  </section>;
}

export default function Advantages({ data, lang, expandedId, onExpand, onSelectNode, onShowMap }: {
  data: FeaturesData;
  lang: LangKey;
  expandedId: string;
  onExpand: (id: string) => void;
  onSelectNode: (id: string) => void;
  onShowMap: (id: string) => void;
}) {
  const byId = new Map(data.nodes.map((node) => [node.id, node]));
  const rows = [...data.advantages].sort((a, b) => a.rank - b.rank);
  const label = lang === "pl";
  const proof = (node: FeatureNode) => (
    <button key={node.id} className={`adv-proof group-${node.stage ?? "foundation"} app-${node.app}`} onClick={() => onSelectNode(node.id)} title={node.title[lang]}>
      <span className="proof-marker" aria-hidden="true">{node.nodeType === "bridge" ? "◆" : "●"}</span>{node.shortTitle[lang]}
    </button>
  );
  return <main className="advantages" aria-label={label ? "Przewagi ekosystemu" : "Ecosystem advantages"}>
    <KpiStrip data={data} lang={lang} />
    <div className="adv-intro"><div><span className="adv-eyebrow">CFAB 4D HUB + TIMEFLOW</span><h2>{label ? "Co daje cały ekosystem" : "What the ecosystem delivers"}</h2></div><p>{label ? "Od zasobów i produkcji 3D po organizację pracy i rentowność projektów." : "From assets and 3D production to work organisation and project profitability."}</p></div>
    <div className="adv-rows">{rows.map((advantage) => {
      const expanded = expandedId === advantage.id;
      const nodes = advantage.ids.map((id) => byId.get(id)).filter((node): node is FeatureNode => Boolean(node));
      const apps = APPS.map((app) => ({ app, list: nodes.filter((node) => node.app === app.id) })).filter((group) => group.list.length);
      return <article key={advantage.id} className={`adv-row ${expanded ? "expanded" : ""}`}>
        <button className="adv-row-head" aria-expanded={expanded} onClick={() => onExpand(advantage.id)}>
          <span className="adv-rank">{String(advantage.rank).padStart(2, "0")}</span>
          <span className="adv-head-text"><strong>{advantage.title[lang]}</strong>{!expanded && <small>{advantage.thesis[lang]}</small>}</span>
          <span className="adv-count"><span><b>{nodes.length}</b> {label ? "funkcji" : "features"}</span><AppShare nodes={nodes} /></span>
          <span className="adv-chevron" aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
        {expanded && <div className="adv-detail">
          <div className="adv-lead">
            <p className="adv-thesis">{advantage.thesis[lang]}</p>
          </div>
          <div className="adv-explain">
            <p><strong>{label ? "Jak to działa razem" : "How it works together"}</strong>{advantage.why[lang]}</p>
          </div>
          <div className="adv-proof-row">
            <div className="adv-proof-head"><span className="adv-proof-label">{label ? "POWIĄZANE FUNKCJE" : "SUPPORTING FEATURES"} · {nodes.length}</span><button className="adv-map-button" onClick={() => onShowMap(advantage.id)}>{label ? "Pokaż na mapie" : "Show on map"} <span aria-hidden="true">↗</span></button></div>
            <div className="adv-proofs-by-app">{apps.map(({ app, list }) => <div key={app.id} className={`proof-col app-${app.id}`} style={{ flexGrow: Math.max(list.length, 2) }}>
              <h4><i className="app-dot" />{app[lang]} <span>{list.length}</span></h4>
              <div className="adv-proofs">{list.map((node) => proof(node))}</div>
            </div>)}</div>
          </div>
        </div>}
      </article>;
    })}</div>
    <div className="adv-also"><strong>{label ? "Narzędzia w ekosystemie" : "Tools in the ecosystem"}</strong><div>{data.alsoStrong.map((id) => { const node = byId.get(id); return node ? <button key={id} onClick={() => onSelectNode(id)}>{node.shortTitle[lang]}</button> : null; })}</div></div>
  </main>;
}
