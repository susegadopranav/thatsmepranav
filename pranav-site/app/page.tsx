import Link from "next/link";
import { getContent } from "@/lib/content";
export const revalidate = 60;
export default async function Home() {
  const c = await getContent();
  return (<main className="mx-auto max-w-[1180px] px-6 py-24">
    <h1 className="font-serif text-7xl font-light text-[var(--forest)] md:text-9xl">Pranav<br />Ayachit</h1>
    <p className="mt-4 font-serif text-2xl italic text-[var(--gold)]">{c.tagline}</p>
    {c.pro_intro && <p className="mt-8 max-w-[62ch]">{c.pro_intro}</p>}
    {c.personal_intro && <p className="mt-4 max-w-[62ch]">{c.personal_intro}</p>}
    <dl className="mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
      <div><dt className="text-sm text-[var(--mute)]">Current role</dt><dd className="font-serif text-xl">{c.current_role}</dd></div>
      <div><dt className="text-sm text-[var(--mute)]">Education</dt><dd className="font-serif text-xl">{c.education}</dd></div>
      <div><dt className="text-sm text-[var(--mute)]">Skills</dt><dd className="whitespace-pre-line">{c.skills}</dd></div>
      <div><dt className="text-sm text-[var(--mute)]">Interests</dt><dd className="whitespace-pre-line">{c.interests}</dd></div></dl>
    <Link href="/contact" className="mt-10 inline-block bg-[var(--forest)] px-6 py-3 text-[var(--on)]">Contact</Link></main>);
}
