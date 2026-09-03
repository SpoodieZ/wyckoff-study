import Link from "next/link";
import { BookText, LineChart, SpellCheck } from "lucide-react";
import AppShell from "@/components/AppShell";
import HeroCarousel from "@/components/HeroCarousel";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import { hasChapterData, loadChapterHeroData } from "@/lib/chapter-data";
import type { ChapterHeroData } from "@/lib/chapter-data";

const STUDY_SETS_PREVIEW = [
  {
    tag: "Lý thuyết",
    icon: BookText,
    title: "Phân Tích Các Giai Đoạn",
    description: "Nhận diện Phase A đến E trong Sơ Đồ Tích Lũy.",
  },
  {
    tag: "Thực hành biểu đồ",
    icon: LineChart,
    title: "Phân Tích Khối Lượng - Biên Độ",
    description: "Liên hệ hành động giá với tín hiệu khối lượng.",
  },
  {
    tag: "Thuật ngữ",
    icon: SpellCheck,
    title: "Thuật Ngữ Cốt Lõi",
    description: "PS, SC, AR, ST, SOS, LPS, BU... được định nghĩa.",
  },
];

export default function Home() {
  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  const heroChapters = chapters
    .filter((c) => c.available)
    .map((c) => loadChapterHeroData(c.id))
    .filter((c): c is ChapterHeroData => c !== null);

  return (
    <AppShell chapters={chapters}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 pb-16 md:p-6 lg:p-10">
        {heroChapters.length > 0 && <HeroCarousel chapters={heroChapters} />}

        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-card-title font-bold text-on-surface">Study Sets</h2>
            <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-caption text-outline">
              Sắp có
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {STUDY_SETS_PREVIEW.map((set) => {
              const Icon = set.icon;
              return (
                <div
                  key={set.title}
                  className="flex cursor-not-allowed flex-col gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-4 opacity-60 shadow-study"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-secondary-container px-2.5 py-1 text-caption font-semibold text-on-secondary-container">
                      {set.tag}
                    </span>
                    <Icon size={18} className="text-outline" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-display text-body-lg font-bold text-on-surface">{set.title}</h3>
                    <p className="mt-1 text-body-md text-on-surface-variant">{set.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-card-title font-bold text-on-surface">Mục lục</h2>
            <p className="text-caption text-outline">42 chương · Phần 1–42</p>
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
                        {chapter.title}
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
                      <span className="truncate font-medium text-on-surface-variant">{chapter.title}</span>
                    </span>
                    <span className="shrink-0 text-caption text-outline">Chưa có dữ liệu</span>
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
