import { createClient } from "@/lib/supabase/server";
import type { EventRow } from "@/lib/types";
export const revalidate = 60;
export const metadata = { title: "Calendar · Pranav Ayachit" };
const TZ = "Asia/Kolkata";
const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
const time = (s: string) => new Date(s).toLocaleTimeString("en-IN", { timeZone: TZ, hour: "numeric", minute: "2-digit" });
const label = (d: Date) => d.toLocaleDateString("en-IN", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
function Item({ e }: { e: EventRow }) {
  return (<li className="py-2"><span className="text-sm text-[var(--gold)]">{time(e.starts_at)}</span> <span className="font-serif text-xl">{e.title}</span>
    {e.notes && <p className="text-[var(--mute)]">{e.notes}</p>}</li>);
}
export default async function CalendarPage() {
  const { data, error } = await (await createClient()).from("calendar_events").select("*").order("starts_at");
  const events = (data ?? []) as EventRow[];
  const now = Date.now();
  const days = Array.from({ length: 7 }, (_, i) => new Date(now + i * 864e5));
  const keys = days.map(dayKey), today = keys[0], last = keys[6];
  const on = (k: string) => events.filter((e) => dayKey(new Date(e.starts_at)) === k);
  const later = events.filter((e) => dayKey(new Date(e.starts_at)) > last);
  const past = events.filter((e) => dayKey(new Date(e.starts_at)) < today).reverse();
  return (
    <main className="mx-auto max-w-[720px] px-6 py-24">
      <h1 className="font-serif text-5xl font-light md:text-6xl">My week ahead</h1>
      <p className="mt-3 text-[var(--mute)]">What’s on over the next seven days. Times are India time.</p>
      {error && <p role="alert" className="mt-8">The schedule could not be loaded. Please refresh.</p>}
      {!error && (<div className="mt-10">{days.map((d, i) => (
        <section key={keys[i]} className="grid gap-x-8 border-t border-[var(--line)] py-4 sm:grid-cols-[170px_1fr]">
          <h2 className="font-sans text-base font-medium">{i === 0 ? "Today" : label(d)}{i === 0 && <span className="block text-sm font-normal text-[var(--mute)]">{label(d)}</span>}</h2>
          {on(keys[i]).length ? <ul>{on(keys[i]).map((e) => <Item key={e.id} e={e} />)}</ul> : <p className="py-2 text-[var(--mute)]">Nothing scheduled</p>}
        </section>))}</div>)}
      {later.length > 0 && (<section className="mt-12"><h2 className="font-serif text-3xl">Later</h2><ul className="mt-4">{later.map((e) => (
        <li key={e.id} className="border-t border-[var(--line)] py-3"><p className="text-sm text-[var(--gold)]">{new Date(e.starts_at).toLocaleDateString("en-IN", { timeZone: TZ, dateStyle: "full" })}, {time(e.starts_at)}</p><p className="font-serif text-xl">{e.title}</p></li>))}</ul></section>)}
      {past.length > 0 && (<details className="mt-12"><summary className="cursor-pointer text-[var(--mute)]">Past events ({past.length})</summary>
        <ul className="mt-4 text-[var(--mute)]">{past.map((e) => <li key={e.id} className="py-1">{new Date(e.starts_at).toLocaleDateString("en-IN", { timeZone: TZ, dateStyle: "medium" })} · {e.title}</li>)}</ul></details>)}
    </main>);
}
