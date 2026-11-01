import type { AppPathname } from "@/lib/seo";

export type ScenarioId =
  "agents" | "sites" | "fde" | "audit" | "automation" | "geo";

export type NodeIcon =
  | "inbox"
  | "filter"
  | "database"
  | "message"
  | "git"
  | "gauge"
  | "rocket"
  | "file"
  | "user-check"
  | "search";

export type GraphNode = {
  id: string;
  labelKey: string;
  metaKey: string;
  agent: boolean;
  icon: NodeIcon;
  x: number;
  y: number;
  mx: number;
  my: number;
};

export type GraphEdge = { from: string; to: string };

export type ScenarioStep = {
  at: number;
  node?: string;
  edge?: [string, string];
  line?: number;
  chip?: true;
};

export type TraceLine = {
  t: string;
  key: string;
  tone?: "ok" | "err" | "dim";
  mobile: boolean;
};

export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;

export type Scenario = {
  id: ScenarioId;
  href: StaticPathname;
  titleKey: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  trace: TraceLine[];
  steps: ScenarioStep[];
  chipKey: string;
  illustration: boolean;
};

type NodeSpec = [
  id: string,
  icon: NodeIcon,
  x: number,
  y: number,
  mx: number,
  my: number,
];
type TraceSpec = [t: string, key: string, tone?: TraceLine["tone"]];

function scenario(
  id: ScenarioId,
  config: {
    href: StaticPathname;
    agent: string;
    nodes: NodeSpec[];
    edges: [string, string][];
    trace: TraceSpec[];
    desktopOnly: string[];
    steps: ScenarioStep[];
    illustration?: boolean;
  },
): Scenario {
  const base = `liveSystem.scenarios.${id}`;
  return {
    id,
    href: config.href,
    titleKey: `${base}.title`,
    nodes: config.nodes.map(([nodeId, icon, x, y, mx, my]) => ({
      id: nodeId,
      labelKey: `${base}.nodes.${nodeId}`,
      metaKey: `${base}.meta.${nodeId}`,
      agent: nodeId === config.agent,
      icon,
      x,
      y,
      mx,
      my,
    })),
    edges: config.edges.map(([from, to]) => ({ from, to })),
    trace: config.trace.map(([t, key, tone]) => ({
      t,
      key: `${base}.trace.${key}`,
      ...(tone && { tone }),
      mobile: !config.desktopOnly.includes(key),
    })),
    steps: config.steps,
    chipKey: `${base}.chip`,
    illustration: config.illustration ?? true,
  };
}

export const edgeKey = (from: string, to: string) => `${from}>${to}`;

export function terminalNode(scenario: Scenario): string | undefined {
  return scenario.steps.findLast((step) => step.node)?.node;
}

export function lastEdge(scenario: Scenario): string | undefined {
  const edge = scenario.steps.findLast((step) => step.edge)?.edge;
  return edge && edgeKey(...edge);
}

