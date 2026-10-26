import type { AtlasNode, NodeStatus, NodeType, ScientificProblem } from "./types";

export function filterNodes(nodes: AtlasNode[], query: string, types: NodeType[], statuses: NodeStatus[]) {
  const normalized = query.trim().toLocaleLowerCase("ru");
  return nodes.filter((node) => {
    const matchesText = !normalized || `${node.title} ${node.shortDescription}`.toLocaleLowerCase("ru").includes(normalized);
    const matchesType = types.length === 0 || types.includes(node.type);
    const matchesStatus = statuses.length === 0 || statuses.includes(node.status);
    return matchesText && matchesType && matchesStatus;
  });
}

export type ProblemSort = "popular" | "activity" | "open";

export function filterProblems(problems: ScientificProblem[], query: string, sort: ProblemSort) {
  const normalized = query.trim().toLocaleLowerCase("ru");
  const filtered = problems.filter((problem) => `${problem.title} ${problem.summary} ${problem.tags.join(" ")}`.toLocaleLowerCase("ru").includes(normalized));
  return [...filtered].sort((a, b) => {
    if (sort === "activity") return b.activity - a.activity;
    if (sort === "open") return b.openShare - a.openShare;
    return b.popularity - a.popularity;
  });
}
