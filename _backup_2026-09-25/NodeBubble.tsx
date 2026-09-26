import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { FeatureNode, FeaturesData, LangKey, Status } from "./types";
import { STAGES, t } from "./i18n";
import type { Group } from "./graphModel";

const MARKER: Record<Status, string> = { production: "●", beta: "◐", roadmap: "○" };

export interface ConnectionItem {
  id: string;
  node: FeatureNode;
  group: Group;
  relationType: string;
  relationLabel: { pl: string; en: string };
  edgeLabel: { pl: string; en: string } | null;
  direction?: "in" | "out" | "parent" | "child";
}

export function getNodeConnections(
  node: FeatureNode,
  data: FeaturesData,
  groups: Map<string, Group>
): ConnectionItem[] {
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  const list: ConnectionItem[] = [];
  const seen = new Set<string>();

  // 1. Parent module
  if (node.parentId && byId.has(node.parentId)) {
    const parent = byId.get(node.parentId)!;
    seen.add(parent.id);
    list.push({
      id: parent.id,
      node: parent,
      group: groups.get(parent.id) ?? "foundation",
      relationType: "parent",
      relationLabel: { pl: "Moduł nadrzędny", en: "Parent module" },
      edgeLabel: null,
      direction: "parent",
    });
  }

  // 2. Child features if this is a module or hub
  data.nodes
    .filter((n) => n.parentId === node.id)
    .forEach((child) => {
      if (!seen.has(child.id)) {
        seen.add(child.id);
        list.push({
          id: child.id,
          node: child,
          group: groups.get(child.id) ?? "foundation",
          relationType: "child",
          relationLabel: { pl: "Funkcja składowa", en: "Sub-feature" },
          edgeLabel: null,
          direction: "child",
        });
      }
    });

  // 3. Edges in data.edges
  const relationLabels: Record<string, { pl: string; en: string }> = {
    ipc: { pl: "Most IPC", en: "IPC link" },
    file_exchange: { pl: "Wymiana plików", en: "File exchange" },
    data_flow: { pl: "Przepływ danych", en: "Data flow" },
    depends_on: { pl: "Zależność", en: "Dependency" },
    replaces: { pl: "Zastępuje", en: "Replaces" },
    hierarchy: { pl: "Hierarchia", en: "Hierarchy" },
  };

  for (const edge of data.edges) {
    if (edge.from === node.id && byId.has(edge.to)) {
      const target = byId.get(edge.to)!;
      if (!seen.has(target.id)) {
        seen.add(target.id);
        list.push({
          id: target.id,
          node: target,
          group: groups.get(target.id) ?? "foundation",
          relationType: edge.type,
          relationLabel: relationLabels[edge.type] ?? { pl: "Połączenie", en: "Connection" },
          edgeLabel: edge.label ?? null,
          direction: "out",
        });
      }
    } else if (edge.to === node.id && byId.has(edge.from)) {
      const source = byId.get(edge.from)!;
      if (!seen.has(source.id)) {
        seen.add(source.id);
        list.push({
          id: source.id,
          node: source,
          group: groups.get(source.id) ?? "foundation",
          relationType: edge.type,
          relationLabel: relationLabels[edge.type] ?? { pl: "Połączenie", en: "Connection" },
          edgeLabel: edge.label ?? null,
          direction: "in",
        });
      }
    }
  }

  return list;
}

export interface NodeBubbleProps {
  node: FeatureNode;
  parent: FeatureNode | null;
  lang: LangKey;
  data: FeaturesData;
  groups: Map<string, Group>;
  position: { x: number; y: number };
  containerSize: { width: number; height: number };
  onClose: () => void;
  onSelect: (id: string) => void;
  onOpenAdvantage: (id: string) => void;
}

