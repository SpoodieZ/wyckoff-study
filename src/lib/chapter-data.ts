import fs from "node:fs";
import path from "node:path";
import type { ChapterData } from "./types";

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
