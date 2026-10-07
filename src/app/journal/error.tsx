"use client";

import AppShell from "@/components/AppShell";

// Nhật ký đọc dữ liệu từ Supabase; nếu Supabase gặp sự cố thì hiện thông báo
// nhẹ nhàng thay vì trang lỗi 500 của hệ thống.
export default function JournalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 p-10 text-center">
        <h1 className="font-display text-card-title font-bold text-on-surface">Không tải được Nhật Ký</h1>
        <p className="text-body-md text-on-surface-variant">
          Kho dữ liệu nhật ký đang tạm thời không phản hồi. Phần học và làm bài vẫn dùng bình thường — bạn thử lại sau
          ít phút nhé.
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-primary px-5 py-2.5 text-btn font-semibold text-on-primary transition-colors hover:bg-primary-strong"
        >
          Thử lại
        </button>
      </div>
    </AppShell>
  );
}
