import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Научный атлас", template: "%s — Научный атлас" },
  description: "Интерактивная архитектура открытых научных проблем.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>;
}
