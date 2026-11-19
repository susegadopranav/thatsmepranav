import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Lightbox from "@/components/site/Lightbox";
export const revalidate = 60;
const CATS = ["Mishka", "Music", "Mixology", "Golf", "Travel", "Food", "Everyday"];
export default async function Gallery({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  let q = (await createClient()).from("gallery").select("id,image_url,title,description").eq("is_public", true).order("sort_order").order("created_at", { ascending: false });
  if (c && CATS.includes(c)) q = q.eq("category", c);
  const { data, error } = await q;
  return (<main className="mx-auto max-w-[1180px] px-6 py-24"><h1 className="font-serif text-5xl font-light md:text-7xl">Gallery</h1>
    <nav aria-label="Gallery categories" className="my-8 flex flex-wrap gap-2">{[undefined, ...CATS].map((k) => (
      <Link key={k ?? "all"} href={k ? `/gallery?c=${k}` : "/gallery"} className={`border px-4 py-1 text-sm ${k === c || (!k && !c) ? "bg-[var(--forest)] text-[var(--on)]" : "border-[var(--line)]"}`}>{k ?? "All"}</Link>))}</nav>
    {error && <p role="alert">Photos could not be loaded.</p>}{!error && !data?.length && <p className="text-[var(--mute)]">No photos here yet.</p>}
    {data && <Lightbox photos={data} />}</main>);
}
