import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GraphWorkspace } from "@/components/graph/graph-workspace";
import { getDiscipline, getProblem, problems } from "@/data/atlas";

export function generateStaticParams() { return problems.map(({ slug }) => ({ slug })); }

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const problem = getProblem(slug); if (!problem) notFound();
  const discipline = getDiscipline(problem.discipline)!;
  return <main className="problem-page"><nav className="problem-crumbs"><Link href="/">НА</Link><ChevronRight /><Link href="/atlas">Атлас</Link><ChevronRight /><Link href={`/directions/${discipline.slug}`}>{discipline.name}</Link><ChevronRight /><span>{problem.title}</span><i>Демо-режим</i></nav><GraphWorkspace problem={problem} /></main>;
}
