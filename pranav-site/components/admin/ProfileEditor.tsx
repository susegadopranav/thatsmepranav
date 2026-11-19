"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FIELDS } from "@/lib/fields";
export default function ProfileEditor() {
  const sb = createClient(); const [v, setV] = useState<Record<string, string>>({}); const [msg, setMsg] = useState("");
  useEffect(() => { sb.from("site_content").select("key,value").then(({ data }) => setV(Object.fromEntries((data ?? []).filter((r) => typeof r.value === "string").map((r) => [r.key, r.value])))); }, []);
  async function save() { const { error } = await sb.from("site_content").upsert(FIELDS.map(([k]) => ({ key: k, value: v[k] ?? "", updated_at: new Date().toISOString() }))); setMsg(error ? error.message : "Saved. The site updates within a minute."); }
  return (<section><h2 className="font-serif text-3xl">Profile</h2>{msg && <p role="status" className="my-2 text-[var(--gold)]">{msg}</p>}
    <div className="my-4 grid gap-4">{FIELDS.map(([k, label, d]) => (<label key={k} className="grid gap-1 text-sm text-[var(--mute)]">{label}
      <textarea rows={k.includes("intro") || k === "skills" || k === "interests" ? 4 : 2} placeholder={d} value={v[k] ?? ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} className="border bg-transparent p-2 text-base text-[var(--ink)]" /></label>))}</div>
    <button onClick={save} className="bg-[var(--forest)] px-6 py-2 text-[var(--on)]">Save changes</button></section>);
}
