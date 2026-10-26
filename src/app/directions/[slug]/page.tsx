import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProblemBrowser } from "@/components/atlas/problem-browser";
import { disciplines, getDiscipline, getProblemsByDiscipline } from "@/data/atlas";

export function generateStaticParams() { return disciplines.map(({ slug }) => ({ slug })); }

export default async function DirectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const discipline = getDiscipline(slug);
  if (!discipline) notFound();
  const disciplineProblems = getProblemsByDiscipline(slug);
  return <><SiteHeader /><main className="direction-page">
    <header className="direction-hero shell">
      <nav className="breadcrumbs"><Link href="/atlas">Атлас</Link><ChevronRight size={12} /><span>{discipline.name}</span></nav>
      <span className="direction-index">{discipline.index} / {discipline.latin}</span><h1 className="display">{discipline.name}</h1>
      <div className="direction-summary"><p>{discipline.description}</p><div>{discipline.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
    </header>
    <section className="direction-problems shell"><div className="list-title"><span>Карты проблем</span><b>{String(disciplineProblems.length).padStart(2,"0")}</b></div><ProblemBrowser problems={disciplineProblems} /></section>
  </main><SiteFooter /></>;
}
