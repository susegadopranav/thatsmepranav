"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
const PATH = "resume.pdf"; // fixed path: replacing overwrites the file, so the public link never changes
export default function ResumeManager() {
  const sb = createClient(); const [cur, setCur] = useState<{ id: string; file_url: string; updated_at: string } | null>(null); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { const { data } = await sb.from("resume").select("id,file_url,updated_at").maybeSingle(); setCur(data); }, []);
  useEffect(() => { load(); }, [load]);
  async function up(file?: File) {
    if (!file) return; if (file.type !== "application/pdf" || file.size > 5 * 1024 * 1024) return setMsg("Choose a PDF under 5 MB.");
    setBusy(true); const { error } = await sb.storage.from("resume").upload(PATH, file, { upsert: true, contentType: "application/pdf", cacheControl: "60" });
    if (error) { setMsg(error.message); setBusy(false); return; }
    const row = { file_url: sb.storage.from("resume").getPublicUrl(PATH).data.publicUrl, file_name: "Pranav-Ayachit-Resume.pdf", updated_at: new Date().toISOString() };
    const { error: e2 } = cur ? await sb.from("resume").update(row).eq("id", cur.id) : await sb.from("resume").insert(row);
    setMsg(e2 ? e2.message : "Resume updated."); setBusy(false); load();
  }
  return (<section><h2 className="font-serif text-3xl">Resume</h2>{msg && <p role="status" className="my-2 text-[var(--gold)]">{msg}</p>}
    <p className="my-4">{cur ? <>Current file: <a className="underline" href={`${cur.file_url}?v=${new Date(cur.updated_at).getTime()}`} target="_blank" rel="noopener">view PDF</a> (updated {new Date(cur.updated_at).toLocaleDateString("en-IN")})</> : "No resume uploaded yet."}</p>
    <input type="file" accept="application/pdf" disabled={busy} onChange={(e) => up(e.target.files?.[0])} /></section>);
}
