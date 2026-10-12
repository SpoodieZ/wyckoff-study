import Link from "next/link";
import { NotebookPen } from "lucide-react";
import AppShell from "@/components/AppShell";
import HeroCarousel from "@/components/HeroCarousel";
import DailyChallengeCard from "@/components/DailyChallengeCard";
import { CHAPTERS_META, chapterTitle } from "@/lib/chapters-meta";
import { getLocale } from "@/lib/i18n/server";
import { makeT } from "@/lib/i18n/translate";
import { hasChapterData, loadChapterHeroData } from "@/lib/chapter-data";
import type { ChapterHeroData } from "@/lib/chapter-data";
import { listProfileNames, listRecentJournalEntries } from "@/lib/journal";

function formatTradeDate(dateStr: string) {
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}

export default async function Home() {
  const locale = await getLocale();
  const t = makeT(locale);
  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  const heroChapters = chapters
    .filter((c) => c.available)
    .map((c) => loadChapterHeroData(c.id, locale))
    .filter((c): c is ChapterHeroData => c !== null);

  // Trang chủ phải luôn hiển thị được kể cả khi Supabase gặp sự cố (mất
  // mạng, project bị tạm dừng/xóa...) — phần Nhật Ký chỉ là preview, không
  // đáng để kéo sập cả trang.
  let recentEntries: Awaited<ReturnType<typeof listRecentJournalEntries>> = [];
  let profileNames: Awaited<ReturnType<typeof listProfileNames>> = {};
  try {
    [recentEntries, profileNames] = await Promise.all([listRecentJournalEntries(3), listProfileNames()]);
  } catch {
    // Bỏ qua — phần Nhật Ký sẽ hiện trạng thái rỗng thay vì làm sập trang.
  }

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 pb-16 md:p-6 lg:p-10">
        {heroChapters.length > 0 && <HeroCarousel chapters={heroChapters} />}

        <DailyChallengeCard />

        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-card-title font-bold text-on-surface">{t("home.journalTitle")}</h2>
            <Link
              href="/journal"
              className="text-label-sm font-medium text-primary hover:text-primary-strong"
            >
              {t("common.viewAll")}
            </Link>
          </div>
          {recentEntries.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {recentEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/journal/${entry.id}`}
                  className="group flex flex-col gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study transition-colors hover:border-primary"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-1 text-caption font-semibold ${
                        entry.outcome === "win" ? "bg-sage-soft text-sage" : "bg-crimson-soft text-crimson"
                      }`}
                    >
                      {entry.outcome === "win" ? t("common.win") : t("common.loss")}
                    </span>
                    <span className="text-caption text-outline">{formatTradeDate(entry.trade_date)}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-body-lg font-bold text-on-surface group-hover:text-primary">
                      {entry.symbol}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-body-md text-on-surface-variant">
                      {entry.lesson || t("home.noLesson")}
                    </p>
                  </div>
                  <span className="text-caption text-outline">
                    {profileNames[entry.owner_id] ?? t("home.anonymous")}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center">
              <NotebookPen size={24} className="text-outline" strokeWidth={1.75} />
              <p className="text-body-md text-on-surface-variant">{t("home.journalEmpty")}</p>
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-card-title font-bold text-on-surface">{t("home.tocTitle")}</h2>
            <p className="text-caption text-outline">{t("home.tocCount")}</p>
          </div>

          <ul className="flex flex-col gap-2">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                {chapter.available ? (
                  <Link
                    href={`/chapters/${chapter.id}`}
                    className="group flex items-center justify-between gap-4 rounded-card border border-outline-variant bg-surface-container-lowest px-4 py-3 shadow-study transition-colors hover:border-primary"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-label-sm font-semibold text-on-primary">
                        {chapter.id}
                      </span>
                      <span className="truncate font-medium text-on-surface group-hover:text-primary">
                        {chapterTitle(chapter, locale)}
                      </span>
                    </span>
                    <span className="mini-candlestick candlestick-sage shrink-0" />
                  </Link>
                ) : (
                  <div className="flex items-center justify-between gap-4 rounded-card border border-outline-variant bg-surface-container-lowest px-4 py-3 opacity-60">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-label-sm font-semibold text-on-surface-variant">
                        {chapter.id}
                      </span>
                      <span className="truncate font-medium text-on-surface-variant">{chapterTitle(chapter, locale)}</span>
                    </span>
                    <span className="shrink-0 text-caption text-outline">{t("common.noData")}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
