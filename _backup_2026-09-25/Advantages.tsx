import { useState } from "react";
import type { Advantage, FeaturesData, LangKey, FeatureNode } from "./types";

const FLOW_PROOFS = [
  ["syn.machine_time", "hub.render.ledger_always"],
  ["hub.render.ledger", "syn.cfabx"],
  ["tf.renders.ingest", "tf.renders.assign", "tf.renders.offline", "tf.renders.render_sync"],
  ["syn.ledger", "tf.renders.cost", "tf.reports.profitability", "tf.reports.pdf"],
];

function assumptionText(data: FeaturesData, advantage: Advantage, lang: LangKey) {
  const assumption = data.assumptions.find((item) => item.id === advantage.assumptionId);
  if (!assumption) return null;
  if (assumption.id === "A-ODZYSK") {
    const range = `${assumption.value}–${assumption.maxValue} %`;
    return lang === "pl" ? `${range} odzysku przychodu` : `${range} revenue recovery`;
  }
  return lang === "pl" ? `${assumption.value} h / artystę / mies.` : `${assumption.value} h / artist / month`;
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
  const toolNames = (advantage: Advantage) => advantage.replacesTools.map((item) => item[lang]).join(" · ");
  const proof = (node: FeatureNode, activeFlow: number | null) => (
    <button key={node.id} className={`adv-proof group-${node.stage ?? "foundation"} ${activeFlow !== null && !FLOW_PROOFS[activeFlow]?.includes(node.id) ? "is-dimmed" : ""}`} onClick={() => onSelectNode(node.id)} title={node.title[lang]}>
      <span className="proof-marker" aria-hidden="true">●</span>{node.shortTitle[lang]}
    </button>
  );
  return <main className="advantages" aria-label={label ? "Pięć przewag" : "Five advantages"}>
    <div className="adv-intro"><div><span className="adv-eyebrow">{label ? "TEZY POPARTE DZIAŁAJĄCYMI FUNKCJAMI" : "CLAIMS BACKED BY WORKING FEATURES"}</span><h2>{label ? "Pięć przewag. Każda z dowodem." : "Five advantages. Each with proof."}</h2></div><p>{label ? "Wybierz tezę, a potem przejdź do jej funkcji na mapie." : "Open a claim, then follow its features onto the map."}</p></div>
    <div className="adv-rows">{rows.map((advantage) => {
      const expanded = expandedId === advantage.id;
      const nodes = advantage.ids.map((id) => byId.get(id)).filter((node): node is FeatureNode => Boolean(node));
      const assumption = assumptionText(data, advantage, lang);
      return <article key={advantage.id} className={`adv-row ${expanded ? "expanded" : ""}`}>
        <button className="adv-row-head" aria-expanded={expanded} onClick={() => { setFlowStep(null); onExpand(advantage.id); }}>
          <span className="adv-rank">{String(advantage.rank).padStart(2, "0")}</span>
          <span className="adv-head-text"><strong>{advantage.title[lang]}</strong>{!expanded && <><small>{advantage.thesis[lang]}</small><span className="adv-collapsed-meta">{label ? "Zastępuje" : "Replaces"}: {toolNames(advantage)}</span></>}</span>
          <span className="adv-count">{nodes.length} {label ? "funkcji" : "features"} <span aria-hidden="true">●</span></span>
          <span className="adv-chevron" aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
        {expanded && <div className="adv-detail">
          <p className="adv-thesis">{advantage.thesis[lang]}</p>
          {advantage.flow && <div className="adv-flow" aria-label={label ? "Przepływ od renderu do wyceny" : "Flow from render to quote"} onMouseLeave={() => setFlowStep(null)}>
            {advantage.flow.map((step, index) => <div className="flow-pair" key={step.pl}><button className={`flow-step ${flowStep === index ? "active" : ""} flow-step-${index}`} onMouseEnter={() => setFlowStep(index)} onFocus={() => setFlowStep(index)} onBlur={() => setFlowStep(null)} title={label ? "Podświetl związane funkcje" : "Highlight related features"}><span>{String(index + 1).padStart(2, "0")}</span>{step[lang]}</button>{index < advantage.flow!.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}</div>)}
          </div>}
          <div className="adv-explain"><p><strong>{label ? "Dlaczego trudno skopiować" : "Why it is hard to copy"}</strong>{advantage.why[lang]}</p><p><strong>{label ? "Zastępuje" : "Replaces"}</strong>{toolNames(advantage)}</p>{assumption && <p className="adv-assumption"><strong>{label ? "Założenie" : "Assumption"}</strong>{assumption}</p>}</div>
          <div className="adv-proof-row"><span className="adv-proof-label">{label ? "DOWODY NA MAPIE" : "PROOF ON THE MAP"}</span><div className="adv-proofs">{nodes.map((node) => proof(node, flowStep))}</div><button className="adv-map-button" onClick={() => onShowMap(advantage.id)}>{label ? "Pokaż na mapie" : "Show on map"} <span aria-hidden="true">↗</span></button></div>
        </div>}
      </article>;
    })}</div>
    <div className="adv-also"><strong>{label ? "Także" : "Also"}</strong><div>{data.alsoStrong.map((id) => { const node = byId.get(id); return node ? <button key={id} onClick={() => onSelectNode(id)}>{node.shortTitle[lang]}</button> : null; })}</div></div>
  </main>;
}
