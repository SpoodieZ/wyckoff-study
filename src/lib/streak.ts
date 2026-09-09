const STORAGE_KEY = "wyckoff-daily-streak";

interface StreakData {
  lastDate: string; // yyyy-mm-dd
  count: number;
}

function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function yesterdayOf(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** Đọc chuỗi ngày học liên tục hiện tại, không ghi gì cả. */
export function getStudyStreak(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw) as StreakData;
    const today = todayStr();
    if (data.lastDate === today || data.lastDate === yesterdayOf(today)) {
      return data.count;
    }
    return 0; // chuỗi đã đứt (bỏ lỡ >= 1 ngày)
  } catch {
    return 0;
  }
}

/** Gọi khi người dùng vừa trả lời 1 câu — cập nhật chuỗi ngày học liên tục. */
export function recordStudyActivity(): number {
  try {
    const today = todayStr();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const data: StreakData = raw ? JSON.parse(raw) : { lastDate: "", count: 0 };

    let count: number;
    if (data.lastDate === today) {
      count = data.count;
    } else if (data.lastDate === yesterdayOf(today)) {
      count = data.count + 1;
    } else {
      count = 1;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastDate: today, count }));
    return count;
  } catch {
    return 0;
  }
}
