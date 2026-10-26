import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="footer-index">НА—26 / RESEARCH SYSTEM</span>
        <h2>СЛОЖНЫЕ<br />ПРОБЛЕМЫ.<br /><em>ВИДИМАЯ</em><br />СТРУКТУРА.</h2>
      </div>
      <div className="footer-links">
        <span className="footer-label">Навигация</span>
        <Link href="/atlas">Открыть атлас <ArrowUpRight /></Link>
        <Link href="/publications">Публикации <ArrowUpRight /></Link>
        <Link href="/profile">Личный кабинет <ArrowUpRight /></Link>
        <Link href="/login">Войти <ArrowUpRight /></Link>
      </div>
      <div className="footer-note">
        <span className="footer-label">О проекте</span>
        <p>Исследовательский прототип. Карты показывают принцип работы и не являются исчерпывающей научной классификацией.</p>
      </div>
      <div className="footer-bottom"><span>© 2026 Научный атлас</span><span>06 карт · 72 узла · 03 дисциплины</span><span>Москва · RU</span></div>
    </footer>
  );
}
