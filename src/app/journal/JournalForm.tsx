"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, Link2, Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createJournalEntry, updateJournalEntry } from "./actions";
import type { JournalEntryFormValues, TradeOutcome } from "@/lib/journal-types";

const CHART_BUCKET = "journal-charts";

const emptyValues: JournalEntryFormValues = {
  symbol: "",
  trade_date: "",
  outcome: "win",
  entry_zone: "",
  entry_reason: "",
  emotions: "",
  lesson: "",
  image_urls: [],
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-label-sm font-semibold text-on-surface-variant">{children}</span>;
}

const textAreaClass =
  "w-full rounded-control border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export default function JournalForm({
  mode,
  entryId,
  initialValues,
}: {
  mode: "create" | "edit";
  entryId?: string;
  initialValues?: JournalEntryFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<JournalEntryFormValues>(initialValues ?? emptyValues);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof JournalEntryFormValues>(key: K, value: JournalEntryFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function addImageUrl(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;
    update("image_urls", [...values.image_urls, trimmed]);
  }

  function removeImageUrl(index: number) {
    update(
      "image_urls",
      values.image_urls.filter((_, i) => i !== index)
    );
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from(CHART_BUCKET).upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(CHART_BUCKET).getPublicUrl(path);
      addImageUrl(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải ảnh lên thất bại.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result =
      mode === "create" ? await createJournalEntry(values) : await updateJournalEntry(entryId!, values);

    setSubmitting(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    router.push(`/journal/${"id" in result ? result.id : entryId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 pb-16 md:p-6 lg:p-10">
      <div>
        <h1 className="font-display text-card-title font-bold text-on-surface">
          {mode === "create" ? "Ghi lại bài học giao dịch mới" : "Sửa bài học giao dịch"}
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Mỗi lệnh trade là một bài học quý báu — ghi chép chân thật để cùng hoàn thiện mỗi ngày.
        </p>
      </div>

      {error && <p className="rounded-control bg-crimson-soft px-3 py-2 text-label-sm text-crimson">{error}</p>}

      <div className="flex flex-col gap-2">
        <FieldLabel>Ảnh biểu đồ giao dịch *</FieldLabel>
        <div className="rounded-frame border-2 border-dashed border-outline-variant bg-light-chart-bg p-6">
          <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <Upload size={20} />
            </span>
            <span className="text-label-sm font-semibold text-on-surface">
              {uploading ? "Đang tải ảnh lên…" : "Kéo thả ảnh chart vào đây hoặc bấm để chọn từ máy tính"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileUpload(file);
                e.target.value = "";
              }}
            />
          </label>
          <div className="mt-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Link2 size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Hoặc dán URL ảnh (TradingView, Imgur...)"
                className="w-full rounded-control border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-label-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                addImageUrl(urlInput);
                setUrlInput("");
              }}
              className="shrink-0 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-semibold text-primary transition-colors hover:bg-surface-container"
            >
              Thêm liên kết
            </button>
          </div>

          {values.image_urls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {values.image_urls.map((url, i) => (
                <div key={url + i} className="group relative overflow-hidden rounded-card bg-dark-chart">
                  {/* eslint-disable-next-line @next/next/no-img-element -- external/user-provided URL */}
                  <img src={url} alt={`Ảnh ${i + 1}`} className="h-24 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition-opacity"
                    aria-label="Xóa ảnh"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <FieldLabel>Mã / Cặp tài sản *</FieldLabel>
          <input
            value={values.symbol}
            onChange={(e) => update("symbol", e.target.value)}
            placeholder="BTC/USDT, EURUSD, HPG..."
            required
            className={textAreaClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel>Ngày vào lệnh *</FieldLabel>
          <input
            type="date"
            value={values.trade_date}
            onChange={(e) => update("trade_date", e.target.value)}
            required
            className={textAreaClass}
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Kết quả lệnh giao dịch *</FieldLabel>
        <div className="flex gap-3">
          {(["win", "loss"] as TradeOutcome[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => update("outcome", option)}
              className={`flex-1 rounded-control border-2 px-4 py-3 text-label-sm font-semibold transition-colors ${
                values.outcome === option
                  ? option === "win"
                    ? "border-sage bg-sage-soft text-sage"
                    : "border-crimson bg-crimson-soft text-crimson"
                  : "border-outline-variant bg-surface-container-lowest text-on-surface-variant"
              }`}
            >
              {option === "win" ? "🎉 Lãi (Thành công)" : "🌱 Lỗ (Bài học tích lũy)"}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <FieldLabel>Vào lệnh ở vùng giá / điểm kỹ thuật nào</FieldLabel>
        <textarea
          value={values.entry_zone}
          onChange={(e) => update("entry_zone", e.target.value)}
          rows={2}
          placeholder="Vùng 62,400$, ngay sau khi nến Spring rút bấc test lại hỗ trợ Creek (Phase C Wyckoff)"
          className={textAreaClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <FieldLabel>Vì sao vào lệnh? (Lý do kỹ thuật)</FieldLabel>
        <textarea
          value={values.entry_reason}
          onChange={(e) => update("entry_reason", e.target.value)}
          rows={3}
          className={textAreaClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <FieldLabel>Cảm xúc, hành vi, tâm lý lúc đó</FieldLabel>
        <textarea
          value={values.emotions}
          onChange={(e) => update("emotions", e.target.value)}
          rows={3}
          className={textAreaClass}
        />
      </label>

      <div className="rounded-panel border-2 border-primary bg-primary-fixed/40 p-4">
        <p className="mb-2 flex items-center gap-2 text-label-sm font-bold uppercase tracking-wide text-primary">
          <Lightbulb size={16} />
          Bài học rút ra (quan trọng nhất)
        </p>
        <textarea
          value={values.lesson}
          onChange={(e) => update("lesson", e.target.value)}
          rows={4}
          placeholder="Nếu gặp lại tình huống này trong tương lai, mình sẽ giữ nguyên điều gì hoặc cải thiện bước nào?"
          className="w-full rounded-control border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-btn font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-btn font-semibold text-on-primary transition-colors hover:bg-primary-strong disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Lưu bài học
        </button>
      </div>
    </form>
  );
}
