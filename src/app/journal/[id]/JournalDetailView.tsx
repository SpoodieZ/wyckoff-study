"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Lightbulb, Loader2, MessageSquare, Pencil, Trash2 } from "lucide-react";
import type { JournalComment, JournalEntry } from "@/lib/journal-types";
import { addJournalComment, deleteJournalEntry } from "../actions";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export default function JournalDetailView({
  entry,
  comments: initialComments,
  profileNames,
  currentUserId,
  canWrite,
}: {
  entry: JournalEntry;
  comments: JournalComment[];
  profileNames: Record<string, string>;
  currentUserId: string;
  canWrite: boolean;
}) {
  const router = useRouter();
  const isOwner = entry.owner_id === currentUserId;
  const [comments, setComments] = useState(initialComments);
  const [commentBody, setCommentBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setPosting(true);
    setError(null);
    const result = await addJournalComment(entry.id, commentBody);
    setPosting(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setComments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        entry_id: entry.id,
        author_id: currentUserId,
        body: commentBody.trim(),
        created_at: new Date().toISOString(),
      },
    ]);
    setCommentBody("");
    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm("Xóa bài học này? Không thể hoàn tác.")) return;
    setDeleting(true);
    const result = await deleteJournalEntry(entry.id);
    if ("error" in result) {
      setDeleting(false);
      setError(result.error);
      return;
    }
    router.push("/journal");
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 pb-16 md:p-6 lg:p-10">
      <Link href="/journal" className="flex items-center gap-1.5 text-label-sm font-semibold text-primary hover:underline">
        <ArrowLeft size={16} />
        Quay lại danh sách nhật ký
      </Link>

      <div className="flex flex-col gap-3 border-b border-outline-variant pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-card-title font-bold text-on-surface">{entry.symbol}</h1>
            <span
              className={`rounded-full px-2.5 py-1 text-caption font-bold ${
                entry.outcome === "win" ? "bg-sage-soft text-sage" : "bg-crimson-soft text-crimson"
              }`}
            >
              {entry.outcome === "win" ? "Lãi" : "Lỗ"}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-caption text-outline">
            <Calendar size={14} />
            {formatDate(entry.trade_date)} · Đăng bởi {profileNames[entry.owner_id] ?? "Ẩn danh"}
          </p>
        </div>

        {isOwner && canWrite && (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/journal/${entry.id}/edit`}
              className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-semibold text-primary transition-colors hover:bg-surface-container"
            >
              <Pencil size={16} />
              Sửa bài học
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-semibold text-crimson transition-colors hover:bg-crimson-soft disabled:opacity-60"
            >
              {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Xóa
            </button>
          </div>
        )}
      </div>

      {error && <p className="rounded-control bg-crimson-soft px-3 py-2 text-label-sm text-crimson">{error}</p>}

      {entry.image_urls.length > 0 && (
        <div className="rounded-frame bg-light-chart-bg p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {entry.image_urls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage / user-provided URL
              <img
                key={url + i}
                src={url}
                alt={`Biểu đồ ${entry.symbol} ${i + 1}`}
                className="w-full rounded-card bg-dark-chart object-contain"
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study">
          <p className="mb-1 text-caption font-semibold uppercase tracking-wide text-outline">Vùng giá vào lệnh</p>
          <p className="text-body-md text-on-surface">{entry.entry_zone || "—"}</p>
        </div>
        <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study">
          <p className="mb-1 text-caption font-semibold uppercase tracking-wide text-outline">Vì sao vào lệnh</p>
          <p className="text-body-md text-on-surface">{entry.entry_reason || "—"}</p>
        </div>
        <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study">
          <p className="mb-1 text-caption font-semibold uppercase tracking-wide text-outline">Cảm xúc & Tâm lý</p>
          <p className="text-body-md text-on-surface">{entry.emotions || "—"}</p>
        </div>
      </div>

      <div className="rounded-panel border-2 border-primary bg-primary-fixed/40 p-4">
        <p className="mb-2 flex items-center gap-2 text-label-sm font-bold uppercase tracking-wide text-primary">
          <Lightbulb size={16} />
          Bài học rút ra
        </p>
        <p className="text-body-lg text-on-surface">{entry.lesson || "Chưa ghi bài học."}</p>
      </div>

      <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study">
        <h2 className="mb-4 flex items-center gap-2 font-display text-headline-md font-bold text-on-surface">
          <MessageSquare size={18} />
          Góc phản biện & thảo luận ({comments.length})
        </h2>

        <div className="flex flex-col gap-3">
          {comments.length === 0 && (
            <p className="text-body-md text-on-surface-variant">Chưa có bình luận nào.</p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-card bg-surface-container p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-label-sm font-semibold text-on-surface">
                  {profileNames[comment.author_id] ?? "Ẩn danh"}
                </span>
                <span className="text-caption text-outline">{formatDateTime(comment.created_at)}</span>
              </div>
              <p className="text-body-md text-on-surface-variant">{comment.body}</p>
            </div>
          ))}
        </div>

        {isOwner ? (
          <p className="mt-4 rounded-control bg-surface-container px-3 py-2 text-caption text-outline">
            Đây là bài học của bạn — chỉ đồng đội mới có thể bình luận vào đây.
          </p>
        ) : !canWrite ? (
          <p className="mt-4 rounded-control bg-surface-container px-3 py-2 text-caption text-outline">
            Bạn đang ở chế độ chỉ xem — liên hệ quản trị viên để được cấp quyền bình luận.
          </p>
        ) : (
          <form onSubmit={handleAddComment} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Để lại nhận xét hoặc phản biện..."
              className="flex-1 rounded-control border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={posting || !commentBody.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-btn font-semibold text-on-primary transition-colors hover:bg-primary-strong disabled:opacity-60"
            >
              {posting && <Loader2 size={16} className="animate-spin" />}
              Gửi
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
