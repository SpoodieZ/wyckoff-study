import type { Locale } from "./config";
import { MESSAGES, type MessageKey } from "./messages";

export type Params = Record<string, string | number>;

export function translate(locale: Locale, key: MessageKey, params?: Params): string {
  let text: string = MESSAGES[locale][key];
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export type TFunction = (key: MessageKey, params?: Params) => string;

export function makeT(locale: Locale): TFunction {
  return (key, params) => translate(locale, key, params);
}
