"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.5 26.9 36.5 24 36.5c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.7 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.6 5.4C41.4 35.7 44 30.2 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-card border border-outline-variant bg-surface-container-lowest p-6 shadow-study">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Image src="/logo-icon.png" alt="" width={677} height={442} className="h-10 w-auto object-contain" />
          <Image
            src="/logo-wordmark.png"
            alt="Wyckoff Study"
            width={812}
            height={335}
            className="h-8 w-auto object-contain"
          />
          <p className="text-body-md text-on-surface-variant">Đăng nhập để tiếp tục ôn tập</p>
        </div>

        {error && <p className="mb-4 rounded-control bg-crimson-soft px-3 py-2 text-label-sm text-crimson">{error}</p>}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-btn font-semibold text-on-surface transition-colors hover:bg-surface-container disabled:opacity-60"
        >
          <GoogleIcon />
          {loading ? "Đang chuyển hướng…" : "Đăng nhập bằng Google"}
        </button>

        <p className="mt-4 text-center text-caption text-outline">
          Đăng nhập được nhưng chỉ xem được nội dung — cần quản trị viên cấp quyền mới thêm/sửa được.
        </p>
      </div>
    </div>
  );
}
