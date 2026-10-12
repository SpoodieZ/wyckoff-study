import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, localeFromAcceptLanguage, parseLocale, type Locale } from "./config";

/** Bật khi nội dung học (data/chapters-en) đã dịch đủ 42 chương: lúc đó khách có trình duyệt
 * không phải tiếng Việt sẽ tự vào bản tiếng Anh. Trước đó chỉ đổi khi người dùng bấm nút EN. */
const AUTO_DETECT_FROM_BROWSER = false;

/** Thứ tự ưu tiên: cookie người dùng đã chọn > ngôn ngữ trình duyệt > tiếng Việt. */
export async function getLocale(): Promise<Locale> {
  const fromCookie = parseLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  if (fromCookie) return fromCookie;
  if (!AUTO_DETECT_FROM_BROWSER) return DEFAULT_LOCALE;
  const acceptLanguage = (await headers()).get("accept-language");
  return acceptLanguage ? localeFromAcceptLanguage(acceptLanguage) : DEFAULT_LOCALE;
}
