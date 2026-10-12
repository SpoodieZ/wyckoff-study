"use client";

import AppShell from "@/components/AppShell";
import { useT } from "@/lib/i18n/client";

// Nhật ký đọc dữ liệu từ Supabase; nếu Supabase gặp sự cố thì hiện thông báo
// nhẹ nhàng thay vì trang lỗi 500 của hệ thống.
export default function JournalError({ reset }: { error: Error; reset: () => void }) {
  const t = useT();
  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 p-10 text-center">
        <h1 className="font-display text-card-title font-bold text-on-surface">{t("journal.errorTitle")}</h1>
        <p className="text-body-md text-on-surface-variant">
          {t("journal.errorBody")}
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-primary px-5 py-2.5 text-btn font-semibold text-on-primary transition-colors hover:bg-primary-strong"
        >
          {t("common.retry")}
        </button>
      </div>
    </AppShell>
  );
}
