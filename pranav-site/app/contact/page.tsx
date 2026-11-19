import ResumeButton from "@/components/site/ResumeButton";
export const revalidate = 60;
export default function Contact() {
  return (<main className="mx-auto max-w-[640px] px-6 py-24"><h1 className="font-serif text-5xl font-light">Let’s talk.</h1>
    <p className="my-6">The best way to reach me is by email.</p><ResumeButton />
    <dl className="mt-8 grid gap-4 font-serif text-2xl"><div><dt className="text-sm text-[var(--mute)] font-sans">Email</dt><dd><a href="mailto:sripranavayachit.mail@gmail.com">sripranavayachit.mail@gmail.com</a></dd></div>
      <div><dt className="text-sm text-[var(--mute)] font-sans">Phone</dt><dd><a href="tel:+917892303618">+91 78923 03618</a></dd></div>
      <div><dt className="text-sm text-[var(--mute)] font-sans">Instagram</dt><dd><a href="https://www.instagram.com/pranav.ayachit/" rel="noopener">@pranav.ayachit</a></dd></div></dl></main>);
}
