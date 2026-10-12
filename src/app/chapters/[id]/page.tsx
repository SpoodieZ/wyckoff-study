import Link from "next/link";
import { notFound } from "next/navigation";
import { loadChapterData, hasChapterData } from "@/lib/chapter-data";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import AppShell from "@/components/AppShell";
import QuizRunner from "./QuizRunner";
import { getLocale } from "@/lib/i18n/server";
import { makeT } from "@/lib/i18n/translate";

export default async function ChapterQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapterId = Number(id);

  if (!Number.isInteger(chapterId) || !CHAPTERS_META.some((c) => c.id === chapterId)) {
    notFound();
  }

  const locale = await getLocale();
  const t = makeT(locale);
  const chapterData = loadChapterData(chapterId, locale);

  if (!chapterData) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-5xl p-4 pb-16 md:p-6 lg:p-10">
          <Link href="/" className="text-btn text-primary hover:underline">
            ← {t("quiz.backHome")}
          </Link>
          <p className="mt-6 text-on-surface-variant">{t("common.noData")}</p>
        </div>
      </AppShell>
    );
  }

  const nextChapterHref = hasChapterData(chapterId + 1) ? `/chapters/${chapterId + 1}` : "/";

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl p-4 pb-24 md:p-6 lg:p-10">
        <QuizRunner chapter={chapterData} nextChapterHref={nextChapterHref} />
      </div>
    </AppShell>
  );
}
