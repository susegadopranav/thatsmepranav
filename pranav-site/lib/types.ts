export const CATEGORIES = ["Everyday","Music","Golf","Travel","Food & Mixology","Thoughts","Photography"] as const;
export type PostImage = { url: string; caption: string };
export type Post = { id: string; title: string; slug: string; subtitle: string | null; content: string | null; category: string | null;
  cover_image: string | null; images: PostImage[]; status: "draft" | "published"; published_at: string | null };
export type EventRow = { id: string; title: string; starts_at: string; ends_at: string | null; notes: string | null };
export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export const GALLERY_CATEGORIES = ["Mishka","Music","Mixology","Golf","Travel","Food","Everyday"] as const;
export type GalleryRow = { id: string; title: string | null; description: string | null; image_url: string; category: string | null; sort_order: number; is_public: boolean };
