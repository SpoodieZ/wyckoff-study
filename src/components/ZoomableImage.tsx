"use client";

import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";

export default function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="group relative">
        {/* eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage / user-provided URL */}
        <img
          src={src}
          alt={alt}
          onClick={() => setOpen(true)}
          className="w-full cursor-zoom-in rounded-card bg-dark-chart object-contain"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Phóng to ảnh"
          title="Phóng to"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-90 shadow-study backdrop-blur transition hover:bg-black/80 hover:opacity-100"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-6"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Đóng"
            title="Đóng (Esc)"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
          >
            <X size={22} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage / user-provided URL */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="h-[88vh] w-[96vw] rounded-card bg-dark-chart object-contain"
          />
        </div>
      )}
    </>
  );
}
