"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, PlayCircle, Sparkles } from "lucide-react";
import type { ReviewSampleItem } from "@/lib/sample-review";
import type { ChapterMeta } from "@/lib/types";

export default function ReviewView({
  items,
  chapters,
}: {
  items: ReviewSampleItem[];
  chapters: ChapterMeta[];
}) {
  const [chapterFilter, setChapterFilter] = useState<number | "all">("all");

  const filtered = useMemo(
    () => (chapterFilter === "all" ? items : items.filter((i) => i.chapterId === chapterFilter)),
    [items, chapterFilter]
  );

  const usedChapterIds = Array.from(new Set(items.map((i) => i.chapterId)));
  const filterChapters = chapters.filter((c) => usedChapterIds.includes(c.id));

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 pb-16 md:p-6 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-card-title font-bold text-on-surface">Ôn lại câu sai</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Tập trung vào những khái niệm cần củng cố.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="rounded-control border border-outline-variant bg-surface-container-lowest px-3 py-2 text-label-sm text-on-surface"
          >
            <option value="all">Tất cả các chương</option>
            {filterChapters.map((c) => (
              <option key={c.id} value={c.id}>
                Ch {c.id}: {c.title}
              </option>
            ))}
          </select>
          <button
            disabled
            title="Cần lưu trữ dữ liệu thật (Supabase) để bật tính năng này — sắp có"
            className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-full bg-primary/50 px-5 py-2.5 text-btn font-semibold text-on-primary"
          >
            <PlayCircle size={18} />
            Bắt đầu ôn tập
          </button>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-caption text-outline">
        <Sparkles size={14} />
        Dữ liệu mẫu để xem trước giao diện — lưu trữ lịch sử câu sai thật sẽ dùng Supabase (sắp có).
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-frame border border-outline-variant bg-surface-container-lowest p-10 text-center shadow-study">
          <p className="text-body-lg text-on-surface-variant">
            Chưa có câu nào cần ôn lại — bạn đang nhớ tốt đấy.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-caption font-semibold text-primary">
                    Chương {item.chapterId}
                  </span>
                  <span className="mini-candlestick candlestick-crimson shrink-0" />
                </div>
                <h3 className="mb-2 font-display text-body-lg font-bold leading-snug text-on-surface">
                  {item.questionPrompt}
                </h3>
                <p className="line-clamp-3 text-body-md text-on-surface-variant">
                  {item.explanationSnippet}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-3">
                <span className="flex items-center gap-1.5 text-caption text-outline">
                  <Calendar size={14} />
                  Sai ngày {item.wrongDate}
                </span>
                <Link
                  href={`/chapters/${item.chapterId}`}
                  className="text-label-sm font-semibold text-primary hover:underline"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