export const scenarios: Record<ScenarioId, Scenario> = {
  agents: scenario("agents", {
    href: "/services/agents-ia",
    agent: "classifier",
    desktopOnly: ["think", "update"],
    nodes: [
      ["inbox", "inbox", 12.5, 28, 28, 8],
      ["classifier", "filter", 38, 28, 28, 30],
      ["crm", "database", 62, 72, 28, 52],
      ["slack", "message", 87, 28, 28, 74],
      ["archive", "file", 38, 72, 77, 30],
    ],
    edges: [
      ["inbox", "classifier"],
      ["classifier", "crm"],
      ["crm", "slack"],
      ["classifier", "archive"],
    ],
    trace: [
      ["00.00", "watch"],
      ["00.12", "think", "dim"],
      ["00.41", "classify"],
      ["00.66", "score"],
      ["00.70", "update"],
      ["00.94", "retry", "err"],
      ["01.38", "updated", "ok"],
      ["01.52", "post"],
      ["01.80", "done", "ok"],
    ],
    steps: [
      { at: 0, node: "inbox", line: 0 },
      { at: 700, line: 1 },
      { at: 1300, edge: ["inbox", "classifier"] },
      { at: 2500, node: "classifier", line: 2 },
      { at: 3300, line: 3 },
      { at: 3800, edge: ["classifier", "crm"] },
      { at: 5000, node: "crm", line: 4 },
      { at: 5600, line: 5 },
      { at: 6500, line: 6 },
      { at: 7000, edge: ["crm", "slack"] },
      { at: 8200, node: "slack", line: 7 },
      { at: 8800, line: 8, chip: true },
    ],
  }),
  sites: scenario("sites", {
    href: "/services/creation-site-web",
    illustration: false,
    agent: "build",
    desktopOnly: ["build", "sitemap"],
    nodes: [
      ["commit", "git", 12.5, 28, 50, 8],
      ["build", "filter", 38, 28, 50, 27],
      ["lighthouse", "gauge", 38, 72, 50, 46],
      ["deploy", "rocket", 62, 72, 50, 65],
      ["llms", "file", 87, 28, 50, 84],
    ],
    edges: [
      ["commit", "build"],
      ["build", "lighthouse"],
      ["lighthouse", "deploy"],
      ["deploy", "llms"],
    ],
    trace: [
      ["00:00", "push"],
      ["00:03", "build"],
      ["00:41", "built", "ok"],
      ["00:43", "lighthouse"],
      ["01:12", "deploy"],
      ["01:19", "retry", "err"],
      ["01:27", "deployed", "ok"],
      ["01:28", "sitemap", "dim"],
      ["01:29", "llms", "ok"],
    ],
    steps: [
      { at: 0, node: "commit", line: 0 },
      { at: 600, edge: ["commit", "build"] },
      { at: 1800, node: "build", line: 1 },
      { at: 2800, line: 2 },
      { at: 3300, edge: ["build", "lighthouse"] },
      { at: 4500, node: "lighthouse", line: 3 },
      { at: 5300, edge: ["lighthouse", "deploy"] },
      { at: 6500, node: "deploy", line: 4 },
      { at: 7100, line: 5 },
      { at: 7900, line: 6 },
      { at: 8300, edge: ["deploy", "llms"] },
      { at: 9500, node: "llms", line: 7 },
      { at: 9900, line: 8, chip: true },
    ],
  }),
  fde: scenario("fde", {
    href: "/forward-deployed-engineer",
    agent: "engineer",
    desktopOnly: ["read", "branch"],
    nodes: [
      ["ticket", "inbox", 12.5, 72, 50, 7],
      ["repo", "git", 12.5, 28, 50, 23],
      ["engineer", "user-check", 38, 28, 50, 38],
      ["pr", "git", 38, 72, 50, 54],
      ["review", "search", 62, 72, 50, 69],
      ["deploy", "rocket", 87, 28, 50, 85],
    ],
    edges: [
      ["ticket", "repo"],
      ["repo", "engineer"],
      ["engineer", "pr"],
      ["pr", "review"],
      ["review", "deploy"],
    ],
    trace: [
      ["09:02", "ticket"],
      ["09:04", "branch"],
      ["09:05", "read", "dim"],
      ["10:31", "testFail", "err"],
      ["10:58", "fix"],
      ["11:06", "testPass", "ok"],
      ["11:09", "pr"],
      ["14:22", "review"],
      ["14:40", "merged", "ok"],
    ],
    steps: [
      { at: 0, node: "ticket", line: 0 },
      { at: 600, edge: ["ticket", "repo"] },
      { at: 1800, node: "repo", line: 1 },
      { at: 2300, edge: ["repo", "engineer"] },
      { at: 3500, node: "engineer", line: 2 },
      { at: 4200, line: 3 },
      { at: 5000, line: 4 },
      { at: 5700, line: 5 },
      { at: 6100, edge: ["engineer", "pr"] },
      { at: 7300, node: "pr", line: 6 },
      { at: 7800, edge: ["pr", "review"] },
      { at: 9000, node: "review", line: 7 },
      { at: 9500, edge: ["review", "deploy"] },
      { at: 10700, node: "deploy", line: 8, chip: true },
    ],
  }),
  audit: scenario("audit", {
    href: "/services/audit-ia",
    agent: "scoring",
    desktopOnly: ["scoring"],
    nodes: [
      ["interviews", "message", 12.5, 28, 50, 8],
      ["mapping", "search", 30, 72, 50, 30],
      ["scoring", "gauge", 60, 72, 50, 52],
      ["roadmap", "file", 87, 28, 50, 74],
    ],
    edges: [
      ["interviews", "mapping"],
      ["mapping", "scoring"],
      ["scoring", "roadmap"],
    ],
    trace: [
      ["J1", "interviews"],
      ["J2", "mapping"],
      ["J3", "quotes"],
      ["J3", "invoices"],
      ["J4", "missing", "err"],
      ["J5", "emails"],
      ["J6", "scoring", "dim"],
      ["J7", "roadmap", "ok"],
    ],
    steps: [
      { at: 0, node: "interviews", line: 0 },
      { at: 600, edge: ["interviews", "mapping"] },
      { at: 1800, node: "mapping", line: 1 },
      { at: 2600, line: 2 },
      { at: 3300, line: 3 },
      { at: 4000, line: 4 },
      { at: 4800, line: 5 },
      { at: 5200, edge: ["mapping", "scoring"] },
      { at: 6400, node: "scoring", line: 6 },
      { at: 6900, edge: ["scoring", "roadmap"] },
      { at: 8100, node: "roadmap", line: 7, chip: true },
    ],
  }),
  automation: scenario("automation", {
    href: "/services/automatisation-ia",
    agent: "extract",
    desktopOnly: ["waiting"],
    nodes: [
      ["email", "inbox", 12.5, 28, 50, 8],
      ["extract", "filter", 38, 28, 50, 27],
      ["erp", "database", 38, 72, 50, 46],
      ["validation", "user-check", 62, 72, 50, 65],
      ["send", "message", 87, 28, 50, 84],
    ],
    edges: [
      ["email", "extract"],
      ["extract", "erp"],
      ["erp", "validation"],
      ["validation", "send"],
    ],
    trace: [
      ["00:00", "email"],
      ["00:01", "extract"],
      ["00:01", "vat", "err"],
      ["00:02", "recompute", "ok"],
      ["00:02", "draft"],
      ["00:02", "waiting", "dim"],
      ["12:05", "approved", "ok"],
      ["12:06", "sent", "ok"],
    ],
    steps: [
      { at: 0, node: "email", line: 0 },
      { at: 600, edge: ["email", "extract"] },
      { at: 1800, node: "extract", line: 1 },
      { at: 2600, line: 2 },
      { at: 3400, line: 3 },
      { at: 3800, edge: ["extract", "erp"] },
      { at: 5000, node: "erp", line: 4 },
      { at: 5500, edge: ["erp", "validation"] },
      { at: 6700, node: "validation", line: 5 },
      { at: 7900, line: 6 },
      { at: 8300, edge: ["validation", "send"] },
      { at: 9500, node: "send", line: 7, chip: true },
    ],
  }),
  geo: scenario("geo", {
    href: "/services/geo-referencement-ia",
    agent: "citation",
    desktopOnly: ["citations", "sources"],
    nodes: [
      ["prompts", "message", 12.5, 50, 26, 8],
      ["chatgpt", "search", 37, 12, 74, 22],
      ["perplexity", "search", 37, 37, 74, 38],
      ["gemini", "search", 37, 63, 74, 54],
      ["aio", "search", 37, 88, 74, 70],
      ["citation", "filter", 63, 50, 26, 62],
      ["report", "file", 87, 28, 26, 86],
    ],
    edges: [
      ["prompts", "chatgpt"],
      ["prompts", "perplexity"],
      ["prompts", "gemini"],
      ["prompts", "aio"],
      ["chatgpt", "citation"],
      ["perplexity", "citation"],
      ["gemini", "citation"],
      ["aio", "citation"],
      ["citation", "report"],
    ],
    trace: [
      ["00:00", "prompts"],
      ["00:14", "chatgpt"],
      ["00:21", "perplexity"],
      ["00:30", "geminiRetry", "err"],
      ["00:41", "gemini", "ok"],
      ["00:48", "aio"],
      ["00:49", "citations", "dim"],
      ["00:51", "sources"],
      ["00:52", "report", "ok"],
    ],
    steps: [
      { at: 0, node: "prompts", line: 0 },
      { at: 600, edge: ["prompts", "chatgpt"] },
      { at: 1800, node: "chatgpt", line: 1 },
      { at: 2200, edge: ["prompts", "perplexity"] },
      { at: 3400, node: "perplexity", line: 2 },
      { at: 3800, edge: ["prompts", "gemini"] },
      { at: 5000, node: "gemini", line: 3 },
      { at: 5800, line: 4 },
      { at: 6000, edge: ["prompts", "aio"] },
      { at: 7200, node: "aio", line: 5 },
      { at: 7600, edge: ["chatgpt", "citation"] },
      { at: 7600, edge: ["perplexity", "citation"] },
      { at: 7600, edge: ["gemini", "citation"] },
      { at: 7600, edge: ["aio", "citation"] },
      { at: 8800, node: "citation", line: 6 },
      { at: 9400, line: 7 },
      { at: 9800, edge: ["citation", "report"] },
      { at: 11000, node: "report", line: 8, chip: true },
    ],
  }),
};

export type ScenarioFinalState = {
  doneNodes: Set<string>;
  doneEdges: Set<string>;
};

export function finalState(scenario: Scenario): ScenarioFinalState {
  const doneNodes = new Set<string>();
  const doneEdges = new Set<string>();
  for (const step of scenario.steps) {
    if (step.node) doneNodes.add(step.node);
    if (step.edge) doneEdges.add(edgeKey(...step.edge));
  }
  return { doneNodes, doneEdges };
}
