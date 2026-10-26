import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { disciplines, problems } from "@/data/atlas";

export const metadata: Metadata = { title: "Атлас направлений" };

export default function AtlasPage() {
  return <><SiteHeader /><main className="atlas-catalog">
    <header className="catalog-hero shell"><span className="eyebrow">Каталог / 2026</span><h1 className="display">Научные<br />направления</h1><p>Выберите область, чтобы увидеть её ключевые открытые проблемы и архитектуру текущего знания.</p><div className="catalog-count"><b>03</b><span>направления</span><b>06</b><span>демонстрационных карт</span><b>72</b><span>связанные вершины</span></div></header>
    <section className="catalog-disciplines shell">
      {disciplines.map((discipline) => {
        const disciplineProblems = problems.filter((problem) => problem.discipline === discipline.slug);
        return <Link href={`/directions/${discipline.slug}`} className={`catalog-discipline ${discipline.slug}`} key={discipline.slug}>
          <div className="catalog-meta"><span>{discipline.index} / {discipline.latin}</span><ArrowUpRight /></div>
          <div className="discipline-glyph" aria-hidden="true"><i /><i /><i /><i /></div>
          <h2>{discipline.name}</h2><p>{discipline.description}</p>
          <div className="catalog-stats"><span><b>{disciplineProblems.length}</b> проблемы</span><span><b>{disciplineProblems.length}</b> графа</span><span><b>{discipline.publications}</b> публикаций</span></div>
          <div className="tag-line">{discipline.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
        </Link>;
      })}
    </section>
    <aside className="prototype-notice shell"><span>Важно</span><p>«Научный атлас» находится на стадии прототипа. Демонстрационные карты показывают принцип работы и не являются исчерпывающей научной классификацией.</p></aside>
  </main><SiteFooter /></>;
}
