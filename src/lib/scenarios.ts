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

export type TraceLine = { t: string; key: string; tone?: "ok" | "err" | "dim" };

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
    nodes: NodeSpec[];
    edges: [string, string][];
    trace: TraceSpec[];
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
    })),
    steps: config.steps,
    chipKey: `${base}.chip`,
    illustration: config.illustration ?? true,
  };
}

export const edgeKey = (from: string, to: string) => `${from}>${to}`;

export const scenarios: Record<ScenarioId, Scenario> = {
  agents: scenario("agents", {
    href: "/services/agents-ia",
    nodes: [
      ["inbox", "inbox", 12, 28, 26, 8],
      ["classifier", "filter", 42, 28, 26, 30],
      ["crm", "database", 72, 28, 26, 52],
      ["slack", "message", 72, 74, 26, 74],
      ["archive", "file", 42, 74, 74, 30],
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
    nodes: [
      ["commit", "git", 12, 28, 50, 8],
      ["build", "filter", 42, 28, 50, 27],
      ["lighthouse", "gauge", 72, 28, 50, 46],
      ["deploy", "rocket", 72, 74, 50, 65],
      ["llms", "file", 42, 74, 50, 84],
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
    nodes: [
      ["ticket", "inbox", 12, 28, 50, 7],
      ["repo", "git", 42, 28, 50, 23],
      ["engineer", "user-check", 72, 28, 50, 38],
      ["pr", "git", 72, 74, 50, 54],
      ["review", "search", 42, 74, 50, 69],
      ["deploy", "rocket", 12, 74, 50, 85],
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
    href: "/services/agents-ia",
    nodes: [
      ["interviews", "message", 12, 28, 50, 8],
      ["mapping", "search", 42, 28, 50, 30],
      ["scoring", "gauge", 72, 28, 50, 52],
      ["roadmap", "file", 72, 74, 50, 74],
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
    href: "/services/agents-ia",
    nodes: [
      ["email", "inbox", 12, 28, 50, 8],
      ["extract", "filter", 42, 28, 50, 27],
      ["erp", "database", 72, 28, 50, 46],
      ["validation", "user-check", 72, 74, 50, 65],
      ["send", "message", 42, 74, 50, 84],
    ],
    edges: [
      ["email", "extract"],
      ["extract", "erp"],
      ["erp", "validation"],
      ["validation", "send"],
    ],
    trace: [
      ["00.0", "email"],
      ["00.9", "extract"],
      ["01.2", "vat", "err"],
      ["01.6", "recompute", "ok"],
      ["02.1", "draft"],
      ["02.2", "waiting", "dim"],
      ["14:05", "approved", "ok"],
      ["14:05", "sent", "ok"],
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
    href: "/services/creation-site-web",
    nodes: [
      ["prompts", "message", 12, 46, 26, 8],
      ["chatgpt", "search", 38, 16, 74, 26],
      ["perplexity", "search", 38, 46, 74, 44],
      ["gemini", "search", 38, 76, 74, 62],
      ["citation", "filter", 62, 28, 26, 66],
      ["report", "file", 84, 28, 26, 85],
    ],
    edges: [
      ["prompts", "chatgpt"],
      ["prompts", "perplexity"],
      ["prompts", "gemini"],
      ["chatgpt", "citation"],
      ["perplexity", "citation"],
      ["gemini", "citation"],
      ["citation", "report"],
    ],
    trace: [
      ["00:00", "prompts"],
      ["00:14", "chatgpt"],
      ["00:21", "perplexity"],
      ["00:30", "geminiRetry", "err"],
      ["00:41", "gemini", "ok"],
      ["00:42", "citations", "dim"],
      ["00:44", "sources"],
      ["00:45", "report", "ok"],
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
      { at: 6200, edge: ["chatgpt", "citation"] },
      { at: 6200, edge: ["perplexity", "citation"] },
      { at: 6200, edge: ["gemini", "citation"] },
      { at: 7400, node: "citation", line: 5 },
      { at: 8000, line: 6 },
      { at: 8400, edge: ["citation", "report"] },
      { at: 9600, node: "report", line: 7, chip: true },
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
