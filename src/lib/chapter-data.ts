import fs from "node:fs";
import path from "node:path";
import type { ChapterData, Question } from "./types";
import { CHAPTERS_META } from "./chapters-meta";
import type { StudySet } from "./study-sets";
import type { Locale } from "./i18n/config";
import { translate } from "./i18n/translate";

const CHAPTERS_DIR = path.join(process.cwd(), "data", "chapters");
const CHAPTERS_DIR_EN = path.join(process.cwd(), "data", "chapters-en");

function paddedId(id: number): string {
  return String(id).padStart(2, "0");
}

export function hasChapterData(id: number): boolean {
  return fs.existsSync(path.join(CHAPTERS_DIR, `${paddedId(id)}.json`));
}

/** Đọc 1 chương theo ngôn ngữ; chương chưa có bản dịch thì dùng tiếng Việt. */
export function loadChapterData(id: number, locale: Locale = "vi"): ChapterData | null {
  if (locale === "en") {
    const enPath = path.join(CHAPTERS_DIR_EN, `${paddedId(id)}.json`);
    if (fs.existsSync(enPath)) return JSON.parse(fs.readFileSync(enPath, "utf-8")) as ChapterData;
  }
  const filePath = path.join(CHAPTERS_DIR, `${paddedId(id)}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ChapterData;
}

export interface ChapterHeroData {
  id: number;
  title: string;
  summary: string;
  chartImage: string | null;
}

export function loadChapterHeroData(id: number, locale: Locale = "vi"): ChapterHeroData | null {
  const data = loadChapterData(id, locale);
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

function loadAllQuestions(): Question[] {
  const all: Question[] = [];
  for (const meta of CHAPTERS_META) {
    const data = loadChapterData(meta.id);
    if (data) all.push(...data.questions);
  }
  return all;
}

/** Thay các câu hỏi tiếng Việt đã chọn bằng bản dịch cùng id (nếu có). Việc chọn câu luôn
 * làm trên bản gốc tiếng Việt để bộ câu hỏi hằng ngày/Study Set giống nhau ở mọi ngôn ngữ. */
function localizeQuestions(questions: Question[], locale: Locale): Question[] {
  if (locale === "vi") return questions;
  const byId = new Map<string, Question>();
  for (const meta of CHAPTERS_META) {
    const data = loadChapterData(meta.id, locale);
    if (data) for (const q of data.questions) byId.set(q.id, q);
  }
  return questions.map((q) => byId.get(q.id) ?? q);
}

/** Bộ 5 câu ngẫu nhiên (có seed theo ngày) trộn từ toàn bộ các chương đã có dữ liệu. */
export function loadDailyChallenge(count: number, locale: Locale = "vi"): ChapterData {
  const todaySeed = todayVnDateStr();
  const picked = seededShuffle(loadAllQuestions(), todaySeed).slice(0, count);
  return {
    chapterId: 0,
    title: translate(locale, "daily.chapterTitle"),
    summary: translate(locale, "daily.chapterSummary", { n: count }),
    questions: localizeQuestions(picked, locale),
  };
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Số câu hỏi khớp với 1 Study Set, trên toàn bộ dữ liệu — dùng hiện số lượng ở trang danh sách. */
export function countStudySetQuestions(set: StudySet): number {
  return loadAllQuestions().filter(set.matcher).length;
}

/** count câu ngẫu nhiên (xáo lại mỗi lần gọi) khớp với 1 Study Set. */
export function loadStudySetChapterData(
  set: StudySet,
  count: number,
  locale: Locale = "vi"
): ChapterData {
  const matched = loadAllQuestions().filter(set.matcher);
  return {
    chapterId: 0,
    title: translate(locale, set.titleKey),
    summary: translate(locale, set.descriptionKey),
    questions: localizeQuestions(shuffle(matched).slice(0, count), locale),
  };
}
