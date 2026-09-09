import fs from "node:fs";
import path from "node:path";
import type { ChapterData, Question } from "./types";
import { CHAPTERS_META } from "./chapters-meta";

const CHAPTERS_DIR = path.join(process.cwd(), "data", "chapters");

function paddedId(id: number): string {
  return String(id).padStart(2, "0");
}

export function hasChapterData(id: number): boolean {
  return fs.existsSync(path.join(CHAPTERS_DIR, `${paddedId(id)}.json`));
}

export function loadChapterData(id: number): ChapterData | null {
  const filePath = path.join(CHAPTERS_DIR, `${paddedId(id)}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ChapterData;
}

export interface ChapterHeroData {
  id: number;
  title: string;
  summary: string;
  chartImage: string | null;
}

export function loadChapterHeroData(id: number): ChapterHeroData | null {
  const data = loadChapterData(id);
  if (!data) return null;
  const withImage = data.questions.find((q) => q.chartImage);
  return {
    id: data.chapterId,
    title: data.title,
    summary: data.summary,
    chartImage: withImage?.chartImage ?? null,
  };
}

/** Ngày hiện tại theo giờ Việt Nam, dạng yyyy-mm-dd — dùng làm seed để cả ngày
 * mọi người thấy cùng 1 bộ câu hỏi "Thử Thách Hôm Nay", đổi bộ mới lúc sang ngày. */
function todayVnDateStr(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) >>> 0;
  function next() {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 4294967296;
  }
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Bộ 5 câu ngẫu nhiên (có seed theo ngày) trộn từ toàn bộ các chương đã có dữ liệu. */
export function loadDailyChallenge(count: number): ChapterData {
  const allQuestions: Question[] = [];
  for (const meta of CHAPTERS_META) {
    const data = loadChapterData(meta.id);
    if (data) allQuestions.push(...data.questions);
  }
  const todaySeed = todayVnDateStr();
  const picked = seededShuffle(allQuestions, todaySeed).slice(0, count);
  return {
    chapterId: 0,
    title: "Thử Thách Hôm Nay",
    summary: `${count} câu hỏi ngẫu nhiên trộn từ tất cả các chương — đổi mới mỗi ngày.`,
    questions: picked,
  };
}
