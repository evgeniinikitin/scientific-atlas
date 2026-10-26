"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useUserStore } from "@/domains/user/store";

const links = [
  ["/atlas", "Атлас"],
  ["/publications", "Публикации"],
  ["/profile", "Кабинет"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const demoSession = useUserStore((state) => state.demoSession);

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Научный атлас — главная">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span className="brand-name">НАУЧНЫЙ<br />АТЛАС</span>
      </Link>
      <nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Основная навигация">
        {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link href={demoSession ? "/profile" : "/login"} className="nav-account">{demoSession ? "Алексей М." : "Войти"}</Link>
      </nav>
      <div className="header-actions">
        <span className="demo-badge"><i /> Система онлайн</span>
        <ThemeToggle />
        <Link className="header-atlas-link" href="/atlas">Открыть карту <ArrowUpRight size={15} /></Link>
        <Button variant="ghost" className="menu-button" aria-label="Меню" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
    </header>
  );
}
