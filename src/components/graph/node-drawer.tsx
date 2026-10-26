"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Check, ChevronLeft, ChevronRight, Copy, ExternalLink, FileText, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AtlasNode, ScientificProblem } from "@/domains/atlas/types";
import { NODE_STATUS_LABELS, NODE_TYPE_LABELS } from "@/domains/atlas/types";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/domains/user/store";
import { formatDate } from "@/lib/utils";

export function NodeDrawer({ node, problem, onClose, onNavigate }: { node: AtlasNode | null; problem: ScientificProblem; onClose: () => void; onNavigate: (id: string) => void }) {
  const [openPaper, setOpenPaper] = useState<string | null>(null);
  const toggleBookmark = useUserStore((state) => state.toggleBookmark);
  const bookmarks = useUserStore((state) => state.bookmarks);
  const saved = useUserStore((state) => node ? state.isBookmarked(node.id, "node") : false);
  const connected = node ? problem.edges.filter((edge) => edge.source === node.id || edge.target === node.id).map((edge) => problem.nodes.find((candidate) => candidate.id === (edge.source === node.id ? edge.target : edge.source))).filter((candidate): candidate is AtlasNode => Boolean(candidate)) : [];
  const currentIndex = node ? problem.nodes.findIndex((candidate) => candidate.id === node.id) : -1;
  return <AnimatePresence>
    {node && <motion.aside className="node-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 27, stiffness: 250 }} aria-label="Карточка вершины">
      <header className="drawer-head"><span>NODE / {String(currentIndex + 1).padStart(2,"0")}</span><Button variant="ghost" aria-label="Закрыть карточку" onClick={onClose}><X size={19} /></Button></header>
      <div className="drawer-scroll">
        <div className="drawer-kicker"><span>{NODE_TYPE_LABELS[node.type]}</span><i>·</i><span className={`status-text ${node.status}`}>{NODE_STATUS_LABELS[node.status]}</span></div>
        <h2>{node.title}</h2><p className="drawer-lead">{node.shortDescription}</p>
        <div className="drawer-actions">
          <Button variant={saved ? "primary" : "outline"} onClick={() => { const added = toggleBookmark({ id: node.id, title: node.title, kind: "node", problemSlug: problem.slug }); toast.success(added ? "Вершина сохранена" : "Вершина удалена из избранного"); }}>{saved ? <Check size={15} /> : <Bookmark size={15} />}{saved ? "Сохранено" : "В избранное"}</Button>
          <Button variant="icon" aria-label="Копировать ссылку" onClick={async () => { await navigator.clipboard.writeText(`${location.origin}/problems/${problem.slug}?node=${node.id}`); toast.success("Ссылка скопирована"); }}><Copy size={15} /></Button>
        </div>
        <section className="drawer-section"><h3>Научное описание</h3><p>{node.fullDescription}</p></section>
        <section className="drawer-section role-section"><h3>Роль в проблеме</h3><p>{node.role}</p></section>
        <section className="evidence-meter"><div><h3>Уровень доказательности</h3><b>{node.evidenceLevel} / 5</b></div><div className="meter-bars">{[1,2,3,4,5].map((level) => <i key={level} className={level <= node.evidenceLevel ? "filled" : ""} />)}</div></section>
        <section className="drawer-section"><h3>Связанные вершины <span>{connected.length}</span></h3><div className="connected-list">{connected.slice(0,5).map((item) => <button key={item.id} onClick={() => onNavigate(item.id)}><span>{NODE_TYPE_LABELS[item.type]}</span><b>{item.title}</b><ChevronRight size={14} /></button>)}</div></section>
        <section className="drawer-section papers-section"><h3>Связанные материалы <span>{node.papers?.length ?? 0}</span></h3>
          {node.papers?.length ? node.papers.map((paper) => {
            const paperSaved = bookmarks.some((item) => item.id === paper.id && item.kind === "paper");
            return <article key={paper.id} className="paper-item"><div className="paper-icon"><FileText size={16} /></div><div><span>{paper.demo ? "Демо-материал" : `${paper.source} · ${paper.year}`}</span><b>{paper.title}</b><p>{paper.relation} эту вершину</p><div className="paper-buttons"><button onClick={() => setOpenPaper(openPaper === paper.id ? null : paper.id)}>Открыть материал <ExternalLink size={12} /></button><button onClick={() => { const added = toggleBookmark({ id: paper.id, title: paper.title, kind: "paper", problemSlug: problem.slug }); toast.success(added ? "Материал сохранён" : "Материал удалён из избранного"); }}>{paperSaved ? <Check size={12} /> : <Bookmark size={12} />}{paperSaved ? "Сохранено" : "Сохранить"}</button></div>{openPaper === paper.id && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="paper-details"><strong>Демонстрационная запись</strong><p>{paper.summary}</p><small>{paper.authors} · {paper.year} · {paper.source}</small></motion.div>}</div></article>;
          }) : <p className="drawer-empty">Для этой вершины материалы пока не добавлены.</p>}
        </section>
        <div className="drawer-updated"><span>Последнее обновление</span><b>{formatDate(node.updatedAt)}</b></div>
      </div>
      <footer className="drawer-nav"><Button variant="ghost" disabled={currentIndex <= 0} onClick={() => onNavigate(problem.nodes[currentIndex - 1].id)}><ChevronLeft size={15} /> Предыдущая</Button><Button variant="ghost" disabled={currentIndex >= problem.nodes.length - 1} onClick={() => onNavigate(problem.nodes[currentIndex + 1].id)}>Следующая <ChevronRight size={15} /></Button></footer>
    </motion.aside>}
  </AnimatePresence>;
}
