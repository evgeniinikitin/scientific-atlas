"use client";

import Link from "next/link";
import { ArrowUpRight, PenLine, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/domains/auth/use-auth-status";

type PublicationType = "Гипотеза" | "Исследовательская заметка" | "Предложение метода" | "Критика" | "Обзор" | "Описание эксперимента";
interface Publication { id: string; type: PublicationType; title: string; text: string; author: string; date: string; reviews: number; }
const initial: Publication[] = [
  { id: "pub-1", type: "Исследовательская заметка", title: "Как сравнивать доказательность узлов разных научных областей", text: "Предлагается отделить воспроизводимость наблюдения от зрелости объясняющей модели и показывать их как независимые оси.", author: "Ирина Левина", date: "21 июля 2026", reviews: 3 },
  { id: "pub-2", type: "Предложение метода", title: "Версионирование карт после выхода систематического обзора", text: "Черновой протокол пересмотра связей: заморозка версии, открытая дифференциальная рецензия и публикация новой редакции.", author: "Михаил Серов", date: "19 июля 2026", reviews: 1 },
  { id: "pub-3", type: "Критика", title: "Статус «частично решено» требует предметной калибровки", text: "Одинаковая метка в математике и экспериментальной биологии скрывает разные эпистемические основания.", author: "Анна Руднева", date: "17 июля 2026", reviews: 5 },
];

export function PublicationWall() {
  const { authenticated, loading } = useAuthStatus(); const [items, setItems] = useState(initial); const [formOpen, setFormOpen] = useState(false); const [type, setType] = useState<PublicationType>("Исследовательская заметка"); const [title, setTitle] = useState(""); const [text, setText] = useState("");
  const publish = (event: React.FormEvent) => { event.preventDefault(); if (title.trim().length < 8 || text.trim().length < 30) { toast.error("Добавьте содержательное название и описание не короче 30 символов"); return; } setItems([{ id: crypto.randomUUID(), type, title, text, author: "Алексей Морозов", date: "только что", reviews: 0 }, ...items]); setTitle(""); setText(""); setFormOpen(false); toast.success("Демонстрационная публикация создана"); };
  return <div className="wall-content">
    <div className="wall-actions">{!loading && authenticated ? <Button onClick={() => setFormOpen(true)}><Plus size={15} /> Новая публикация</Button> : <div className="wall-gate"><span>Чтобы создать публикацию, войдите в аккаунт.</span><Link href="/login">Войти →</Link></div>}</div>
    {formOpen && <form className="publication-form" onSubmit={publish}><header><span>Новая демонстрационная публикация</span><button type="button" onClick={() => setFormOpen(false)}><X /></button></header><label>Тип<select value={type} onChange={(event) => setType(event.target.value as PublicationType)}>{["Гипотеза","Исследовательская заметка","Предложение метода","Критика","Обзор","Описание эксперимента"].map((value) => <option key={value}>{value}</option>)}</select></label><label>Название<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Сформулируйте основной тезис" /></label><label>Описание<textarea rows={5} value={text} onChange={(event) => setText(event.target.value)} placeholder="Опишите аргумент, метод или наблюдение" /></label><p>После подключения backend публикации будут проходить экспертное рецензирование и версионирование.</p><Button type="submit"><PenLine size={15} /> Опубликовать</Button></form>}
    <div className="publication-list">{items.map((item, index) => <article key={item.id}><span className="pub-index">{String(index + 1).padStart(2,"0")}</span><div><span className="pub-type">{item.type}</span><h2>{item.title}</h2><p>{item.text}</p><footer><b>{item.author}</b><span>{item.date}</span><span>{item.reviews} экспертных откликов</span></footer></div><ArrowUpRight /></article>)}</div>
  </div>;
}
