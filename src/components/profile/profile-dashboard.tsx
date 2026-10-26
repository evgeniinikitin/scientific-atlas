"use client";

import Link from "next/link";
import { Bookmark, BookOpen, Clock3, LogOut, Network, Save, Settings, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/domains/auth/use-auth-status";
import { useUserStore, type SavedItem } from "@/domains/user/store";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Tab = "saved" | "recent" | "settings";
const kindLabels: Record<SavedItem["kind"], string> = { problem: "Научная проблема", node: "Вершина графа", paper: "Публикация" };

export function ProfileDashboard() {
  const router = useRouter(); const { authenticated, demoSession, loading } = useAuthStatus();
  const [tab, setTab] = useState<Tab>("saved"); const [kind, setKind] = useState<SavedItem["kind"] | "all">("all");
  const bookmarks = useUserStore((state) => state.bookmarks); const recent = useUserStore((state) => state.recent); const profile = useUserStore((state) => state.profile); const updateProfile = useUserStore((state) => state.updateProfile); const toggleBookmark = useUserStore((state) => state.toggleBookmark); const endDemoSession = useUserStore((state) => state.endDemoSession);
  const [form, setForm] = useState(profile);
  useEffect(() => { if (!loading && !authenticated) router.replace("/login?next=/profile"); }, [authenticated, loading, router]);
  if (loading || !authenticated) return <main className="page-loading"><div className="loading-line" /><p>Проверяем сессию…</p></main>;
  const visible = kind === "all" ? bookmarks : bookmarks.filter((item) => item.kind === kind);
  const signOut = async () => { if (demoSession) endDemoSession(); else await getSupabaseBrowserClient()?.auth.signOut(); toast.success("Сессия завершена"); router.push("/"); };
  return <><SiteHeader /><main className="profile-page shell">
    <header className="profile-head"><div><span className="eyebrow">Личный кабинет</span><h1 className="display">Добрый день,<br /><em>{profile.name.split(" ")[0]}.</em></h1></div><div className="profile-identity"><div className="avatar">АМ</div><div><b>{profile.name}</b><span>{demoSession ? "Локальная демо-сессия" : "Подтверждённый аккаунт"}</span></div><Button variant="ghost" onClick={signOut}><LogOut size={15} /> Выйти</Button></div></header>
    <section className="profile-stats"><div><Network /><b>{bookmarks.filter((item) => item.kind === "problem").length}</b><span>Сохранено проблем</span></div><div><Bookmark /><b>{bookmarks.filter((item) => item.kind === "node").length}</b><span>Вершин в коллекции</span></div><div><BookOpen /><b>{bookmarks.filter((item) => item.kind === "paper").length}</b><span>Научных материалов</span></div><div><Clock3 /><b>{recent.length}</b><span>Недавних просмотров</span></div></section>
    <div className="profile-tabs">{([["saved", Bookmark, "Сохранённое"],["recent", Clock3, "Недавнее"],["settings", Settings, "Настройки"]] as const).map(([id, Icon, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><Icon size={15} />{label}</button>)}</div>
    {tab === "saved" && <section className="profile-content"><div className="saved-filter">{(["all","problem","node","paper"] as const).map((value) => <button key={value} className={kind === value ? "active" : ""} onClick={() => setKind(value)}>{value === "all" ? "Все" : kindLabels[value]} <span>{value === "all" ? bookmarks.length : bookmarks.filter((item) => item.kind === value).length}</span></button>)}</div>{visible.length ? <div className="saved-list">{visible.map((item, index) => <article key={`${item.kind}-${item.id}`}><span>{String(index + 1).padStart(2,"0")}</span><div><i>{kindLabels[item.kind]}</i><h2>{item.title}</h2><small>Сохранено {new Intl.DateTimeFormat("ru-RU").format(new Date(item.savedAt))}</small></div><Link href={item.problemSlug ? `/problems/${item.problemSlug}` : "/atlas"}>Открыть →</Link><button aria-label="Удалить из избранного" onClick={() => toggleBookmark({ id: item.id, title: item.title, kind: item.kind, problemSlug: item.problemSlug })}><X size={15} /></button></article>)}</div> : <div className="profile-empty"><Bookmark /><h2>Коллекция пока пуста</h2><p>Сохраняйте проблемы и вершины во время работы с картами.</p><Link href="/atlas">Перейти в атлас</Link></div>}</section>}
    {tab === "recent" && <section className="profile-content">{recent.length ? <div className="saved-list">{recent.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2,"0")}</span><div><i>Недавний просмотр</i><h2>{item.title}</h2><small>{new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.viewedAt))}</small></div><Link href={item.href}>Продолжить →</Link></article>)}</div> : <div className="profile-empty"><Clock3 /><h2>История пуста</h2><p>Открытые карты появятся здесь автоматически.</p></div>}</section>}
    {tab === "settings" && <section className="profile-settings"><header><UserRound /><div><h2>Профиль исследователя</h2><p>Роли эксперта, модератора и администратора предусмотрены архитектурой, но недоступны в прототипе.</p></div></header><form onSubmit={(event) => { event.preventDefault(); updateProfile(form); toast.success("Профиль обновлён"); }}><div className="form-field"><label htmlFor="profile-name">Имя</label><input id="profile-name" className="form-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div><div className="form-field"><label htmlFor="specialty">Специализация</label><input id="specialty" className="form-input" value={form.specialty} onChange={(event) => setForm({ ...form, specialty: event.target.value })} /></div><div className="form-field"><label htmlFor="interests">Научные интересы</label><textarea id="interests" className="form-input" rows={3} value={form.interests} onChange={(event) => setForm({ ...form, interests: event.target.value })} /></div><Button type="submit"><Save size={15} /> Сохранить изменения</Button></form></section>}
  </main></>;
}
