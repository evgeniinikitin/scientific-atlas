export type DisciplineSlug = "mathematics" | "biology" | "chemistry";

export type NodeType =
  | "problem"
  | "subproblem"
  | "hypothesis"
  | "result"
  | "method"
  | "evidence"
  | "experiment"
  | "question"
  | "barrier"
  | "direction";

export type NodeStatus = "solved" | "partial" | "open" | "debated" | "verification";
export type RelationType = "depends" | "part" | "supports" | "contradicts" | "refines" | "uses" | "alternative" | "blocks";

export interface Paper {
  id: string;
  title: string;
  authors: string;
  year: number;
  source: string;
  summary: string;
  url?: string;
  relation: "подтверждает" | "опровергает" | "развивает" | "предлагает метод" | "даёт обзор";
  demo?: boolean;
}

export interface AtlasNode {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  role: string;
  type: NodeType;
  status: NodeStatus;
  evidenceLevel: number;
  x: number;
  y: number;
  updatedAt: string;
  papers?: Paper[];
}

export interface AtlasEdge {
  id: string;
  source: string;
  target: string;
  relation: RelationType;
  label?: string;
}

export interface ScientificProblem {
  slug: string;
  discipline: DisciplineSlug;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  progress: number;
  popularity: number;
  activity: number;
  openShare: number;
  tags: string[];
  composition: string;
  nodes: AtlasNode[];
  edges: AtlasEdge[];
}

export interface Discipline {
  slug: DisciplineSlug;
  name: string;
  latin: string;
  index: string;
  description: string;
  tags: string[];
  publications: number;
}

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  problem: "Главная проблема",
  subproblem: "Подпроблема",
  hypothesis: "Гипотеза",
  result: "Известный результат",
  method: "Метод",
  evidence: "Набор доказательств",
  experiment: "Вычислительный эксперимент",
  question: "Открытый вопрос",
  barrier: "Исследовательский барьер",
  direction: "Направление работы",
};

export const NODE_STATUS_LABELS: Record<NodeStatus, string> = {
  solved: "Решено",
  partial: "Частично решено",
  open: "Открыто",
  debated: "Спорно",
  verification: "Требует проверки",
};

export const RELATION_LABELS: Record<RelationType, string> = {
  depends: "зависит от",
  part: "является частью",
  supports: "подтверждает",
  contradicts: "противоречит",
  refines: "уточняет",
  uses: "использует метод",
  alternative: "является альтернативой",
  blocks: "блокирует решение",
};
