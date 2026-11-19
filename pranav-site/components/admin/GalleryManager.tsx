"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GALLERY_CATEGORIES, type GalleryRow } from "@/lib/types";
const OK = ["image/jpeg", "image/png", "image/webp"], MAX = 5 * 1024 * 1024;
const pathOf = (url: string) => decodeURIComponent(url.split("/photos/")[1] ?? "");
export default function GalleryManager() {
  const sb = createClient(); const [rows, setRows] = useState<GalleryRow[]>([]); const [cat, setCat] = useState<string>("Everyday"); const [msg, setMsg] = useState("");
  const load = useCallback(async () => { const { data, error } = await sb.from("gallery").select("*").order("sort_order").order("created_at"); if (error) setMsg(error.message); else setRows(data as GalleryRow[]); }, []);
  useEffect(() => { load(); }, [load]);
  async function upload(files: FileList | null) {
    let n = rows.length;
    for (const file of Array.from(files ?? [])) {
      if (!OK.includes(file.type) || file.size > MAX) { setMsg(`${file.name}: use JPG, PNG or WebP under 5 MB.`); continue; }
      const path = `gallery/${crypto.randomUUID()}.${file.type.split("/")[1]}`;
      const up = await sb.storage.from("photos").upload(path, file); if (up.error) { setMsg(up.error.message); continue; }
      const url = sb.storage.from("photos").getPublicUrl(path).data.publicUrl;
      const { error } = await sb.from("gallery").insert({ image_url: url, category: cat, sort_order: n++, is_public: false }); // hidden until you approve it
      if (error) { setMsg(error.message); await sb.storage.from("photos").remove([path]); }
    }
    setMsg("Uploaded. New photos stay hidden until you tick “Show on site”."); load();
  }
  async function patch(r: GalleryRow, v: Partial<GalleryRow>) { const { error } = await sb.from("gallery").update(v).eq("id", r.id); if (error) setMsg(error.message); load(); }
  async function move(i: number, d: number) { const a = rows[i], b = rows[i + d]; if (!b) return; await sb.from("gallery").update({ sort_order: b.sort_order }).eq("id", a.id); await sb.from("gallery").update({ sort_order: a.sort_order === b.sort_order ? a.sort_order + d : a.sort_order }).eq("id", b.id); load(); }
  async function del(r: GalleryRow) { if (!confirm("Delete this photo?")) return; await sb.storage.from("photos").remove([pathOf(r.image_url)]); const { error } = await sb.from("gallery").delete().eq("id", r.id); setMsg(error ? error.message : "Deleted."); load(); }
  const inp = "w-full border-b bg-transparent py-1";
  return (<section><h2 className="font-serif text-3xl">Gallery</h2>{msg && <p role="status" className="my-2 text-[var(--gold)]">{msg}</p>}
    <div className="my-4 flex flex-wrap items-center gap-3"><label>Upload into <select value={cat} onChange={(e) => setCat(e.target.value)} className="border bg-transparent p-1">{GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
      <input type="file" multiple accept={OK.join(",")} onChange={(e) => upload(e.target.files)} /></div>
    {rows.length === 0 && <p className="text-[var(--mute)]">No photos yet.</p>}
    <ul className="grid gap-4">{rows.map((r, i) => (<li key={r.id} className="grid gap-3 border-b pb-4 sm:grid-cols-[120px_1fr]">
      <img src={r.image_url} alt="" className="h-32 w-28 object-cover" />
      <div className="grid gap-2"><input className={inp} placeholder="Caption" defaultValue={r.title ?? ""} onBlur={(e) => e.target.value !== (r.title ?? "") && patch(r, { title: e.target.value })} />
        <input className={inp} placeholder="Description" defaultValue={r.description ?? ""} onBlur={(e) => e.target.value !== (r.description ?? "") && patch(r, { description: e.target.value })} />
        <div className="flex flex-wrap items-center gap-4 text-sm"><select value={r.category ?? ""} onChange={(e) => patch(r, { category: e.target.value })} className="border bg-transparent p-1">{GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          <label><input type="checkbox" checked={r.is_public} onChange={(e) => patch(r, { is_public: e.target.checked })} /> Show on site</label>
          <button onClick={() => move(i, -1)} aria-label="Move earlier">↑</button><button onClick={() => move(i, 1)} aria-label="Move later">↓</button><button onClick={() => del(r)}>Delete</button></div></div></li>))}</ul></section>);
}
