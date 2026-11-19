import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
export const metadata: Metadata = { title: "Pranav Ayachit", description: "Finance is my profession. Curiosity is my personality." };
const links = [["/", "Home"], ["/gallery", "Gallery"], ["/daily-log", "Daily Log"], ["/contact", "Contact"]];
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${fraunces.variable} ${instrument.variable}`}><body>
    <nav aria-label="Primary" className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--bg)]">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-3">
        <Link href="/" className="font-serif text-xl">Pranav Ayachit</Link>
        <ul className="flex flex-wrap gap-5 text-sm">{links.map(([h, l]) => <li key={h}><Link href={h} className="text-[var(--mute)] hover:text-[var(--ink)]">{l}</Link></li>)}</ul>
        <Link href="/calendar" aria-label="Calendar: my schedule" title="Calendar" className="text-[var(--ink)] hover:text-[var(--gold)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/></svg></Link></div></nav>
    {children}
    <footer className="border-t border-[var(--line)] py-10 text-center text-sm text-[var(--mute)]">© {new Date().getFullYear()} Pranav Ayachit · Bangalore</footer>
  </body></html>);
}
