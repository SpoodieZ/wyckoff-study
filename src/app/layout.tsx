import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/client";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return locale === "en"
    ? { title: "Wyckoff Study", description: "A practice app for the Wyckoff Power Charting method" }
    : { title: "Ôn Tập Wyckoff", description: "Website ôn tập kiến thức Wyckoff Power Charting" };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${dmSans.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body bg-surface text-on-surface">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
