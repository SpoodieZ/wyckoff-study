import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Ôn Tập Wyckoff",
  description: "Website ôn tập kiến thức Wyckoff Power Charting",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${dmSans.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body bg-surface text-on-surface">{children}</body>
    </html>
  );
}
