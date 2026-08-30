"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X, Lightbulb, Trophy, RotateCcw } from "lucide-react";
import type { ChapterData, Question } from "@/lib/types";

interface QuestionResult {
  questionId: string;
  correct: boolean;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuizRunner({
  chapter,
  nextChapterHref = "/",
}: {
  chapter: ChapterData;
  nextChapterHref?: string;
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [revealedSample, setRevealedSample] = useState(false);

  const questions = chapter.questions;
  const total = questions.length;
  const question: Question | undefined = questions[index];
  const finished = index >= total;

  const correctCount = useMemo(() => results.filter((r) => r.correct).length, [results]);

  function recordResult(correct: boolean) {
    setResults((prev) => [...prev, { questionId: question!.id, correct }]);
  }

  function goToNext() {
    setIndex((i) => i + 1);
    setSelectedOption(null);
    setShowAnswer(false);
    setRevealedSample(false);
  }

  function handleChoiceClick(optionIndex: number) {
    if (showAnswer) return;
    if (question!.type !== "multiple_choice" && question!.type !== "chart_identify") return;
    setSelectedOption(optionIndex);
    setShowAnswer(true);
    recordResult(optionIndex === question!.correctIndex);
  }

  function handleSelfGrade(correct: boolean) {
    recordResult(correct);
    goToNext();
  }

  function restart() {
    setIndex(0);
    setResults([]);
    setSelectedOption(null);
    setShowAnswer(false);
    setRevealedSample(false);
  }

  if (finished) {
    const wrongOnes = questions.filter((q, i) => results[i] && !results[i].correct);
    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    const progress = total > 0 ? correctCount / total : 0;

    return (
      <div className="mx-auto mt-6 flex max-w-lg flex-col items-center rounded-frame border border-outline-variant bg-surface-container-lowest p-6 text-center shadow-study md:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed">
          <Trophy className="text-primary" size={32} />
        </div>
        <h1 className="mt-4 font-display text-card-title font-bold text-on-surface">Quiz Hoàn Thành</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Bạn đã hoàn thành {chapter.title} — {correctCount}/{total} câu đúng.
        </p>

        <div className="relative mt-8 flex h-40 w-40 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 144 144">
            <circle cx="72" cy="72" r={radius} fill="none" stroke="var(--color-surface-container)" strokeWidth="12" />
            <circle
              cx="72"
              cy="72"
              r={radius}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-display text-3xl font-bold text-on-surface">
              {correctCount}
              <span className="text-lg text-on-surface-variant">/{total}</span>
            </span>
            <span className="text-caption uppercase tracking-wide text-outline">Điểm số</span>
          </div>
        </div>

        {total > 0 && (
          <div className="mt-8 w-full max-w-xs">
            <div className="flex items-end justify-center gap-1.5">
              {questions.map((q, i) => (
                <span
                  key={q.id}
                  className={`mini-candlestick ${
                    results[i]?.correct ? "candlestick-sage" : "candlestick-crimson"
                  }`}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-caption text-outline">
              <span>Q1</span>
              {total > 2 && <span>Q{Math.round(total / 2)}</span>}
              <span>Q{total}</span>
            </div>
          </div>
        )}

        {wrongOnes.length > 0 && (
          <div className="mt-8 w-full text-left">
            <h2 className="mb-2 text-label-sm font-semibold uppercase tracking-wide text-outline">
              Câu cần ôn lại
            </h2>
            <ul className="flex flex-col gap-2">
              {wrongOnes.map((q) => (
                <li
                  key={q.id}
                  className="rounded-card border border-crimson/30 bg-crimson-soft px-3 py-2 text-body-md text-on-surface-variant"
                >
                  {q.prompt}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/review"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-3 text-btn font-semibold text-on-surface transition-colors hover:bg-surface-container"
          >
            <RotateCcw size={18} />
            Ôn lại câu sai
          </Link>
          <Link
            href={nextChapterHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-btn font-semibold text-on-primary shadow-study transition-colors hover:bg-primary-strong"
          >
            Chương tiếp theo
            <ArrowRight size={18} />
          </Link>
        </div>
        <button
          onClick={restart}
          className="mt-4 text-label-sm font-medium text-on-surface-variant hover:text-primary hover:underline"
        >
          Làm lại chương này
        </button>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3 text-on-surface-variant">
          <Link
            href="/"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
            aria-label="Về trang chủ"
          >
            <ArrowLeft size={20} />
          </Link>
          <span className="truncate text-body-md font-medium">{chapter.title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-label-sm font-bold text-primary">
            Câu {index + 1} / {total}
          </span>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-container sm:w-32">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <h2 className="mb-6 text-center font-display text-card-title font-bold text-on-surface">
        {question.prompt}
      </h2>

      {question.chartImage && (
        <div className="mb-8 rounded-frame bg-light-chart-bg p-3 md:p-6">
          <div className="relative overflow-hidden rounded-card bg-dark-chart p-2 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.chartImage}
              alt="Biểu đồ minh họa"
              className="w-full rounded border border-outline-variant/20"
            />
          </div>
        </div>
      )}

      {(question.type === "multiple_choice" || question.type === "chart_identify") && (
        <div className="flex flex-col gap-4">
          {question.options.map((option, i) => {
            const isCorrect = i === question.correctIndex;
            const isSelected = i === selectedOption;
            const isWrongSelected = showAnswer && isSelected && !isCorrect;
            const showCorrectHighlight = showAnswer && isCorrect;

            let borderClasses = "border border-outline-variant hover:border-primary";
            let badgeClasses = "border border-outline-variant bg-surface text-on-surface-variant";
            if (showCorrectHighlight) {
              borderClasses = "border-2 border-sage";
              badgeClasses = "bg-sage text-on-primary";
            } else if (isWrongSelected) {
              borderClasses = "border-2 border-crimson";
              badgeClasses = "bg-crimson text-on-primary";
            } else if (showAnswer) {
              borderClasses = "border border-outline-variant opacity-60";
            }

            return (
              <div key={i} className={`rounded-card bg-surface-container-lowest p-4 shadow-study ${borderClasses}`}>
                <button
                  onClick={() => handleChoiceClick(i)}
                  disabled={showAnswer}
                  className="flex w-full items-center gap-4 text-left disabled:cursor-default"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-body-md ${badgeClasses}`}
                  >
                    {showCorrectHighlight ? (
                      <Check size={20} />
                    ) : isWrongSelected ? (
                      <X size={20} />
                    ) : (
                      OPTION_LETTERS[i]
                    )}
                  </span>
                  <span className="text-body-lg text-on-surface">{option}</span>
                </button>

                {(showCorrectHighlight || isWrongSelected) && isSelected && (
                  <div className="mt-4 rounded-card bg-light-chart-bg p-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="mt-1 shrink-0 text-primary" size={20} />
                      <div>
                        <h4
                          className={`mb-1 text-label-sm font-bold ${isCorrect ? "text-sage" : "text-crimson"}`}
                        >
                          {isCorrect ? "Chính xác!" : "Chưa đúng"}
                        </h4>
                        <p className="text-body-md text-on-surface-variant">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {showAnswer && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={goToNext}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-btn font-semibold text-on-primary shadow-study transition-colors hover:bg-primary-strong"
              >
                {index + 1 === total ? "Xem kết quả" : "Câu tiếp theo"}
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {question.type === "short_answer_selfgrade" && (
        <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-6 shadow-study">
          <p className="text-body-md text-on-surface-variant">
            Tự trả lời trong đầu (hoặc viết ra giấy), sau đó bấm để xem gợi ý đáp án.
          </p>

          {!revealedSample ? (
            <button
              onClick={() => setRevealedSample(true)}
              className="mt-4 rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-3 text-btn font-semibold text-on-surface transition-colors hover:bg-surface-container"
            >
              Xem gợi ý đáp án
            </button>
          ) : (
            <>
              <div className="mt-4 rounded-card bg-light-chart-bg p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-1 shrink-0 text-primary" size={20} />
                  <div>
                    <h4 className="mb-1 text-label-sm font-bold text-primary">Gợi ý đáp án</h4>
                    <p className="text-body-md text-on-surface-variant">{question.sampleAnswer}</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-body-md text-on-surface-variant">Bạn tự đánh giá câu trả lời của mình:</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  onClick={() => handleSelfGrade(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-sage bg-sage-soft px-5 py-2.5 text-btn font-semibold text-sage transition-colors hover:brightness-95"
                >
                  <Check size={18} />
                  Tôi trả lời đúng
                </button>
                <button
                  onClick={() => handleSelfGrade(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-crimson bg-crimson-soft px-5 py-2.5 text-btn font-semibold text-crimson transition-colors hover:brightness-95"
                >
                  <X size={18} />
                  Tôi trả lời chưa đúng
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
