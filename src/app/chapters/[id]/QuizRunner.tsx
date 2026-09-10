"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X, Lightbulb, Trophy, RotateCcw, Flame, Crown, Award } from "lucide-react";
import type { ChapterData, Question } from "@/lib/types";
import { recordStudyActivity, getStudyStreak } from "@/lib/streak";
import {
  BADGES,
  type Badge,
  getAchievementStats,
  getUnlockedBadgeIds,
  recordChapterCompleted,
  recordChapterPerfect,
  recordBossCleared,
} from "@/lib/achievements";
import { saveMistakeNote } from "@/lib/mistake-notes";
import { saveQuizProgress, getQuizProgress, clearQuizProgress } from "@/lib/quiz-progress";

type Confidence = "guess" | "medium" | "high";

interface QuestionResult {
  questionId: string;
  correct: boolean;
  confidence?: Confidence;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

const CONFIDENCE_LEVELS: { value: Confidence; label: string }[] = [
  { value: "guess", label: "Đoán bừa" },
  { value: "medium", label: "Khá chắc" },
  { value: "high", label: "Chắc chắn" },
];

function confidenceFeedback(correct: boolean, level: Confidence | null): string | null {
  if (!level) return null;
  if (level === "high") {
    return correct ? "Chuẩn không cần chỉnh!" : "Sai dù rất tự tin — đây là dấu hiệu nên xem lại kỹ khái niệm này.";
  }
  if (level === "guess") {
    return correct
      ? "Đúng, nhưng có vẻ là may mắn — ôn lại khái niệm này cho chắc nhé."
      : "Đoán sai cũng không sao, đây chính là lúc để học.";
  }
  return correct ? "Tốt, bạn đã đọc khá kỹ." : "Gần đúng rồi, xem lại phần giải thích bên dưới.";
}

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
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [revealedSample, setRevealedSample] = useState(false);
  const [streak, setStreak] = useState(0);
  const [mistakeNote, setMistakeNote] = useState("");
  const [newlyUnlocked, setNewlyUnlocked] = useState<Badge[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const questions = chapter.questions;
  const total = questions.length;
  const question: Question | undefined = questions[index];
  const finished = index >= total;
  const isBossQuestion = total > 1 && index === total - 1;

  const correctCount = useMemo(() => results.filter((r) => r.correct).length, [results]);

  useEffect(() => {
    // Khôi phục lượt làm bài dang dở (nếu có) đúng chương này — chỉ áp dụng
    // cho chương thật, không phải bộ câu hỏi ngẫu nhiên (Thử thách/Study Set).
    if (chapter.chapterId > 0) {
      const saved = getQuizProgress();
      if (saved && saved.chapterId === chapter.chapterId && saved.total === total && saved.results.length < total) {
        let trailingStreak = 0;
        for (let i = saved.results.length - 1; i >= 0; i--) {
          if (saved.results[i].correct) trailingStreak++;
          else break;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIndex(saved.results.length);
        setResults(saved.results as QuestionResult[]);
        setStreak(trailingStreak);
      }
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated || chapter.chapterId <= 0 || finished) return;
    saveQuizProgress({ chapterId: chapter.chapterId, total, results });
  }, [hydrated, chapter.chapterId, total, results, finished]);

  useEffect(() => {
    if (!finished || total === 0 || chapter.chapterId <= 0) return;
    clearQuizProgress();
    const before = getUnlockedBadgeIds(getAchievementStats(getStudyStreak()));

    recordChapterCompleted(chapter.chapterId);
    if (correctCount === total) recordChapterPerfect(chapter.chapterId);
    if (results[total - 1]?.correct) recordBossCleared(chapter.chapterId);

    const after = getUnlockedBadgeIds(getAchievementStats(getStudyStreak()));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNewlyUnlocked(BADGES.filter((b) => !before.has(b.id) && after.has(b.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  function recordResult(correct: boolean, level?: Confidence) {
    setResults((prev) => [...prev, { questionId: question!.id, correct, confidence: level }]);
    setStreak((s) => (correct ? s + 1 : 0));
    recordStudyActivity();
  }

  function goToNext() {
    setIndex((i) => i + 1);
    setSelectedOption(null);
    setConfidence(null);
    setShowAnswer(false);
    setRevealedSample(false);
    setMistakeNote("");
  }

  function handleChoiceClick(optionIndex: number) {
    if (showAnswer || selectedOption !== null) return;
    if (question!.type !== "multiple_choice" && question!.type !== "chart_identify") return;
    setSelectedOption(optionIndex);
  }

  function confirmConfidence(level: Confidence) {
    if (selectedOption === null || showAnswer) return;
    if (question!.type !== "multiple_choice" && question!.type !== "chart_identify") return;
    setConfidence(level);
    setShowAnswer(true);
    recordResult(selectedOption === question!.correctIndex, level);
  }

  function handleSelfGrade(correct: boolean) {
    recordResult(correct);
    goToNext();
  }

  function restart() {
    if (chapter.chapterId > 0) clearQuizProgress();
    setIndex(0);
    setResults([]);
    setSelectedOption(null);
    setConfidence(null);
    setShowAnswer(false);
    setRevealedSample(false);
    setStreak(0);
    setMistakeNote("");
    setNewlyUnlocked([]);
  }

  if (finished) {
    const wrongOnes = questions.filter((q, i) => results[i] && !results[i].correct);
    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    const progress = total > 0 ? correctCount / total : 0;

    const equityValues = results.reduce<number[]>((acc, r) => {
      const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(prev + (r.correct ? 1 : -1));
      return acc;
    }, []);
    const equityMin = Math.min(0, ...equityValues);
    const equityMax = Math.max(0, ...equityValues);
    const equityRange = equityMax - equityMin || 1;
    const equityWidth = Math.max(1, total - 1) * 100;
    const equityY = (v: number) => 90 - ((v - equityMin) / equityRange) * 80;
    const equityPoints = equityValues.map((v, i) => `${i * 100},${equityY(v)}`).join(" ");

    return (
      <div className="mx-auto mt-6 flex max-w-lg flex-col items-center rounded-frame border border-outline-variant bg-surface-container-lowest p-6 text-center shadow-study md:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed">
          <Trophy className="text-primary" size={32} />
        </div>
        <h1 className="mt-4 font-display text-card-title font-bold text-on-surface">Quiz Hoàn Thành</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Bạn đã hoàn thành {chapter.title} — {correctCount}/{total} câu đúng.
        </p>

        {total > 1 && results[total - 1]?.correct && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1.5 text-label-sm font-bold text-primary">
            <Crown size={16} />
            Đã hạ Câu Boss!
          </span>
        )}

        {newlyUnlocked.length > 0 && (
          <div className="mt-4 flex w-full flex-col items-center gap-2 rounded-card border border-primary-fixed bg-light-chart-bg p-4">
            <p className="flex items-center gap-1.5 text-label-sm font-bold text-primary">
              <Award size={16} />
              Vừa mở khóa huy hiệu mới!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {newlyUnlocked.map((b) => (
                <span
                  key={b.id}
                  className="rounded-full bg-primary px-3 py-1 text-label-sm font-semibold text-on-primary"
                >
                  {b.title}
                </span>
              ))}
            </div>
          </div>
        )}

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
                  style={{ animationDelay: `${i * 60}ms` }}
                  className={`mini-candlestick result-candle ${
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

        {total > 1 && (
          <div className="mt-6 w-full max-w-xs">
            <p className="mb-2 text-label-sm font-semibold uppercase tracking-wide text-outline">
              Diễn biến điểm số
            </p>
            <svg viewBox={`0 0 ${equityWidth} 100`} preserveAspectRatio="none" className="h-20 w-full">
              <line
                x1="0"
                y1={equityY(0)}
                x2={equityWidth}
                y2={equityY(0)}
                stroke="var(--color-outline-variant)"
                strokeWidth="1"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                points={equityPoints}
              />
              {equityValues.map((v, i) => (
                <circle
                  key={i}
                  cx={i * 100}
                  cy={equityY(v)}
                  r="4"
                  fill={results[i]?.correct ? "var(--color-sage)" : "var(--color-crimson)"}
                />
              ))}
            </svg>
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
          {streak >= 2 && (
            <span
              key={streak}
              className="streak-badge flex items-center gap-1 rounded-full bg-crimson-soft px-2.5 py-1 text-label-sm font-bold text-crimson"
            >
              <Flame size={14} />
              {streak}
            </span>
          )}
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

      {isBossQuestion && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-full bg-primary-fixed px-4 py-2 text-label-sm font-bold text-primary">
          <Crown size={16} />
          Câu Quyết Định — Tổng Hợp Chương
        </div>
      )}

      <h2 className="mb-6 text-center font-display text-card-title font-bold text-on-surface">
        {question.prompt}
      </h2>

      {question.chartImage && (
        <div
          key={question.id}
          className="mb-8 rounded-frame bg-light-chart-bg p-3 md:p-6"
        >
          <div className="chart-reveal relative overflow-hidden rounded-card bg-dark-chart p-2 shadow-sm">
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

            const isLockedIn = isSelected && !showAnswer;

            let borderClasses = "border border-outline-variant hover:border-primary";
            let badgeClasses = "border border-outline-variant bg-surface text-on-surface-variant";
            let badgeAnimClasses = "";
            if (showCorrectHighlight) {
              borderClasses = "border-2 border-sage";
              badgeClasses = "bg-sage text-on-primary";
              badgeAnimClasses = "answer-badge-correct";
            } else if (isWrongSelected) {
              borderClasses = "border-2 border-crimson";
              badgeClasses = "bg-crimson text-on-primary";
              badgeAnimClasses = "answer-badge-wrong";
            } else if (showAnswer) {
              borderClasses = "border border-outline-variant opacity-60";
            } else if (isLockedIn) {
              borderClasses = "border-2 border-primary";
              badgeClasses = "bg-primary text-on-primary";
            }

            return (
              <div key={i} className={`rounded-card bg-surface-container-lowest p-4 shadow-study ${borderClasses}`}>
                <button
                  onClick={() => handleChoiceClick(i)}
                  disabled={showAnswer || selectedOption !== null}
                  className="flex w-full items-center gap-4 text-left disabled:cursor-default"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-body-md ${badgeClasses} ${badgeAnimClasses}`}
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
                          {confidenceFeedback(isCorrect, confidence) && (
                            <span className="ml-1 font-normal text-on-surface-variant">
                              — {confidenceFeedback(isCorrect, confidence)}
                            </span>
                          )}
                        </h4>
                        <p className="text-body-md text-on-surface-variant">{question.explanation}</p>
                      </div>
                    </div>

                    {isWrongSelected && (
                      <div className="mt-3">
                        <label className="mb-1 block text-label-sm font-medium text-on-surface-variant">
                          Bạn nghĩ vì sao mình chọn nhầm? (tuỳ chọn, riêng tư — chỉ lưu trên máy bạn)
                        </label>
                        <textarea
                          value={mistakeNote}
                          onChange={(e) => setMistakeNote(e.target.value)}
                          onBlur={() => saveMistakeNote(question.id, mistakeNote)}
                          rows={2}
                          placeholder="Ví dụ: mình nhầm giữa Spring và Shakeout…"
                          className="w-full rounded-control border border-outline-variant bg-surface-container-lowest p-2 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {selectedOption !== null && !showAnswer && (
            <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study">
              <p className="mb-3 text-body-md font-medium text-on-surface">Bạn tự tin bao nhiêu với lựa chọn này?</p>
              <div className="flex flex-wrap gap-2">
                {CONFIDENCE_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => confirmConfidence(level.value)}
                    className="rounded-full border border-outline-variant bg-surface px-4 py-2 text-btn font-semibold text-on-surface transition-colors hover:border-primary hover:text-primary"
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
