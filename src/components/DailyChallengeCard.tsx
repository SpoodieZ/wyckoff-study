"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { getStudyStreak } from "@/lib/streak";

export default function DailyChallengeCard() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Chỉ đọc được localStorage sau khi mount — trang chủ là Server Component
    // nên không thể biết chuỗi ngày học lúc render đầu tiên.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStreak(getStudyStreak());
  }, []);

  return (
    <Link
      href="/daily"
      className="group flex items-center justify-between gap-4 overflow-hidden rounded-frame bg-gradient-to-r from-primary to-primary-strong px-5 py-4 shadow-study transition-transform hover:scale-[1.01] md:px-8"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-on-primary">
          <span className="pulse-ring absolute inset-0 rounded-full bg-white" />
          <Zap size={20} className="relative" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-body-lg font-bold text-on-primary">Thử Thách Hôm Nay</h3>
            <span className="rounded-full bg-crimson px-2.5 py-0.5 text-caption font-bold uppercase tracking-wide text-on-primary">
              Hôm nay
            </span>
          </div>
          <p className="text-body-md text-on-primary/80">
            5 câu ngẫu nhiên trộn từ mọi chương
            {streak > 0 ? ` — làm để giữ chuỗi ${streak} ngày!` : " — đổi mới mỗi ngày."}
          </p>
        </div>
      </div>

      <ArrowRight size={20} className="shrink-0 text-on-primary transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
