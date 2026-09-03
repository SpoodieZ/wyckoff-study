"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ChapterHeroData } from "@/lib/chapter-data";

const STORAGE_KEY = "wyckoff-hero-chapter";

function DecorativeCandles() {
  return (
    <div className="relative flex h-48 w-full items-end justify-around rounded-card bg-dark-chart p-3">
      <div className="relative h-12 w-4 bg-crimson before:absolute before:-top-4 before:left-1/2 before:h-20 before:w-px before:-translate-x-1/2 before:bg-crimson before:content-['']" />
      <div className="relative h-8 w-4 bg-sage before:absolute before:-top-2 before:left-1/2 before:h-16 before:w-px before:-translate-x-1/2 before:bg-sage before:content-['']" />
      <div className="relative h-16 w-4 bg-crimson before:absolute before:-top-6 before:left-1/2 before:h-24 before:w-px before:-translate-x-1/2 before:bg-crimson before:content-['']" />
      <div className="relative h-24 w-4 bg-sage before:absolute before:-bottom-4 before:left-1/2 before:h-32 before:w-px before:-translate-x-1/2 before:bg-sage before:content-['']" />
      <div className="relative h-32 w-4 bg-sage before:absolute before:-bottom-8 before:left-1/2 before:h-48 before:w-px before:-translate-x-1/2 before:bg-sage before:content-['']" />
    </div>
  );
}

export default function HeroCarousel({ chapters }: { chapters: ChapterHeroData[] }) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage: the server can't know the last
    // viewed chapter, so restoring it after mount (rather than in the
    // initial useState) is required.
    const savedId = Number(window.localStorage.getItem(STORAGE_KEY));
    const savedIdx = chapters.findIndex((c) => c.id === savedId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedIdx >= 0) setIndex(savedIdx);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const current = chapters[index];
    if (current) window.localStorage.setItem(STORAGE_KEY, String(current.id));
  }, [hydrated, index, chapters]);

  function goTo(next: number) {
    setIndex(Math.max(0, Math.min(chapters.length - 1, next)));
  }

  function handlePointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    setDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging || !trackRef.current) return;
    const width = trackRef.current.offsetWidth || 1;
    const delta = e.clientX - dragStartX.current;
    setDragOffset((delta / width) * 100);
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);
    const threshold = 12;
    if (dragOffset < -threshold) goTo(index + 1);
    else if (dragOffset > threshold) goTo(index - 1);
    setDragOffset(0);
  }

  if (chapters.length === 0) return null;

  const translatePercent = -(index * 100) + dragOffset;

  return (
    <section className="relative overflow-hidden rounded-frame border border-primary-fixed bg-light-chart-bg shadow-study">
      <p className="mb-2 mt-6 px-6 text-label-sm font-medium uppercase tracking-wider text-primary lg:px-10">
        Bắt đầu ôn tập
      </p>

      <div
        ref={trackRef}
        className="touch-pan-y cursor-grab select-none overflow-hidden active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${translatePercent}%)`,
            transition: dragging ? "none" : "transform 300ms ease",
          }}
        >
          {chapters.map((chapter) => (
            <div key={chapter.id} className="flex w-full shrink-0 flex-col gap-10 px-6 pb-6 lg:flex-row lg:items-center lg:px-10 lg:pb-10">
              <div className="z-10 min-w-0 flex-1">
                <h1 className="font-display text-[24px] leading-8 font-bold text-on-surface md:text-display-title">
                  Chương {chapter.id} — {chapter.title}
                </h1>
                <p className="mb-6 mt-4 max-w-xl text-body-md text-on-surface-variant md:text-body-lg">
                  {chapter.summary}
                </p>
                <Link
                  href={`/chapters/${chapter.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-btn font-semibold text-on-primary shadow-study transition-colors hover:bg-primary-strong"
                >
                  Bắt đầu học
                  <ArrowRight size={18} />
                </Link>
              </div>
              <div className="hidden w-64 shrink-0 lg:block">
                {chapter.chartImage ? (
                  <div className="rounded-frame bg-light-chart-bg p-2">
                    <div className="overflow-hidden rounded-card bg-dark-chart p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={chapter.chartImage}
                        alt={`Minh họa Chương ${chapter.id}`}
                        loading="lazy"
                        className="h-44 w-full rounded object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <DecorativeCandles />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {chapters.length > 1 && (
        <div className="flex items-center justify-between px-6 pb-6 lg:px-10 lg:pb-10">
          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Chương trước"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface transition-colors hover:bg-surface-container disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-label-sm font-medium text-on-surface-variant">
            Chương {index + 1} / {chapters.length}
          </span>

          <button
            onClick={() => goTo(index + 1)}
            disabled={index === chapters.length - 1}
            aria-label="Chương tiếp theo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface transition-colors hover:bg-surface-container disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