export default function NodeBubble({
  node,
  parent,
  lang,
  data,
  groups,
  position,
  containerSize,
  onClose,
  onSelect,
  onOpenAdvantage,
}: NodeBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubbleHeight, setBubbleHeight] = useState(380);
  const pl = lang === "pl";

  const group = groups.get(node.id) ?? "foundation";
  const stage = STAGES.find((s) => s.id === group);
  const stageName = stage ? stage[lang] : t("foundation", lang);
  const statusKey =
    node.status === "production"
      ? "statusProduction"
      : node.status === "beta"
      ? "statusBeta"
      : "statusRoadmap";

  const connections = useMemo(
    () => getNodeConnections(node, data, groups),
    [node, data, groups]
  );
  const advantage = node.advantageId ? data.advantages.find((item) => item.id === node.advantageId) : null;

  useLayoutEffect(() => {
    if (bubbleRef.current) {
      // offsetHeight is not distorted by the entry scale animation, unlike
      // getBoundingClientRect(). Using the animated height can push the final
      // bubble past the lower map edge once the animation reaches scale(1).
      const height = bubbleRef.current.offsetHeight;
      if (height > 0) setBubbleHeight(height);
    }
  }, [node, connections, containerSize.height]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const bubbleWidth = Math.min(360, Math.max(0, containerSize.width - 32));
  const visibleBubbleHeight = Math.min(bubbleHeight, Math.max(0, containerSize.height - 32));
  const offset = 26; // Distance from circle center to bubble
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), Math.max(min, max));
  const maxLeft = containerSize.width - bubbleWidth - 16;
  const maxTop = containerSize.height - visibleBubbleHeight - 16;

  // Determine horizontal placement
  const fitsRight = position.x + offset + bubbleWidth + 16 <= containerSize.width;
  const fitsLeft = position.x - offset - bubbleWidth >= 16;

  let left: number;
  let top: number;
  let arrowSide: "left" | "right" | "top" | "bottom";
  let arrowOffset: number;

  if (fitsRight) {
    left = position.x + offset;
    arrowSide = "left";
    top = clamp(position.y - 80, 16, maxTop);
    arrowOffset = clamp(position.y - top, 22, visibleBubbleHeight - 22);
  } else if (fitsLeft) {
    left = position.x - offset - bubbleWidth;
    arrowSide = "right";
    top = clamp(position.y - 80, 16, maxTop);
    arrowOffset = clamp(position.y - top, 22, visibleBubbleHeight - 22);
  } else {
    // Mobile or tight horizontal space
    left = clamp(position.x - bubbleWidth / 2, 16, maxLeft);
    if (position.y > containerSize.height / 2) {
      arrowSide = "bottom";
      top = clamp(position.y - offset - visibleBubbleHeight, 16, maxTop);
      arrowOffset = clamp(position.x - left, 22, bubbleWidth - 22);
    } else {
      arrowSide = "top";
      top = clamp(position.y + offset, 16, maxTop);
      arrowOffset = clamp(position.x - left, 22, bubbleWidth - 22);
    }
  }

  return (
    <div
      ref={bubbleRef}
      className={`node-bubble group-${group} arrow-side-${arrowSide}`}
      style={{
        left: `${Math.round(left)}px`,
        top: `${Math.round(top)}px`,
        width: `${bubbleWidth}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      role="dialog"
      aria-label={node.title[lang]}
    >
      <div
        className={`bubble-arrow arrow-${arrowSide}`}
        style={
          arrowSide === "left" || arrowSide === "right"
            ? { top: `${Math.round(arrowOffset)}px` }
            : { left: `${Math.round(arrowOffset)}px` }
        }
        aria-hidden="true"
      />

      <div
        className="node-bubble-scroll"
        style={{ maxHeight: `${Math.max(96, containerSize.height - 32)}px` }}
      >

      <div className="bubble-header">
        <div className="bubble-badges">
          <span className={`stage-badge group-${group}`}>
            <span className="graph-dot" />
            {stageName}
          </span>
          {parent && (
            <span className="bubble-parent-pill" title={parent.title[lang]}>
              {parent.shortTitle[lang]}
              {node.version ? ` · ${node.version}` : ""}
            </span>
          )}
        </div>
        <button
          className="bubble-close-btn"
          onClick={onClose}
          aria-label={pl ? "Zamknij" : "Close"}
        >
          ×
        </button>
      </div>

      {advantage && <button className="bubble-adv-link" onClick={() => onOpenAdvantage(advantage.id)}>{pl ? "Część przewagi" : "Part of advantage"} {advantage.rank} · {advantage.title[lang]} ↗</button>}

      <div className="bubble-main-info">
        <h3 className="bubble-title">{node.title[lang]}</h3>
        <div className={`bubble-status status-${node.status}`}>
          <span className="marker" aria-hidden="true">
            {node.nodeType === "bridge" ? "◆" : MARKER[node.status]}
          </span>
          <span className="status-text">{t(statusKey, lang)}</span>
        </div>
        <p className="bubble-summary">{node.summary[lang]}</p>
        {node.statusNote && <p className="bubble-note">{node.statusNote[lang]}</p>}
      </div>

      <div className="bubble-connections-section">
        <div className="bubble-section-head">
          <h4 className="section-title">
            {pl ? "Połączenia" : "Connections"}
            <span className="count-pill">· {connections.length}</span>
          </h4>
        </div>

        {connections.length > 0 ? (
          <ul className="bubble-connections-list">
            {connections.map((conn) => (
              <li key={conn.id}>
                <button
                  type="button"
                  className={`connection-chip group-${conn.group}`}
                  onClick={() => onSelect(conn.id)}
                >
                  <span className="graph-dot" />
                  <div className="connection-text">
                    <span className="connection-name">{conn.node.title[lang]}</span>
                    <span className="connection-meta">
                      {conn.relationLabel[lang]}
                      {conn.edgeLabel ? ` (${conn.edgeLabel[lang]})` : ""}
                    </span>
                  </div>
                  <span className="connection-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-connections">
            {pl
              ? "Brak bezpośrednich powiązań w grafie."
              : "No direct connections in the graph."}
          </p>
        )}
      </div>

      {(node.techMoat.isUniqueMoat ||
        node.techStack.length > 0 ||
        node.replacesTools.length > 0) && (
        <div className="bubble-extra-details">
          {node.techMoat.isUniqueMoat && node.techMoat.description && (
            <div className="bubble-moat-box">
              <span className="extra-label">
                ★ {t("moat", lang)}
              </span>
              <p>{node.techMoat.description[lang]}</p>
            </div>
          )}

          {node.techStack.length > 0 && (
            <div className="bubble-tags-row">
              <span className="extra-label">{t("stack", lang)}:</span>
              <div className="bubble-tags">
                {node.techStack.map((tech) => (
                  <span key={tech} className="bubble-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {node.replacesTools.length > 0 && (
            <div className="bubble-tags-row">
              <span className="extra-label">{t("replaces", lang)}:</span>
              <div className="bubble-tags">
                {node.replacesTools.map((tool) => (
                  <span key={tool} className="bubble-tag replace-tag">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
