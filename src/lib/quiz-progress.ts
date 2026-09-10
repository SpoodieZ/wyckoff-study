const STORAGE_KEY = "wyckoff-quiz-progress";

export interface QuizProgressResult {
  questionId: string;
  correct: boolean;
  confidence?: string;
}

export interface QuizProgress {
  chapterId: number;
  total: number;
  results: QuizProgressResult[];
}

/** Lưu tiến trình 1 lượt làm bài đang dở — chỉ nhớ lượt gần nhất (đủ dùng cho
 * app cá nhân, không cần nhớ nhiều chương dang dở cùng lúc). */
export function saveQuizProgress(progress: QuizProgress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage không khả dụng — bỏ qua.
  }
}

export function getQuizProgress(): QuizProgress | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuizProgress) : null;
  } catch {
    return null;
  }
}

export function clearQuizProgress() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage không khả dụng — bỏ qua.
  }
}
