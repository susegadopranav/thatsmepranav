import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, fmt } from "@/lib/types";
export const revalidate = 60;
export default async function DailyLog({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const sb = await createClient();
  let q = sb.from("blog_posts").select("id,title,slug,subtitle,category,cover_image,published_at").eq("status", "published").order("published_at", { ascending: false });
  if (c && (CATEGORIES as readonly string[]).includes(c)) q = q.eq("category", c);
  const { data: posts, error } = await q;
  const [first, ...rest] = posts ?? [];
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-24">
      <h1 className="font-serif text-5xl md:text-7xl font-light">The Daily Log</h1>
      <p className="mt-3 text-[var(--mute)]">Little moments, passing thoughts and everything worth remembering.</p>
      <nav aria-label="Categories" className="my-8 flex flex-wrap gap-2">
        {[undefined, ...CATEGORIES].map((k) => (
          <Link key={k ?? "all"} href={k ? `/daily-log?c=${encodeURIComponent(k)}` : "/daily-log"}
            className={`border px-4 py-1 text-sm ${k === c || (!k && !c) ? "bg-[var(--forest)] text-[var(--on)]" : "border-[var(--line)]"}`}>{k ?? "All"}</Link>))}
      </nav>
      {error && <p role="alert">Posts could not be loaded. Please refresh.</p>}
      {!error && !first && <p className="text-[var(--mute)]">No posts here yet.</p>}
      {first && (
        <Link href={`/daily-log/${first.slug}`} className="grid md:grid-cols-2 gap-8 mb-16 group">
          {first.cover_image && <img src={first.cover_image} alt="" className="w-full aspect-[4/5] object-cover" />}
          <div className="self-end"><p className="text-[var(--gold)] italic">Featured · {first.category}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light group-hover:underline">{first.title}</h2>
            <p className="mt-3">{first.subtitle}</p><p className="text-sm text-[var(--mute)]">{first.published_at && fmt(first.published_at)}</p></div>
        </Link>)}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {rest.map((p) => (
          <Link key={p.id} href={`/daily-log/${p.slug}`} className="block group">
            {p.cover_image && <img src={p.cover_image} alt="" loading="lazy" className="w-full aspect-[4/5] object-cover mb-3" />}
            <p className="text-sm text-[var(--mute)]">{p.category} · {p.published_at && fmt(p.published_at)}</p>
            <h3 className="font-serif text-2xl group-hover:underline">{p.title}</h3><p>{p.subtitle}</p></Link>))}
      </div>
    </main>);
}
