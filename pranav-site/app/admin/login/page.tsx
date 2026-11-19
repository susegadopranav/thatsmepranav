"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function Login() {
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const f = new FormData(e.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) { setErr("Email or password is incorrect."); setBusy(false); } else window.location.href = "/admin";
  }
  return (<main className="mx-auto max-w-sm px-6 py-32"><h1 className="font-serif text-4xl font-light">Admin</h1>
    <form onSubmit={go} className="mt-8 grid gap-4"><input name="email" type="email" required placeholder="Email" className="border-b bg-transparent py-2" />
      <input name="password" type="password" required placeholder="Password" className="border-b bg-transparent py-2" />
      {err && <p role="alert">{err}</p>}<button disabled={busy} className="bg-[var(--forest)] text-[var(--on)] py-3">{busy ? "Signing in…" : "Sign in"}</button></form></main>);
}
