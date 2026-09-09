"use client";

import { useEffect, useState } from "react";
import { Award, Lock } from "lucide-react";
import { BADGES, getAchievementStats, getUnlockedBadgeIds } from "@/lib/achievements";
import { getStudyStreak } from "@/lib/streak";

export default function BadgesView() {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stats = getAchievementStats(getStudyStreak());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnlocked(getUnlockedBadgeIds(stats));
    setHydrated(true);
  }, []);

  return (
    <div>
      <h1 className="font-display text-card-title font-bold text-on-surface">Huy Hiệu</h1>
      <p className="mt-1 text-body-md text-on-surface-variant">
        {hydrated ? `Đã mở khóa ${unlocked.size}/${BADGES.length} huy hiệu.` : "Đang tải…"}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BADGES.map((badge) => {
          const isUnlocked = unlocked.has(badge.id);
          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-2 rounded-card border p-5 text-center shadow-study ${
                isUnlocked
                  ? "border-primary-fixed bg-light-chart-bg"
                  : "border-outline-variant bg-surface-container-lowest opacity-60"
              }`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  isUnlocked ? "bg-primary-fixed text-primary" : "bg-surface-container text-outline"
                }`}
              >
                {isUnlocked ? <Award size={26} /> : <Lock size={22} />}
              </div>
              <h3 className="font-display text-body-lg font-bold text-on-surface">{badge.title}</h3>
              <p className="text-body-md text-on-surface-variant">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
