"use client";

import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { filterProblems, type ProblemSort } from "@/domains/atlas/filter";
import type { ScientificProblem } from "@/domains/atlas/types";

export function ProblemBrowser({ problems }: { problems: ScientificProblem[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ProblemSort>("popular");
  const filtered = useMemo(() => filterProblems(problems, query, sort), [problems, query, sort]);
  return (
    <div className="problem-browser">
      <div className="browser-toolbar">
        <label className="atlas-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по проблемам и темам" aria-label="Поиск проблем" /></label>
        <div className="sort-control"><SlidersHorizontal size={15} /><span>Сортировка</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as ProblemSort)} aria-label="Сортировка">
            <option value="popular">По популярности</option><option value="activity">По активности</option><option value="open">По доле открытых вопросов</option>
          </select>
        </div>
      </div>
      {filtered.length ? <div className="browser-results">
        {filtered.map((problem, index) => (
          <Link href={`/problems/${problem.slug}`} className="browser-problem" key={problem.slug}>
            <span className="result-no">{String(index + 1).padStart(2, "0")}</span>
            <div className="result-main"><span>{problem.kicker}</span><h2>{problem.title}</h2><p>{problem.summary}</p><div className="tag-line">{problem.tags.map((tag) => <i key={tag}>{tag}</i>)}</div></div>
            <div className="result-metrics"><span><b>{problem.nodes.length}</b> вершин</span><span><b>{problem.progress}%</b> изучено</span><span><b>{problem.openShare}%</b> открыто</span></div>
            <ArrowUpRight />
          </Link>
        ))}
      </div> : <div className="empty-results"><Search /><h3>Совпадений не найдено</h3><p>Попробуйте изменить запрос или выбрать другую сортировку.</p><button onClick={() => setQuery("")}>Сбросить поиск</button></div>}
    </div>
  );
}
