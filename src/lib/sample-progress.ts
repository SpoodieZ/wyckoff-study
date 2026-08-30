// Dữ liệu mẫu cho trang "Tiến độ" — chưa nối với lưu trữ thật (Supabase sẽ làm sau).
export interface ChapterProgressSample {
  chapterId: number;
  masteryPercent: number;
  recentResults: boolean[]; // true = đúng, false = sai
}

export const SAMPLE_CHAPTER_PROGRESS: ChapterProgressSample[] = [
  { chapterId: 1, masteryPercent: 92, recentResults: [true, true, true, false, true] },
  { chapterId: 2, masteryPercent: 78, recentResults: [true, false, true, true, true] },
  { chapterId: 3, masteryPercent: 65, recentResults: [true, true, false, false, true] },
  { chapterId: 4, masteryPercent: 40, recentResults: [false, true, false, true, false] },
  { chapterId: 5, masteryPercent: 15, recentResults: [false, false, true, false, false] },
  { chapterId: 6, masteryPercent: 0, recentResults: [] },
];

export const SAMPLE_OVERVIEW = {
  chaptersStarted: 5,
  averageMastery: 58,
  questionsAnswered: 134,
};
