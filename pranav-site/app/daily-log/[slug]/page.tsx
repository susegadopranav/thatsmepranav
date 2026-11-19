import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fmt } from "@/lib/types";
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sb = await createClient();
  const { data: p } = await sb.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (!p) notFound();
  return (
    <article className="mx-auto max-w-[720px] px-6 py-24">
      <p className="text-[var(--gold)] italic">{p.category} · {p.published_at && fmt(p.published_at)}</p>
      <h1 className="font-serif text-5xl font-light">{p.title}</h1>
      {p.subtitle && <p className="mt-3 text-xl text-[var(--mute)]">{p.subtitle}</p>}
      {p.cover_image && <img src={p.cover_image} alt="" className="my-10 w-full" />}
      {/* Plain text rendered as paragraphs: no raw HTML, so no injection risk */}
      {(p.content ?? "").split(/\n{2,}/).map((t: string, i: number) => <p key={i} className="my-6 max-w-[65ch] text-lg leading-9">{t}</p>)}
      <div className="mt-10 grid gap-4">{(p.images ?? []).map((im: { url: string; caption?: string }) => <figure key={im.url}><img src={im.url} alt={im.caption ?? ""} loading="lazy" className="w-full" />{im.caption && <figcaption className="pt-1 text-sm text-[var(--mute)]">{im.caption}</figcaption>}</figure>)}</div>
    </article>);
}
