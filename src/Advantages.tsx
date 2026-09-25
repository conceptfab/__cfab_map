import { useState } from "react";
import type { Advantage, App, FeaturesData, LangKey, FeatureNode, Status } from "./types";
import { metrics } from "./layout";
import { t } from "./i18n";

const FLOW_PROOFS = [
  ["syn.machine_time", "hub.render.ledger_always"],
  ["hub.render.ledger", "syn.cfabx"],
  ["tf.renders.ingest", "tf.renders.assign", "tf.renders.offline", "tf.renders.render_sync"],
  ["syn.ledger", "tf.renders.cost", "tf.reports.profitability", "tf.reports.pdf"],
];
// Po której stronie dzieje się krok przepływu: Hub → połączenie → TIMEFLOW → wynik.
const FLOW_APP: App[] = ["cfab_hub", "synergy", "timeflow", "timeflow"];

export const APPS: { id: App; pl: string; en: string; short: string }[] = [
  { id: "cfab_hub", pl: "CFAB 4D Hub", en: "CFAB 4D Hub", short: "Hub" },
  { id: "synergy", pl: "Połączenie", en: "Integration", short: "Hub+TF" },
  { id: "timeflow", pl: "TIMEFLOW", en: "TIMEFLOW", short: "TF" },
];

const UNIT: Record<string, { pl: string; en: string }> = {
  "h / artysta / mies.": { pl: "na artystę miesięcznie", en: "per artist per month" },
  "USD / stanowisko / mies.": { pl: "na stanowisko miesięcznie", en: "per seat per month" },
};

