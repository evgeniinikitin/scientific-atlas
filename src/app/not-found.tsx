import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span>404 / координаты не найдены</span><h1>Эта область<br />ещё не нанесена<br />на карту.</h1><Link href="/atlas">Вернуться в атлас →</Link></main>;
}
