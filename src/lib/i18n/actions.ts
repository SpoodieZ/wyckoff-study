"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, parseLocale } from "./config";

export async function setLocaleAction(value: string) {
  const locale = parseLocale(value);
  if (!locale) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
