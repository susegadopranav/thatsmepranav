"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { EventRow } from "@/lib/types";
export default function EventManager() {
  const sb = createClient(); const [ev, setEv] = useState<EventRow[]>([]); const [msg, setMsg] = useState("");
  const load = useCallback(async () => { const { data, error } = await sb.from("calendar_events").select("*").order("starts_at"); if (error) setMsg(error.message); else setEv(data as EventRow[]); }, []);
  useEffect(() => { load(); }, [load]);
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const { error } = await sb.from("calendar_events").insert({ title: String(f.get("title")), starts_at: new Date(String(f.get("when"))).toISOString(), notes: String(f.get("notes") || "") || null });
    if (error) setMsg(error.message); else { setMsg("Event added."); (e.target as HTMLFormElement).reset(); load(); }
  }
  async function del(id: string) { const { error } = await sb.from("calendar_events").delete().eq("id", id); if (error) setMsg(error.message); load(); }
  return (<section aria-labelledby="em"><h2 id="em" className="font-serif text-3xl">Calendar</h2>{msg && <p role="status">{msg}</p>}
    <form onSubmit={add} className="grid gap-3 my-6"><input name="title" required placeholder="Event" className="border-b bg-transparent py-2" />
      <input name="when" type="datetime-local" required className="border-b bg-transparent py-2" /><input name="notes" placeholder="Notes (optional)" className="border-b bg-transparent py-2" />
      <button className="bg-[var(--forest)] text-[var(--on)] py-2 w-40">Add event</button></form>
    <ul>{ev.length === 0 && <li className="text-[var(--mute)]">No events yet.</li>}{ev.map((e) => <li key={e.id} className="flex justify-between border-b py-2"><span>{new Date(e.starts_at).toLocaleString("en-IN")} · {e.title}</span><button onClick={() => del(e.id)}>Delete</button></li>)}</ul></section>);
}
