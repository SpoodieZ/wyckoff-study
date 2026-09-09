import { hasChapterData, loadDailyChallenge } from "@/lib/chapter-data";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import AppShell from "@/components/AppShell";
import QuizRunner from "../chapters/[id]/QuizRunner";

// Bộ câu hỏi phụ thuộc vào ngày hiện tại (giờ VN) — bắt buộc render động mỗi
// request, nếu không Next sẽ tĩnh hóa trang này và "hôm nay" bị đóng băng
// theo đúng lúc build/deploy thay vì đổi mới mỗi ngày.
export const dynamic = "force-dynamic";

const DAILY_CHALLENGE_SIZE = 5;

export default async function DailyChallengePage() {
  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  const dailyChapter = loadDailyChallenge(DAILY_CHALLENGE_SIZE);

  return (
    <AppShell chapters={chapters}>
      <div className="mx-auto w-full max-w-5xl p-4 pb-24 md:p-6 lg:p-10">
        <QuizRunner chapter={dailyChapter} nextChapterHref="/" />
      </div>
    </AppShell>
  );
}
