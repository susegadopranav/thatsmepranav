"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function Overview() {
  const [n, setN] = useState<Record<string, number | null>>({});
  useEffect(() => { const sb = createClient(); const c = (t: string, st?: string) => { let q = sb.from(t).select("id", { count: "exact", head: true }); if (st) q = q.eq("status", st); return q.then((r) => r.count); };
    Promise.all([c("blog_posts"), c("blog_posts", "published"), c("blog_posts", "draft"), c("gallery"), c("calendar_events")]).then(([a, b, d, g, e]) => setN({ Posts: a, Published: b, Drafts: d, Photos: g, Events: e })); }, []);
  return (<section><h2 className="font-serif text-3xl">Overview</h2><div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-5">{["Posts", "Published", "Drafts", "Photos", "Events"].map((k) => <div key={k} className="border-t border-[var(--forest)] pt-2"><p className="font-serif text-5xl font-light">{n[k] ?? "–"}</p><p className="text-sm text-[var(--mute)]">{k}</p></div>)}</div></section>);
}
