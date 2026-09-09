import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import GlossarySection from "@/components/GlossarySection";
import QuizRunner from "@/app/chapters/[id]/QuizRunner";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import { hasChapterData, loadStudySetChapterData } from "@/lib/chapter-data";
import { getStudySet } from "@/lib/study-sets";
import { ACCUMULATION_GLOSSARY, DISTRIBUTION_GLOSSARY } from "@/lib/glossary";

// Mỗi lượt vào trang sẽ random lại 15 câu — bắt buộc render động, nếu không
// Next sẽ tĩnh hóa và "random" chỉ chạy đúng 1 lần lúc build.
export const dynamic = "force-dynamic";

const SET_SIZE = 15;

export default async function StudySetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const set = getStudySet(id);
  if (!set) notFound();

  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  const chapterData = loadStudySetChapterData(set, SET_SIZE);

  return (
    <AppShell chapters={chapters}>
      <div className="mx-auto w-full max-w-5xl p-4 pb-24 md:p-6 lg:p-10">
        {set.hasGlossary && (
          <GlossarySection accumulation={ACCUMULATION_GLOSSARY} distribution={DISTRIBUTION_GLOSSARY} />
        )}
        {chapterData.questions.length > 0 ? (
          <QuizRunner chapter={chapterData} nextChapterHref="/study-sets" />
        ) : (
          <p className="text-body-md text-on-surface-variant">Chưa tìm được câu hỏi nào cho bộ này.</p>
        )}
      </div>
    </AppShell>
  );
}
