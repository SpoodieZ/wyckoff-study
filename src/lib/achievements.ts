const COMPLETED_KEY = "wyckoff-completed-chapters";
const PERFECT_KEY = "wyckoff-perfect-chapters";
const BOSS_KEY = "wyckoff-boss-cleared-chapters";

export interface Badge {
  id: string;
  title: string;
  description: string;
  isUnlocked: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  completedCount: number;
  perfectCount: number;
  bossClearedCount: number;
  dailyStreak: number;
}

export const BADGES: Badge[] = [
  {
    id: "first-chapter",
    title: "Chương Đầu Tiên",
    description: "Hoàn thành chương đầu tiên.",
    isUnlocked: (s) => s.completedCount >= 1,
  },
  {
    id: "ten-chapters",
    title: "Kiên Trì",
    description: "Hoàn thành 10 chương.",
    isUnlocked: (s) => s.completedCount >= 10,
  },
  {
    id: "all-chapters",
    title: "Học Giả Wyckoff",
    description: "Hoàn thành cả 42 chương.",
    isUnlocked: (s) => s.completedCount >= 42,
  },
  {
    id: "perfect-chapter",
    title: "Không Tì Vết",
    description: "Đạt điểm tuyệt đối trong một chương.",
    isUnlocked: (s) => s.perfectCount >= 1,
  },
  {
    id: "boss-slayer",
    title: "Cao Thủ Boss",
    description: "Hạ gục 5 Câu Quyết Định cuối chương.",
    isUnlocked: (s) => s.bossClearedCount >= 5,
  },
  {
    id: "week-streak",
    title: "7 Ngày Bền Bỉ",
    description: "Học liên tục 7 ngày.",
    isUnlocked: (s) => s.dailyStreak >= 7,
  },
];

function readIdSet(key: string): Set<number> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function addToIdSet(key: string, id: number) {
  try {
    const set = readIdSet(key);
    set.add(id);
    window.localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    // localStorage không khả dụng — bỏ qua, không phải lỗi nghiêm trọng.
  }
}

export function recordChapterCompleted(chapterId: number) {
  addToIdSet(COMPLETED_KEY, chapterId);
}

export function recordChapterPerfect(chapterId: number) {
  addToIdSet(PERFECT_KEY, chapterId);
}

export function recordBossCleared(chapterId: number) {
  addToIdSet(BOSS_KEY, chapterId);
}

export function getAchievementStats(dailyStreak: number): AchievementStats {
  return {
    completedCount: readIdSet(COMPLETED_KEY).size,
    perfectCount: readIdSet(PERFECT_KEY).size,
    bossClearedCount: readIdSet(BOSS_KEY).size,
    dailyStreak,
  };
}

export function getUnlockedBadgeIds(stats: AchievementStats): Set<string> {
  return new Set(BADGES.filter((b) => b.isUnlocked(stats)).map((b) => b.id));
}
