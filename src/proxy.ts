import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 đổi tên file quy ước "middleware.ts" -> "proxy.ts" (export "proxy"
// thay vì "middleware"), hành vi giữ nguyên. Đây là chỗ làm mới session cookie
// của Supabase trên mỗi request, và chặn truy cập khi chưa đăng nhập.
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Nhật Ký Giao Dịch: ai cũng XEM được (danh sách + từng bài); chỉ các trang
  // viết/sửa/quản trị mới bắt đăng nhập. Mọi trang ngoài /journal bỏ qua
  // Supabase hoàn toàn — sự cố Supabase (mất mạng, project bị tạm dừng/xóa...)
  // không được phép kéo sập những trang không liên quan.
  if (!path.startsWith("/journal")) {
    return NextResponse.next({ request });
  }

  const requiresLogin =
    path === "/journal/new" || path === "/journal/members" || /^\/journal\/[^/]+\/edit$/.test(path);

  let supabaseResponse = NextResponse.next({ request });

  try {
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

    // Luôn gọi để làm mới session cookie cho người đã đăng nhập đang xem nhật ký.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && requiresLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch {
    // Không kết nối được Supabase: trang cần đăng nhập thì đưa về login, trang
    // chỉ-xem cứ để chạy tiếp (tự nó sẽ xử lý khi không lấy được dữ liệu).
    if (requiresLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|charts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
