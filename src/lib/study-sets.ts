import type { Question } from "./types";

export interface StudySet {
  id: string;
  tag: string;
  title: string;
  description: string;
  matcher: (q: Question) => boolean;
  hasGlossary?: boolean;
}

const STRUCTURE_TERMS = [
  "Preliminary Support",
  "Preliminary Supply",
  "Selling Climax",
  "Buying Climax",
  "Automatic Rally",
  "Automatic Reaction",
  "Secondary Test",
  "Spring",
  "Sign of Strength",
  "Sign of Weakness",
  "Last Point of Support",
  "Last Point of Supply",
  "Backup to the Edge",
  "Jump Across the Creek",
  "Upthrust After Distribution",
  "Phase A",
  "Phase B",
  "Phase C",
  "Phase D",
  "Phase E",
];

function textOf(q: Question): string {
  const options = "options" in q ? q.options.join(" ") : "";
  const explanation = "explanation" in q ? q.explanation : "";
  return `${q.prompt} ${explanation} ${options}`;
}

export const STUDY_SETS: StudySet[] = [
  {
    id: "thuc-hanh-bieu-do",
    tag: "Thực hành biểu đồ",
    title: "Thực Hành Biểu Đồ",
    description: "Chỉ các câu đọc biểu đồ thật, trộn ngẫu nhiên từ mọi chương.",
    matcher: (q) => q.type === "chart_identify",
  },
  {
    id: "cau-truc-thuat-ngu",
    tag: "Thuật ngữ",
    title: "Cấu Trúc & Thuật Ngữ Cốt Lõi",
    description: "PS, SC, AR, ST, Spring, SOS, LPS, BCLX, UTAD, SOW, LPSY... và ý nghĩa của từng cấu trúc.",
    matcher: (q) => STRUCTURE_TERMS.some((term) => textOf(q).includes(term)),
    hasGlossary: true,
  },
  {
    id: "tu-duy-composite-man",
    tag: "Tư duy CO",
    title: "Tư Duy Composite Man",
    description: "Các câu xoay quanh Composite Man/Operator — nhân vật trung tâm xuyên suốt cả cuốn sách.",
    matcher: (q) => /Composite Man|\bCO\b/.test(textOf(q)),
  },
];

export function getStudySet(id: string): StudySet | undefined {
  return STUDY_SETS.find((s) => s.id === id);
}
