"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/client";
import { type Locale } from "@/lib/i18n/config";
import { useT } from "@/lib/i18n/client";
import { setLocaleAction } from "@/lib/i18n/actions";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "vi", label: "VI" },
  { value: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const current = useLocale();
  const t = useT();
  const [pending, startTransition] = useTransition();

  function choose(locale: Locale) {
    if (locale === current || pending) return;
    startTransition(async () => {
      await setLocaleAction(locale);
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label={t("shell.language")}
      className="flex items-center rounded-full border border-outline-variant bg-surface-container-lowest p-0.5"
    >
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => choose(value)}
          aria-pressed={current === value}
          className={`rounded-full px-2.5 py-1 text-caption font-bold transition-colors ${
            current === value ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
