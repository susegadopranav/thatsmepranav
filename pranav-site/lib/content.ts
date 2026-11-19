import { createClient } from "@/lib/supabase/server";
import { FIELDS } from "@/lib/fields";
export async function getContent(): Promise<Record<string, string>> {
  const out: Record<string, string> = Object.fromEntries(FIELDS.map(([k, , d]) => [k, d]));
  const { data } = await (await createClient()).from("site_content").select("key,value");
  data?.forEach((r) => { if (typeof r.value === "string" && r.value.trim()) out[r.key] = r.value; });
  return out;
}
