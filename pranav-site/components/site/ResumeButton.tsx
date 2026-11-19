import { createClient } from "@/lib/supabase/server";
export default async function ResumeButton() {
  const { data } = await (await createClient()).from("resume").select("file_url,file_name,updated_at").maybeSingle();
  if (!data) return <p className="text-[var(--mute)]">Resume coming soon.</p>;
  return <a href={`${data.file_url}?v=${new Date(data.updated_at).getTime()}`} download={data.file_name ?? "resume.pdf"} rel="noopener"
    className="block bg-[var(--gold)] p-5 text-center font-serif text-2xl text-white hover:bg-[var(--forest)]">Download formal resume ↓</a>;
}
