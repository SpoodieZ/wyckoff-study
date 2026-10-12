import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import GlossarySection from "@/components/GlossarySection";
import QuizRunner from "@/app/chapters/[id]/QuizRunner";
import { loadStudySetChapterData } from "@/lib/chapter-data";
import { getStudySet } from "@/lib/study-sets";
import { getLocale } from "@/lib/i18n/server";
import { makeT } from "@/lib/i18n/translate";

// Mỗi lượt vào trang sẽ random lại 15 câu — bắt buộc render động, nếu không
// Next sẽ tĩnh hóa và "random" chỉ chạy đúng 1 lần lúc build.
export const dynamic = "force-dynamic";

const SET_SIZE = 15;

export default async function StudySetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const set = getStudySet(id);
  if (!set) notFound();

  const locale = await getLocale();
  const t = makeT(locale);
  const chapterData = loadStudySetChapterData(set, SET_SIZE, locale);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl p-4 pb-24 md:p-6 lg:p-10">
        {set.hasGlossary && (
          <GlossarySection locale={locale} />
        )}
        {chapterData.questions.length > 0 ? (
          <QuizRunner chapter={chapterData} nextChapterHref="/study-sets" />
        ) : (
          <p className="text-body-md text-on-surface-variant">{t("sets.empty")}</p>
        )}
      </div>
    </AppShell>
  );
}
