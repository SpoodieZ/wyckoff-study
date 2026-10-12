export type Locale = "vi" | "en";

export const LOCALES: Locale[] = ["vi", "en"];
export const DEFAULT_LOCALE: Locale = "vi";
export const LOCALE_COOKIE = "lang";

export function parseLocale(value: string | null | undefined): Locale | null {
  return value === "vi" || value === "en" ? value : null;
}

/** Chọn ngôn ngữ từ header Accept-Language của trình duyệt (khách nước ngoài mặc định tiếng Anh). */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("vi") ? "vi" : "en";
}
