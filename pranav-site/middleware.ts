import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
// Gatekeeping for UX only. Real security is Row Level Security in the database.
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const { data: p } = user ? await supabase.from("profiles").select("role").eq("id", user.id).single() : { data: null };
    if (!user || p?.role !== "admin") return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return res;
}
export const config = { matcher: ["/admin/:path*"] };
