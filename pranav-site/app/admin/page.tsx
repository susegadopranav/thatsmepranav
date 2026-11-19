"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Overview from "@/components/admin/Overview";
import PostManager from "@/components/admin/PostManager";
import GalleryManager from "@/components/admin/GalleryManager";
import ResumeManager from "@/components/admin/ResumeManager";
import ProfileEditor from "@/components/admin/ProfileEditor";
import EventManager from "@/components/admin/EventManager";
const TABS = [["Overview", Overview], ["Daily Log", PostManager], ["Gallery", GalleryManager], ["Resume", ResumeManager], ["Profile", ProfileEditor], ["Calendar", EventManager]] as const;
export default function Admin() {
  const [t, setT] = useState<string>("Overview"); const Active = TABS.find(([n]) => n === t)![1];
  return (<main className="mx-auto max-w-[1000px] px-6 py-12"><div className="flex items-center justify-between"><h1 className="font-serif text-4xl font-light">Dashboard</h1>
    <button onClick={async () => { await createClient().auth.signOut(); window.location.href = "/admin/login"; }}>Log out</button></div>
    <div role="tablist" className="my-8 flex flex-wrap gap-2">{TABS.map(([n]) => <button key={n} role="tab" aria-selected={t === n} onClick={() => setT(n)} className={`border px-4 py-1 ${t === n ? "bg-[var(--forest)] text-[var(--on)]" : "border-[var(--line)]"}`}>{n}</button>)}</div>
    <Active /></main>);
}
