const STORAGE_KEY = "wyckoff-mistake-notes";

function readAll(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** Ghi chú tự phản tư (riêng tư, chỉ trên máy này) khi trả lời sai 1 câu. */
export function saveMistakeNote(questionId: string, note: string) {
  try {
    const all = readAll();
    if (note.trim()) {
      all[questionId] = note.trim();
    } else {
      delete all[questionId];
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage không khả dụng — bỏ qua.
  }
}

export function getMistakeNote(questionId: string): string {
  return readAll()[questionId] ?? "";
}
