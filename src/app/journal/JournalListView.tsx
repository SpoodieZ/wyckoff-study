"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, MessageSquare, Plus, Search } from "lucide-react";
import type { JournalEntry, TradeOutcome } from "@/lib/journal-types";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function OutcomeBadge({ outcome }: { outcome: TradeOutcome }) {
  return outcome === "win" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-2.5 py-1 text-caption font-bold text-sage">
      <span className="mini-candlestick candlestick-sage" />
      Lãi
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-soft px-2.5 py-1 text-caption font-bold text-crimson">
      <span className="mini-candlestick candlestick-crimson" />
      Lỗ
    </span>
  );
}

export default function JournalListView({
  entries,
  profileNames,
  commentCounts,
  currentUserId,
  canWrite,
}: {
  entries: JournalEntry[];
  profileNames: Record<string, string>;
  commentCounts: Record<string, number>;
  currentUserId: string;
  canWrite: boolean;
}) {
  const [tab, setTab] = useState<"mine" | "teammate">("mine");
  const [search, setSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | TradeOutcome>("all");

  const mine = useMemo(() => entries.filter((e) => e.owner_id === currentUserId), [entries, currentUserId]);
  const teammate = useMemo(
    () => entries.filter((e) => e.owner_id !== currentUserId),
    [entries, currentUserId]
  );

  const activeList = tab === "mine" ? mine : teammate;

  const filtered = useMemo(
    () =>
      activeList.filter((e) => {
        const matchesSearch = e.symbol.toLowerCase().includes(search.trim().toLowerCase());
        const matchesOutcome = outcomeFilter === "all" || e.outcome === outcomeFilter;
        return matchesSearch && matchesOutcome;
      }),
    [activeList, search, outcomeFilter]
  );

  const teammateName = teammate[0] ? profileNames[teammate[0].owner_id] : "đồng đội";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 pb-16 md:p-6 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-card-title font-bold text-on-surface">Nhật ký giao dịch</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Không gian đúc kết bài học thực chiến giữa 2 thành viên.
          </p>
        </div>
        {canWrite ? (
          <Link
            href="/journal/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-btn font-semibold text-on-primary transition-colors hover:bg-primary-strong"
          >
            <Plus size={18} />
            Thêm bài học mới
          </Link>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-label-sm text-on-surface-variant">
            Chế độ chỉ xem — liên hệ quản trị viên để được cấp quyền
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-lowest p-1">
          <button
            onClick={() => setTab("mine")}
            className={`rounded-full px-4 py-2 text-label-sm font-semibold transition-colors ${
              tab === "mine" ? "bg-primary-fixed text-primary" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            Nhật ký của tôi
            <span className="ml-2 rounded-full bg-surface-container-high px-2 py-0.5 text-caption">
              {mine.length}
            </span>
          </button>
          <button
            onClick={() => setTab("teammate")}
            className={`rounded-full px-4 py-2 text-label-sm font-semibold transition-colors ${
              tab === "teammate"
                ? "bg-primary-fixed text-primary"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            Nhật ký đồng đội
            <span className="ml-2 rounded-full bg-surface-container-high px-2 py-0.5 text-caption">
              {teammate.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã (BTC, EURUSD...)"
              className="rounded-control border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-label-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-1 rounded-control border border-outline-variant bg-surface-container-lowest p-1">
            {(["all", "win", "loss"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setOutcomeFilter(value)}
                className={`rounded px-3 py-1 text-caption font-semibold transition-colors ${
                  outcomeFilter === value
                    ? "bg-surface-container-high text-on-surface"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {value === "all" ? "Tất cả" : value === "win" ? "Lãi" : "Lỗ"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-frame border border-outline-variant bg-surface-container-lowest p-10 text-center shadow-study">
          <p className="text-body-lg text-on-surface-variant">
            {tab === "mine" ? "Bạn chưa có bài học nào." : `${teammateName} chưa có bài học nào.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((entry) => (
            <Link
              key={entry.id}
              href={`/journal/${entry.id}`}
              className="flex flex-col justify-between rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study transition-colors hover:border-primary"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-display text-headline-md font-bold text-on-surface">{entry.symbol}</h3>
                  <OutcomeBadge outcome={entry.outcome} />
                </div>
                <p className="mb-3 flex items-center gap-1.5 text-caption text-outline">
                  <Calendar size={14} />
                  {formatDate(entry.trade_date)}
                </p>

                {entry.image_urls[0] && (
                  <div className="mb-3 overflow-hidden rounded-frame bg-light-chart-bg p-3">
                    <div className="overflow-hidden rounded-card bg-dark-chart">
                      {/* eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage URL, unknown at build time */}
                      <img
                        src={entry.image_urls[0]}
                        alt={`Biểu đồ ${entry.symbol}`}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <p className="text-caption font-semibold uppercase tracking-wide text-primary">Đúc kết bài học:</p>
                <p className="line-clamp-2 text-body-md text-on-surface-variant">
                  {entry.lesson || "Chưa ghi bài học."}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-3 text-caption text-outline">
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={14} />
                  {commentCounts[entry.id] ?? 0} bình luận
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
