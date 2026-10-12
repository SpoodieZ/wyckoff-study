import type { Question } from "./types";
import type { MessageKey } from "./i18n/messages";

export interface StudySet {
  id: string;
  tagKey: MessageKey;
  titleKey: MessageKey;
  descriptionKey: MessageKey;
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
    tagKey: "set.chart.tag",
    titleKey: "set.chart.title",
    descriptionKey: "set.chart.desc",
    matcher: (q) => q.type === "chart_identify",
  },
  {
    id: "cau-truc-thuat-ngu",
    tagKey: "set.terms.tag",
    titleKey: "set.terms.title",
    descriptionKey: "set.terms.desc",
    matcher: (q) => STRUCTURE_TERMS.some((term) => textOf(q).includes(term)),
    hasGlossary: true,
  },
  {
    id: "tu-duy-composite-man",
    tagKey: "set.co.tag",
    titleKey: "set.co.title",
    descriptionKey: "set.co.desc",
    matcher: (q) => /Composite Man|\bCO\b/.test(textOf(q)),
  },
];

export function getStudySet(id: string): StudySet | undefined {
  return STUDY_SETS.find((s) => s.id === id);
}
