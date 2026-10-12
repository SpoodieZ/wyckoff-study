import { Sparkles } from "lucide-react";
import AppShell from "@/components/AppShell";
import { CHAPTERS_META, chapterTitle } from "@/lib/chapters-meta";
import { getLocale } from "@/lib/i18n/server";
import { makeT } from "@/lib/i18n/translate";
import { hasChapterData } from "@/lib/chapter-data";
import { SAMPLE_CHAPTER_PROGRESS, SAMPLE_OVERVIEW } from "@/lib/sample-progress";

export default async function ProgressPage() {
  const locale = await getLocale();
  const t = makeT(locale);
  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  const progressByChapterId = new Map(SAMPLE_CHAPTER_PROGRESS.map((p) => [p.chapterId, p]));

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 pb-16 md:p-6 lg:p-10">
        <div>
          <h1 className="font-display text-card-title font-bold text-on-surface">{t("progress.title")}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {t("progress.subtitle")}
          </p>
        </div>

        <p className="flex items-center gap-1.5 text-caption text-outline">
          <Sparkles size={14} />
          {t("progress.sample")}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study">
            <p className="text-caption uppercase tracking-wide text-outline">{t("progress.started")}</p>
            <p className="mt-1 font-display text-3xl font-bold text-on-surface">
              {SAMPLE_OVERVIEW.chaptersStarted}
              <span className="text-lg text-on-surface-variant">/{CHAPTERS_META.length}</span>
            </p>
          </div>
          <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study">
            <p className="text-caption uppercase tracking-wide text-outline">{t("progress.avg")}</p>
            <p className="mt-1 font-display text-3xl font-bold text-primary">{SAMPLE_OVERVIEW.averageMastery}%</p>
          </div>
          <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study">
            <p className="text-caption uppercase tracking-wide text-outline">{t("progress.answered")}</p>
            <p className="mt-1 font-display text-3xl font-bold text-on-surface">{SAMPLE_OVERVIEW.questionsAnswered}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {chapters.map((chapter) => {
            const progress = progressByChapterId.get(chapter.id);
            return (
              <div
                key={chapter.id}
                className={`flex flex-col gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study sm:flex-row sm:items-center sm:justify-between ${
                  !chapter.available ? "opacity-60" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-label-sm font-semibold text-on-surface-variant">
                    {chapter.id}
                  </span>
                  <span className="truncate font-medium text-on-surface">{chapterTitle(chapter, locale)}</span>
                </div>

                {chapter.available && progress ? (
                  <div className="flex items-center gap-4 sm:w-64">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progress.masteryPercent}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-label-sm font-semibold text-on-surface">
                      {progress.masteryPercent}%
                    </span>
                  </div>
                ) : (
                  <span className="shrink-0 text-caption text-outline">{t("common.noData")}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
