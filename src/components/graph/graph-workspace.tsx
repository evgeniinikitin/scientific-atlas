"use client";

import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, type Edge, type Node } from "@xyflow/react";
import { Bookmark, Check, ChevronDown, Expand, List, LocateFixed, Network, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AtlasFlowNode, type AtlasFlowNodeType } from "./atlas-flow-node";
import { NodeDrawer } from "./node-drawer";
import { Button } from "@/components/ui/button";
import { filterNodes } from "@/domains/atlas/filter";
import type { AtlasNode, NodeStatus, NodeType, ScientificProblem } from "@/domains/atlas/types";
import { NODE_STATUS_LABELS, NODE_TYPE_LABELS, RELATION_LABELS } from "@/domains/atlas/types";
import { useUserStore } from "@/domains/user/store";

const nodeTypes = { atlas: AtlasFlowNode };
type ViewTab = "graph" | "list" | "papers";

function WorkspaceInner({ problem }: { problem: ScientificProblem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<NodeType[]>([]);
  const [statuses, setStatuses] = useState<NodeStatus[]>([]);
  const [selected, setSelected] = useState<AtlasNode | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tab, setTab] = useState<ViewTab>("graph");
  const filtered = useMemo(() => filterNodes(problem.nodes, query, types, statuses), [problem.nodes, query, types, statuses]);
  const visibleIds = useMemo(() => new Set(filtered.map((node) => node.id)), [filtered]);
  const initialNodes = useMemo<AtlasFlowNodeType[]>(() => filtered.map((node) => ({ id: node.id, type: "atlas", position: { x: node.x, y: node.y }, data: { atlas: node } })), [filtered]);
  const initialEdges = useMemo<Edge[]>(() => problem.edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target)).map((edge) => ({ id: edge.id, source: edge.source, target: edge.target, label: edge.label ?? RELATION_LABELS[edge.relation], className: `relation-${edge.relation}`, animated: edge.relation === "supports", labelStyle: { fontSize: 9, fill: "var(--muted)" } })), [problem.edges, visibleIds]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const toggleBookmark = useUserStore((state) => state.toggleBookmark);
  const problemSaved = useUserStore((state) => state.isBookmarked(problem.slug, "problem"));
  const addRecent = useUserStore((state) => state.addRecent);
  const selectById = useCallback((id: string) => { const node = problem.nodes.find((candidate) => candidate.id === id); if (node) setSelected(node); }, [problem.nodes]);

  useEffect(() => { setNodes(initialNodes); setEdges(initialEdges); }, [initialNodes, initialEdges, setNodes, setEdges]);
  useEffect(() => { addRecent({ id: problem.slug, title: problem.title, href: `/problems/${problem.slug}` }); }, [addRecent, problem.slug, problem.title]);
  useEffect(() => {
    const linkedNode = new URLSearchParams(window.location.search).get("node");
    if (linkedNode) selectById(linkedNode);
  }, [selectById]);

  const toggleType = (type: NodeType) => setTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type]);
  const toggleStatus = (status: NodeStatus) => setStatuses((current) => current.includes(status) ? current.filter((item) => item !== status) : [...current, status]);
  const papers = problem.nodes.flatMap((node) => (node.papers ?? []).map((paper) => ({ paper, node })));

  return <div className="graph-product" ref={containerRef}>
    <header className="graph-topbar">
      <div className="graph-title"><span>{problem.kicker}</span><h1>{problem.title}</h1></div>
      <div className="graph-progress"><span>Общий прогресс</span><b>{problem.progress}%</b><div><i style={{ width: `${problem.progress}%` }} /></div></div>
      <Button variant={problemSaved ? "primary" : "outline"} className="save-problem" onClick={() => { const added = toggleBookmark({ id: problem.slug, title: problem.title, kind: "problem", problemSlug: problem.slug }); toast.success(added ? "Проблема сохранена" : "Проблема удалена из избранного"); }}>{problemSaved ? <Check size={15} /> : <Bookmark size={15} />}{problemSaved ? "Сохранено" : "Сохранить"}</Button>
    </header>
    <div className="graph-toolbar">
      <label className="node-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти вершину" aria-label="Поиск по вершинам" />{query && <button onClick={() => setQuery("")} aria-label="Очистить поиск"><X size={13} /></button>}</label>
      <div className="filter-wrap"><Button variant="ghost" onClick={() => setFiltersOpen(!filtersOpen)}>Фильтры {types.length + statuses.length > 0 && <b>{types.length + statuses.length}</b>}<ChevronDown size={13} /></Button>
        {filtersOpen && <div className="filter-panel"><div><span>Тип вершины</span>{(Object.keys(NODE_TYPE_LABELS) as NodeType[]).map((type) => <label key={type}><input type="checkbox" checked={types.includes(type)} onChange={() => toggleType(type)} /><i />{NODE_TYPE_LABELS[type]}</label>)}</div><div><span>Статус</span>{(Object.keys(NODE_STATUS_LABELS) as NodeStatus[]).map((status) => <label key={status}><input type="checkbox" checked={statuses.includes(status)} onChange={() => toggleStatus(status)} /><i className={`status-${status}`} />{NODE_STATUS_LABELS[status]}</label>)}</div>{types.length + statuses.length > 0 && <button className="reset-filters" onClick={() => { setTypes([]); setStatuses([]); }}>Сбросить всё</button>}</div>}
      </div>
      <div className="view-tabs" role="tablist">{([["graph", Network, "Граф"],["list", List, "Список"],["papers", Bookmark, "Статьи"]] as const).map(([id, Icon, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)} role="tab"><Icon size={14} />{label}</button>)}</div>
      <Button variant="icon" aria-label="Полноэкранный режим" onClick={() => containerRef.current?.requestFullscreen()}><Expand size={15} /></Button>
    </div>
    <div className={`workspace-main ${selected ? "with-drawer" : ""}`}>
      {tab === "graph" && <div className="flow-canvas" data-testid="graph-canvas">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={(_, flowNode) => selectById(flowNode.id)} fitView fitViewOptions={{ padding: .15 }} minZoom={.35} maxZoom={1.8} proOptions={{ hideAttribution: true }}>
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--line-strong)" />
          <Controls showInteractive={false}><button aria-label="Центрировать граф" title="Центрировать"><LocateFixed size={14} /></button></Controls>
          <MiniMap nodeColor={(node) => node.id === selected?.id ? "var(--accent)" : "var(--line-strong)"} maskColor="rgba(var(--paper-rgb),.78)" pannable zoomable />
        </ReactFlow>
        {filtered.length === 0 && <div className="graph-empty"><Search /><b>Вершины не найдены</b><span>Измените поисковый запрос или фильтры.</span><button onClick={() => { setQuery(""); setTypes([]); setStatuses([]); }}>Сбросить фильтры</button></div>}
        <div className="graph-legend"><span><i className="legend-open" /> Открыто</span><span><i className="legend-partial" /> Частично</span><span><i className="legend-solved" /> Решено</span><em>{filtered.length} / {problem.nodes.length} вершин</em></div>
      </div>}
      {tab === "list" && <div className="node-table"><div className="node-table-head"><span>Вершина</span><span>Тип</span><span>Статус</span><span>Доказательность</span></div>{filtered.map((node) => <button key={node.id} onClick={() => setSelected(node)}><b>{node.title}</b><span>{NODE_TYPE_LABELS[node.type]}</span><span>{NODE_STATUS_LABELS[node.status]}</span><span>{node.evidenceLevel} / 5</span></button>)}</div>}
      {tab === "papers" && <div className="paper-library"><header><span className="eyebrow">Связанные материалы</span><h2>{papers.length || "Нет"} {papers.length === 1 ? "материал" : "материалов"}</h2><p>Демонстрационные редакционные записи явно отмечены и не выдаются за реальные публикации.</p></header>{papers.length ? papers.map(({ paper, node }) => <article key={paper.id}><span>{paper.demo ? "Демонстрационный материал" : `${paper.source} · ${paper.year}`}</span><h3>{paper.title}</h3><p>{paper.summary}</p><button onClick={() => setSelected(node)}>Связанная вершина: {node.title} →</button></article>) : <div className="graph-empty"><b>Материалы пока не добавлены</b></div>}</div>}
    </div>
    <NodeDrawer node={selected} problem={problem} onClose={() => setSelected(null)} onNavigate={selectById} />
  </div>;
}

export function GraphWorkspace({ problem }: { problem: ScientificProblem }) { return <ReactFlowProvider><WorkspaceInner problem={problem} /></ReactFlowProvider>; }
