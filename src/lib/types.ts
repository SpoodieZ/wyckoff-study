export type QuestionType = "multiple_choice" | "chart_identify" | "short_answer_selfgrade";

interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  chartImage: string | null;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: "multiple_choice" | "chart_identify";
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: "short_answer_selfgrade";
  sampleAnswer: string;
}

export type Question = ChoiceQuestion | ShortAnswerQuestion;

export interface ChapterData {
  chapterId: number;
  title: string;
  summary: string;
  questions: Question[];
}

export interface ChapterMeta {
  id: number;
  title: string;
}
