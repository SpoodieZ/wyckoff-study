import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 đổi tên file quy ước "middleware.ts" -> "proxy.ts" (export "proxy"
// thay vì "middleware"), hành vi giữ nguyên. Đây là chỗ làm mới session cookie
// của Supabase trên mỗi request, và chặn truy cập khi chưa đăng nhập.
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Chỉ khu vực Nhật Ký Giao Dịch (thêm/sửa nội dung) cần đăng nhập; làm bài
  // kiểm tra và xem tiến độ vẫn công khai cho ai có link.
  const isProtectedPath = request.nextUrl.pathname.startsWith("/journal");

  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|charts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
