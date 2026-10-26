import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CircleDot,
  Network,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroGraph } from "@/components/home/hero-graph";
import { Reveal } from "@/components/home/reveal";
import { disciplines, problems } from "@/data/atlas";

const mapMarks = ["ring", "cells", "orbit", "waves", "axis", "field"];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="home-v2">
        <section className="atlas-hero">
          <div className="atlas-hero-meta">
            <span>Исследовательская платформа</span>
            <span className="hero-live"><i /> Карты обновляются</span>
            <span>Москва · 2026</span>
          </div>

          <div className="atlas-hero-title">
            <span className="hero-line hero-line-one">КАРТА</span>
            <span className="hero-line hero-line-two">ЗНАНИЯ</span>
          </div>

          <HeroGraph />

          <div className="atlas-hero-bottom">
            <p>Навигационная система по нерешённым проблемам науки — от гипотезы до доказательства.</p>
            <div className="hero-actions">
              <Link href="/atlas" className="signal-button"><span>Исследовать карты</span><ArrowUpRight /></Link>
              <a href="#manifesto" className="secondary-button">Как это работает <ArrowDown /></a>
            </div>
          </div>
        </section>

        <div className="signal-ticker" aria-hidden="true">
          <div>
            <span>06 интерактивных карт</span><i />
            <span>72 узла знания</span><i />
            <span>03 научных направления</span><i />
            <span>Одна связная система</span><i />
            <span>06 интерактивных карт</span><i />
            <span>72 узла знания</span><i />
          </div>
        </div>

        <section className="ecosystem-intro">
          <h2>САМАЯ НАГЛЯДНАЯ<br />СИСТЕМА НАУЧНЫХ СВЯЗЕЙ</h2>
          <Link href="/atlas">Исследовать экосистему <ArrowRight /></Link>
        </section>

        <section className="number-band">
          <div><span>Карты проблем</span><b>06</b></div>
          <div><span>Связанные узлы</span><b>72</b></div>
          <div><span>Научные области</span><b>03</b></div>
          <div><span>Статусы знания</span><b>05</b></div>
        </section>

        <div className="discipline-logo-strip">
          <span>Внутри атласа</span>
          {disciplines.map((discipline) => <b key={discipline.slug}>{discipline.name}</b>)}
          <span>Open research / 2026</span>
        </div>

        <section className="atlas-manifesto" id="manifesto">
          <Reveal className="manifesto-rail">
            <span className="mono-label">01 / Зачем</span>
            <CircleDot />
          </Reveal>
          <Reveal className="manifesto-statement">
            <h2>НЕ СПИСОК<br />ПУБЛИКАЦИЙ.<br /><em>ЖИВАЯ КАРТА</em><br />ЗНАНИЯ.</h2>
          </Reveal>
          <Reveal className="manifesto-side">
            <p>Мы показываем не только ответы, но и расстояние между ними: противоречия, барьеры, методы и точки, где начинается новый вопрос.</p>
            <Link href="/atlas">Как устроен атлас <ArrowRight /></Link>
          </Reveal>
        </section>

        <section className="system-section">
          <div className="system-heading shell">
            <span className="mono-label inverse">02 / Система координат</span>
            <h2>СВЯЗИ ДЕЛАЮТ<br />СЛОЖНОЕ <span>ВИДИМЫМ</span></h2>
            <p>Каждый узел имеет тип, статус и доказательную силу. Вместе они превращают тему исследования в читаемый маршрут.</p>
          </div>
          <div className="system-grid shell">
            <article className="system-card system-card-orange">
              <span>NODE / 04</span>
              <div className="node-sculpture"><i /><i /><i /><b /></div>
              <h3>Открытая проблема</h3>
              <p>Центральный вопрос, для которого ещё нет устойчивого решения.</p>
            </article>
            <article className="system-card system-card-cream">
              <span>RELATION / 12</span>
              <div className="relation-sculpture"><i /><i /><i /><i /></div>
              <h3>Доказательная связь</h3>
              <p>Показывает, что поддерживает, опровергает или ограничивает гипотезу.</p>
            </article>
            <article className="system-card system-card-purple">
              <span>STATUS / LIVE</span>
              <div className="status-sculpture"><i /><i /><i /></div>
              <h3>Состояние знания</h3>
              <p>Открыто, спорно, частично решено или подтверждено.</p>
            </article>
          </div>
        </section>

        <section className="field-section shell">
          <header className="field-heading">
            <span className="mono-label">03 / Поля исследования</span>
            <h2>ТРИ ОБЛАСТИ.<br />ОДИН ЯЗЫК.</h2>
          </header>
          <div className="field-list">
            {disciplines.map((discipline, index) => (
              <Link href={`/directions/${discipline.slug}`} className={`field-row field-${discipline.slug}`} key={discipline.slug}>
                <span className="field-index">0{index + 1}</span>
                <div className="field-symbol" aria-hidden="true"><i /><i /><i /></div>
                <div className="field-name"><small>{discipline.latin}</small><h3>{discipline.name}</h3></div>
                <p>{discipline.description}</p>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </section>

        <section className="maps-section">
          <header className="maps-heading shell">
            <span className="mono-label inverse">04 / Демонстрационные карты</span>
            <div><h2>ШЕСТЬ<br />ПРОБЛЕМ</h2><p>Шесть разных структур неизвестного — собранных в едином интерактивном атласе.</p></div>
          </header>
          <div className="map-grid shell">
            {problems.map((problem, index) => (
              <Link href={`/problems/${problem.slug}`} className={`map-card map-card-${index + 1}`} key={problem.slug}>
                <div className={`map-visual map-mark-${mapMarks[index]}`} aria-hidden="true">
                  <i /><i /><i /><i /><b />
                </div>
                <div className="map-card-meta"><span>0{index + 1}</span><span>{problem.nodes.length} узлов</span><ArrowUpRight /></div>
                <small>{problem.kicker}</small>
                <h3>{problem.title}</h3>
                <div className="map-progress"><i style={{ width: `${problem.progress}%` }} /><span>{problem.progress}% изучено</span></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="anatomy-v2 shell">
          <div className="anatomy-copy">
            <span className="mono-label">05 / Работа с картой</span>
            <h2>ОТ ОБЗОРА<br />ДО ОДНОГО<br /><em>АРГУМЕНТА</em></h2>
            <p>Сужайте поле, переходите по связям и сохраняйте собственную траекторию исследования.</p>
          </div>
          <ol className="anatomy-list">
            <li><span>01</span><SlidersHorizontal /><div><b>Фильтруйте структуру</b><p>Оставьте только вопросы, методы, гипотезы или результаты.</p></div></li>
            <li><span>02</span><Search /><div><b>Читайте контекст</b><p>Разберите роль узла и его место в общей аргументации.</p></div></li>
            <li><span>03</span><Bookmark /><div><b>Собирайте маршрут</b><p>Сохраняйте карты, публикации и отдельные вершины.</p></div></li>
            <li><span>04</span><Network /><div><b>Смотрите на связи</b><p>Находите переходы между дисциплинами и методами.</p></div></li>
          </ol>
        </section>

        <section className="home-final">
          <div className="home-final-orbit" aria-hidden="true"><i /><i /><i /><b /></div>
          <span className="mono-label">Начать исследование</span>
          <h2>ЗАЙДИТЕ<br />ВНУТРЬ<br />ВОПРОСА.</h2>
          <Link href="/atlas" className="final-button">Открыть атлас <ArrowRight /></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
