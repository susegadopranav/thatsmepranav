"use client";
import { useEffect, useState } from "react";
export type Photo = { id: string; image_url: string; title: string | null; description: string | null };
export default function Lightbox({ photos }: { photos: Photo[] }) {
  const [i, setI] = useState<number | null>(null);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === "Escape") setI(null); if (i !== null && e.key === "ArrowRight") setI((i + 1) % photos.length); if (i !== null && e.key === "ArrowLeft") setI((i + photos.length - 1) % photos.length); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [i, photos.length]);
  return (<>
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">{photos.map((p, n) => (
      <figure key={p.id} className="mb-4 break-inside-avoid"><button onClick={() => setI(n)} className="block w-full" aria-label={`Enlarge ${p.title ?? "photo"}`}>
        <img src={p.image_url} alt={p.title ?? ""} loading="lazy" className="w-full" /></button>
        {p.title && <figcaption className="pt-1 text-sm text-[var(--mute)]">{p.title}</figcaption>}</figure>))}</div>
    {i !== null && (<div role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setI(null)} className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center bg-black/90 p-6">
      <img src={photos[i].image_url} alt={photos[i].title ?? ""} className="max-h-[80vh] max-w-full object-contain" />
      <p className="mt-3 max-w-xl text-center text-white">{photos[i].title}{photos[i].description ? ` — ${photos[i].description}` : ""}</p></div>)}</>);
}