// Wartość założenia (duża liczba) + podpis. Zakres pokazany bez zaokrąglania (R2).
function assumptionFigure(data: FeaturesData, advantage: Advantage, lang: LangKey) {
  const a = data.assumptions.find((item) => item.id === advantage.assumptionId);
  if (!a) return null;
  const range = a.maxValue !== undefined ? `${a.value}–${a.maxValue}` : `${a.value}`;
  if (a.unit === "%") return { value: `${range} %`, unit: "", caption: a[lang] };
  const short = a.unit.split(" / ")[0];
  return { value: `${range} ${short}`, unit: UNIT[a.unit]?.[lang] ?? a.unit, caption: a[lang] };
}

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
  const [flowStep, setFlowStep] = useState<number | null>(null);
  const byId = new Map(data.nodes.map((node) => [node.id, node]));
  const rows = [...data.advantages].sort((a, b) => a.rank - b.rank);
  const label = lang === "pl";
  const tools = (advantage: Advantage) => advantage.replacesTools.map((item) => <span key={item.pl} className="tool">{item[lang]}</span>);
  const proof = (node: FeatureNode, activeFlow: number | null) => (
    <button key={node.id} className={`adv-proof group-${node.stage ?? "foundation"} app-${node.app} ${activeFlow !== null && !FLOW_PROOFS[activeFlow]?.includes(node.id) ? "is-dimmed" : ""}`} onClick={() => onSelectNode(node.id)} title={node.title[lang]}>
      <span className="proof-marker" aria-hidden="true">{node.nodeType === "bridge" ? "◆" : "●"}</span>{node.shortTitle[lang]}
    </button>
  );
  return <main className="advantages" aria-label={label ? "Pięć przewag" : "Five advantages"}>
    <KpiStrip data={data} lang={lang} />
    <div className="adv-intro"><div><span className="adv-eyebrow">{label ? "TEZY POPARTE DZIAŁAJĄCYMI FUNKCJAMI" : "CLAIMS BACKED BY WORKING FEATURES"}</span><h2>{label ? "Pięć przewag. Każda z dowodem." : "Five advantages. Each with proof."}</h2></div><p>{label ? "Wybierz tezę, a potem przejdź do jej funkcji na mapie." : "Open a claim, then follow its features onto the map."}</p></div>
    <div className="adv-rows">{rows.map((advantage) => {
      const expanded = expandedId === advantage.id;
      const nodes = advantage.ids.map((id) => byId.get(id)).filter((node): node is FeatureNode => Boolean(node));
      const figure = assumptionFigure(data, advantage, lang);
      const apps = APPS.map((app) => ({ app, list: nodes.filter((node) => node.app === app.id) })).filter((group) => group.list.length);
      return <article key={advantage.id} className={`adv-row ${expanded ? "expanded" : ""}`}>
        <button className="adv-row-head" aria-expanded={expanded} onClick={() => { setFlowStep(null); onExpand(advantage.id); }}>
          <span className="adv-rank">{String(advantage.rank).padStart(2, "0")}</span>
          <span className="adv-head-text"><strong>{advantage.title[lang]}</strong>{!expanded && <><small>{advantage.thesis[lang]}</small><span className="adv-collapsed-meta"><span className="tools-label">{label ? "Zastępuje" : "Replaces"}</span>{tools(advantage)}</span></>}</span>
          <span className="adv-count"><span><b>{nodes.length}</b> {label ? "funkcji" : "features"}</span><AppShare nodes={nodes} /></span>
          <span className="adv-chevron" aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
        {expanded && <div className="adv-detail">
          <div className="adv-lead">
            <p className="adv-thesis">{advantage.thesis[lang]}</p>
            {figure && <div className="adv-figure">
              <span className="adv-figure-label">{label ? "Założenie" : "Assumption"}</span>
              <b>{figure.value}</b>
              {figure.unit && <span className="adv-figure-unit">{figure.unit}</span>}
              <span className="adv-figure-caption">{figure.caption}</span>
            </div>}
          </div>
          {advantage.flow && <div className="adv-flow" aria-label={label ? "Przepływ od renderu do wyceny" : "Flow from render to quote"} onMouseLeave={() => setFlowStep(null)}>
            {advantage.flow.map((step, index) => {
              const app = APPS.find((item) => item.id === FLOW_APP[index])!;
              const outcome = index === advantage.flow!.length - 1;
              return <div className="flow-pair" key={step.pl}><button className={`flow-step app-${app.id} ${outcome ? "is-outcome" : ""} ${flowStep === index ? "active" : ""}`} onMouseEnter={() => setFlowStep(index)} onFocus={() => setFlowStep(index)} onBlur={() => setFlowStep(null)} title={label ? "Podświetl związane funkcje" : "Highlight related features"}><span className="flow-num">{String(index + 1).padStart(2, "0")}</span><span className="flow-text"><small className="flow-app">{app[lang]}</small>{step[lang]}</span></button>{!outcome && <span className="flow-arrow" aria-hidden="true">→</span>}</div>;
            })}
          </div>}
          <div className="adv-explain">
            <p><strong>{label ? "Dlaczego trudno skopiować" : "Why it is hard to copy"}</strong>{advantage.why[lang]}</p>
            <p className="adv-replaces"><strong>{label ? "Zastępuje" : "Replaces"}</strong><span className="adv-collapsed-meta">{tools(advantage)}</span></p>
          </div>
          <div className="adv-proof-row">
            <div className="adv-proof-head"><span className="adv-proof-label">{label ? "DOWODY NA MAPIE" : "PROOF ON THE MAP"} · {nodes.length}</span><button className="adv-map-button" onClick={() => onShowMap(advantage.id)}>{label ? "Pokaż na mapie" : "Show on map"} <span aria-hidden="true">↗</span></button></div>
            <div className="adv-proofs-by-app">{apps.map(({ app, list }) => <div key={app.id} className={`proof-col app-${app.id}`} style={{ flexGrow: Math.max(list.length, 2) }}>
              <h4><i className="app-dot" />{app[lang]} <span>{list.length}</span></h4>
              <div className="adv-proofs">{list.map((node) => proof(node, flowStep))}</div>
            </div>)}</div>
          </div>
        </div>}
      </article>;
    })}</div>
    <div className="adv-also"><strong>{label ? "Także" : "Also"}</strong><div>{data.alsoStrong.map((id) => { const node = byId.get(id); return node ? <button key={id} onClick={() => onSelectNode(id)}>{node.shortTitle[lang]}</button> : null; })}</div></div>
  </main>;
}
