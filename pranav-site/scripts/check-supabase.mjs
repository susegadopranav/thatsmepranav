// Run: node --env-file=.env.local scripts/check-supabase.mjs
const u = process.env.NEXT_PUBLIC_SUPABASE_URL, k = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!u || !k) { console.error("Missing env vars"); process.exit(1); }
const h = { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" };
const show = async (label, r) => console.log(label.padEnd(44), r.status, (await r.text()).slice(0, 90));
await show("read published posts (expect 200)", await fetch(`${u}/rest/v1/blog_posts?select=id&status=eq.published`, { headers: h }));
await show("read drafts anonymously (expect 200, [])", await fetch(`${u}/rest/v1/blog_posts?select=id&status=eq.draft`, { headers: h }));
await show("anon insert post (expect 401/403)", await fetch(`${u}/rest/v1/blog_posts`, { method: "POST", headers: h, body: JSON.stringify({ title: "x", slug: "x" }) }));
await show("anon read messages (expect 200, [])", await fetch(`${u}/rest/v1/contact_messages?select=id`, { headers: h }));
await show("anon read profiles (expect 200, [])", await fetch(`${u}/rest/v1/profiles?select=id`, { headers: h }));
