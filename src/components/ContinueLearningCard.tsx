"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import { getAchievementStats } from "@/lib/achievements";
import { getQuizProgress } from "@/lib/quiz-progress";

const HERO_STORAGE_KEY = "wyckoff-hero-chapter";

export default function ContinueLearningCard() {
  const [chapterId, setChapterId] = useState<number | null>(null);
  const [inProgress, setInProgress] = useState<{ answered: number; total: number } | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Ưu tiên bài đang làm dở (nếu có) — chỉ khi không có mới rơi về chương
    // xem gần nhất trên carousel trang chủ.
    const progress = getQuizProgress();
    const chapterInProgress = progress ? CHAPTERS_META.find((c) => c.id === progress.chapterId) : undefined;

    let resolvedId: number | null;
    if (progress && chapterInProgress) {
      resolvedId = chapterInProgress.id;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInProgress({ answered: progress.results.length, total: progress.total });
    } else {
      const saved = Number(window.localStorage.getItem(HERO_STORAGE_KEY));
      const fallback = CHAPTERS_META[0]?.id ?? null;
      resolvedId = CHAPTERS_META.some((c) => c.id === saved) ? saved : fallback;
    }

    setChapterId(resolvedId);
    setCompletedCount(getAchievementStats(0).completedCount);
  }, []);

  if (chapterId === null) return null;
  const chapter = CHAPTERS_META.find((c) => c.id === chapterId);
  if (!chapter) return null;

  return (
    <div className="mx-2 mt-4 rounded-card border border-outline-variant bg-surface-container-lowest p-3 shadow-study">
      <p className="mb-1 text-caption font-bold uppercase tracking-wider text-outline">
        {inProgress ? "Đang làm dở" : "Tiếp tục học"}
      </p>
      <p className={`truncate text-label-sm font-semibold text-on-surface ${inProgress ? "" : "mb-2"}`}>
        Chương {chapter.id}: {chapter.title}
      </p>
      {inProgress && (
        <p className="mb-2 text-label-sm text-on-surface-variant">
          Câu {inProgress.answered + 1}/{inProgress.total}
        </p>
      )}
      <Link
        href={`/chapters/${chapter.id}`}
        className="inline-flex items-center gap-1.5 text-label-sm font-semibold text-primary hover:text-primary-strong"
      >
        {inProgress ? "Tiếp tục làm bài" : "Tiếp tục"}
        <ArrowRight size={14} />
      </Link>
      <p className="mt-3 border-t border-outline-variant pt-2 text-caption text-outline">
        {completedCount}/{CHAPTERS_META.length} chương hoàn thành
      </p>
    </div>
  );
}
