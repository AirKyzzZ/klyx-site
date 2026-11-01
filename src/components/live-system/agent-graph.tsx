import {
  Database,
  FileText,
  Funnel,
  Gauge,
  GitBranch,
  Inbox,
  type LucideIcon,
  MessageSquare,
  Rocket,
  Search,
  UserCheck,
} from "lucide-react";
import type { CSSProperties } from "react";

import { ToolLogo } from "@/components/logos/tool-logo";

import {
  edgeKey,
  type GraphNode,
  type NodeIcon,
  type Scenario,
  type ScenarioFinalState,
  lastEdge,
  terminalNode,
} from "@/lib/scenarios";
import { AI_MODEL_LOGOS } from "@/lib/tools";

const ICONS: Record<NodeIcon, LucideIcon> = {
  inbox: Inbox,
  filter: Funnel,
  database: Database,
  message: MessageSquare,
  git: GitBranch,
  gauge: Gauge,
  rocket: Rocket,
  file: FileText,
  "user-check": UserCheck,
  search: Search,
};

const DESKTOP = {
  width: 720,
  height: 300,
  x: "x",
  y: "y",
  halfWidth: { node: 83, agent: 94 },
  halfHeight: { node: 26, agent: 30 },
  vertical: false,
} as const;
const MOBILE = {
  width: 340,
  height: 408,
  x: "mx",
  y: "my",
  halfWidth: { node: 78, agent: 78 },
  halfHeight: { node: 24, agent: 27 },
  vertical: true,
} as const;
type Layout = typeof DESKTOP | typeof MOBILE;

const round = (value: number) => Math.round(value * 10) / 10;
const size = (node: GraphNode) => (node.agent ? "agent" : "node");

function edgeGeometry(layout: Layout, from: GraphNode, to: GraphNode) {
  let x1 = (from[layout.x] / 100) * layout.width;
  let y1 = (from[layout.y] / 100) * layout.height;
  let x2 = (to[layout.x] / 100) * layout.width;
  let y2 = (to[layout.y] / 100) * layout.height;
  const horizontal = !layout.vertical && Math.abs(x2 - x1) >= Math.abs(y2 - y1);
  if (horizontal) {
    const direction = Math.sign(x2 - x1);
    x1 += direction * layout.halfWidth[size(from)];
    x2 -= direction * layout.halfWidth[size(to)];
  } else {
    const direction = Math.sign(y2 - y1);
    y1 += direction * layout.halfHeight[size(from)];
    y2 -= direction * layout.halfHeight[size(to)];
  }
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const [c1, c2] = horizontal
    ? [`${round(midX)} ${round(y1)}`, `${round(midX)} ${round(y2)}`]
    : [`${round(x1)} ${round(midY)}`, `${round(x2)} ${round(midY)}`];
  return {
    d: `M${round(x1)} ${round(y1)}C${c1} ${c2} ${round(x2)} ${round(y2)}`,
    end: { x: round(x2), y: round(y2) },
  };
}

function Edges({
  scenario,
  layout,
  done,
  parkedOn,
  className,
}: {
  scenario: Scenario;
  layout: Layout;
  done: Set<string>;
  parkedOn?: string;
  className: string;
}) {
  const byId = new Map(scenario.nodes.map((node) => [node.id, node]));
  return (
    <svg
      className={`ls-edges ${className}`}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      aria-hidden="true"
      focusable="false"
    >
      {scenario.edges.map(({ from, to }) => {
        const start = byId.get(from);
        const target = byId.get(to);
        if (!start || !target) return null;
        const key = edgeKey(from, to);
        const { d, end } = edgeGeometry(layout, start, target);
        return (
          <g
            key={key}
            data-edge={key}
            data-state={done.has(key) ? "done" : "idle"}
          >
            <path className="ls-edge" d={d} />
            <path className="ls-packet-glow" d={d} pathLength={100} />
            <path className="ls-packet" d={d} pathLength={100} />
            {key === parkedOn && (
              <g className="ls-parked">
                <circle cx={end.x} cy={end.y} r={7} />
                <circle cx={end.x} cy={end.y} r={3} />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function NodeGlyph({ node }: { node: GraphNode }) {
  if (node.models) {
    return (
      <span className="ls-models">
        {AI_MODEL_LOGOS.map((logo) => (
          <ToolLogo key={logo} logo={logo} size={9} />
        ))}
      </span>
    );
  }
  if (node.tool) return <ToolLogo logo={node.tool} size={14} />;
  const Icon = ICONS[node.icon];
  return <Icon strokeWidth={1.5} />;
}

function RunStatus({ active, done }: { active: string; done: string }) {
  return (
    <span className="ls-run">
      <span className="ls-run-stack">
        <span data-for="active">{active}</span>
        <span data-for="done">{done}</span>
      </span>
    </span>
  );
}

export function AgentGraph({
  scenario,
  state,
  title,
  labels,
  metas,
  run,
}: {
  scenario: Scenario;
  state: ScenarioFinalState;
  title: string;
  labels: Record<string, string>;
  metas: Record<string, string>;
  run: { active: string; done: string };
}) {
  const terminal = terminalNode(scenario);
  const parkedOn = lastEdge(scenario);
  return (
    <div className="ls-window ls-graph">
      <div className="ls-chrome">
        <span>{title}</span>
        <RunStatus {...run} />
      </div>
      <div className="ls-graph-box">
        <Edges
          scenario={scenario}
          layout={DESKTOP}
          done={state.doneEdges}
          parkedOn={parkedOn}
          className="ls-edges-d"
        />
        <Edges
          scenario={scenario}
          layout={MOBILE}
          done={state.doneEdges}
          parkedOn={parkedOn}
          className="ls-edges-m"
        />
        <ul className="ls-nodes">
          {scenario.nodes.map((node) => {
            const position = {
              "--x": `${node.x}%`,
              "--y": `${node.y}%`,
              "--mx": `${node.mx}%`,
              "--my": `${node.my}%`,
            } as CSSProperties;
            return (
              <li
                key={node.id}
                className="ls-node"
                data-node={node.id}
                data-state={state.doneNodes.has(node.id) ? "done" : "idle"}
                data-agent={node.agent || undefined}
                data-terminal={node.id === terminal || undefined}
                data-tool={node.tool}
                data-models={node.models}
                style={position}
              >
                <span className="ls-node-icon" aria-hidden="true">
                  <NodeGlyph node={node} />
                </span>
                <span className="ls-node-text">
                  <span className="ls-node-label">{labels[node.id]}</span>
                  <span className="ls-node-meta">{metas[node.id]}</span>
                </span>
                <span className="ls-dot" aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
