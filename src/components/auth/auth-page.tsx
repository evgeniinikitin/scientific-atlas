import { SiteHeader } from "@/components/site-header";
import { AuthForm } from "./auth-form";

const copy = {
  login: { eyebrow: "Возвращение в атлас", title: <>Вход<br />в кабинет</>, quote: "Знание растёт не как собрание фактов, а как карта связей между ними.", note: "Демо-вход хранится только в вашем браузере и не является настоящей авторизацией." },
  register: { eyebrow: "Новый исследователь", title: <>Создать<br />профиль</>, quote: "Соберите собственный маршрут через открытые вопросы современной науки.", note: "После подключения Supabase аккаунты защищены реальной сессией и Row Level Security." },
  recover: { eyebrow: "Восстановление доступа", title: <>Вернуть<br />доступ</>, quote: "Карта сохраняется. Вернитесь к своим материалам и продолжите исследование.", note: "Письмо отправляется только через подключённый проект Supabase." },
};

export function AuthPage({ mode }: { mode: keyof typeof copy }) { const item = copy[mode]; return <><SiteHeader /><main className="auth-layout"><section className="auth-panel"><span className="eyebrow">{item.eyebrow}</span><h1>{item.title}</h1><AuthForm mode={mode} /></section><aside className="auth-aside"><span className="eyebrow">НА / USER SPACE</span><blockquote>«{item.quote}»</blockquote><p className="auth-note">{item.note}</p></aside></main></>; }
