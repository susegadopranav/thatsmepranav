"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, slugify, type Post, type PostImage } from "@/lib/types";
const OK = ["image/jpeg", "image/png", "image/webp"], MAX = 5 * 1024 * 1024;
const blank = { title: "", subtitle: "", content: "", category: "Everyday", cover_image: "", images: [] as PostImage[] };
export default function PostManager() {
  const sb = createClient();
  const [posts, setPosts] = useState<Post[]>([]); const [f, setF] = useState(blank); const [id, setId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await sb.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) setMsg(error.message); else setPosts(data as Post[]);
  }, []);
  useEffect(() => { load(); }, [load]);
  async function upload(files: FileList | null) {
    for (const file of Array.from(files ?? [])) {
      if (!OK.includes(file.type) || file.size > MAX) { setMsg(`${file.name}: use JPG, PNG or WebP under 5 MB.`); continue; }
      const path = `posts/${crypto.randomUUID()}.${file.type.split("/")[1]}`;
      const { error } = await sb.storage.from("photos").upload(path, file);
      if (error) { setMsg(error.message); continue; }
      const url = sb.storage.from("photos").getPublicUrl(path).data.publicUrl;
      setF((s) => ({ ...s, cover_image: s.cover_image || url, images: [...s.images, { url, caption: "" }] }));
    }
  }
  async function save(status: "draft" | "published") {
    if (!f.title.trim()) return setMsg("Add a title first.");
    const row = { ...f, slug: id ? undefined : slugify(f.title) + "-" + Date.now().toString(36), status };
    const { error } = id ? await sb.from("blog_posts").update(row).eq("id", id) : await sb.from("blog_posts").insert(row);
    if (error) return setMsg(error.message);
    setMsg(status === "published" ? "Published." : "Draft saved."); setF(blank); setId(null); load();
  }
  async function del(p: Post) { if (confirm(`Delete “${p.title}”?`)) { const { error } = await sb.from("blog_posts").delete().eq("id", p.id); setMsg(error ? error.message : "Deleted."); load(); } }
  async function toggle(p: Post) { const { error } = await sb.from("blog_posts").update({ status: p.status === "published" ? "draft" : "published" }).eq("id", p.id); if (error) setMsg(error.message); load(); }
  const inp = "w-full border-b bg-transparent py-2";
  return (<section aria-labelledby="pm"><h2 id="pm" className="font-serif text-3xl">Daily Log posts</h2>
    {msg && <p role="status" className="my-3 text-[var(--gold)]">{msg}</p>}
    <div className="grid gap-3 my-6">
      <input className={inp} placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      <input className={inp} placeholder="Subtitle" value={f.subtitle ?? ""} onChange={(e) => setF({ ...f, subtitle: e.target.value })} />
      <select className={inp} value={f.category ?? ""} onChange={(e) => setF({ ...f, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
      <textarea className={inp + " min-h-48"} placeholder="Write here. Leave a blank line between paragraphs." value={f.content ?? ""} onChange={(e) => setF({ ...f, content: e.target.value })} />
      <input type="file" multiple accept={OK.join(",")} onChange={(e) => upload(e.target.files)} />
      <div className="grid gap-2">{f.images.map((im, n) => <div key={im.url} className="flex items-center gap-3"><img src={im.url} alt="" className="h-16 w-16 object-cover" /><input className={inp} placeholder="Photo caption" value={im.caption} onChange={(e) => setF({ ...f, images: f.images.map((x, k) => k === n ? { ...x, caption: e.target.value } : x) })} /><button type="button" onClick={() => setF({ ...f, images: f.images.filter((_, k) => k !== n), cover_image: f.cover_image === im.url ? "" : f.cover_image })}>Remove</button></div>)}</div>
      <div className="flex gap-3"><button onClick={() => save("draft")} className="border px-5 py-2">Save draft</button>
        <button onClick={() => save("published")} className="bg-[var(--forest)] text-[var(--on)] px-5 py-2">Publish</button>
        {id && <button onClick={() => { setF(blank); setId(null); }}>Cancel edit</button>}</div></div>
    <ul>{posts.length === 0 && <li className="text-[var(--mute)]">No posts yet.</li>}{posts.map((p) => (
      <li key={p.id} className="flex flex-wrap justify-between gap-2 border-b py-3"><span>{p.title} <em className={p.status === "published" ? "ml-2 bg-[var(--forest)] px-2 text-xs not-italic text-[var(--on)]" : "ml-2 border px-2 text-xs not-italic text-[var(--gold)]"}>{p.status === "published" ? "Published" : "Draft"}</em></span>
        <span className="flex gap-4 text-sm"><button onClick={() => { setId(p.id); setF({ title: p.title, subtitle: p.subtitle ?? "", content: p.content ?? "", category: p.category ?? "Everyday", cover_image: p.cover_image ?? "", images: p.images ?? [] }); scrollTo(0, 0); }}>Edit</button>
          <button onClick={() => toggle(p)}>{p.status === "published" ? "Unpublish" : "Publish"}</button><button onClick={() => del(p)}>Delete</button></span></li>))}</ul></section>);
}
