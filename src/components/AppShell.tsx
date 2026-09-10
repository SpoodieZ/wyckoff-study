"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  BookOpen,
  Layers,
  RotateCcw,
  BarChart3,
  NotebookPen,
  User,
  LogOut,
  LogIn,
  UserCog,
  Flame,
  Award,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getStudyStreak } from "@/lib/streak";

const NAV_ITEMS = [
  { href: "/", label: "Chương", icon: BookOpen, available: true },
  { href: "/study-sets", label: "Study Sets", icon: Layers, available: true },
  { href: "/journal", label: "Nhật ký giao dịch", icon: NotebookPen, available: true },
  { href: "/review", label: "Ôn lại câu sai", icon: RotateCcw, available: true },
  { href: "/progress", label: "Tiến độ", icon: BarChart3, available: true },
  { href: "/badges", label: "Huy hiệu", icon: Award, available: true },
];

export interface ChapterSummary {
  id: number;
  title: string;
  available: boolean;
}

function UserMenu({ displayName }: { displayName: string | null }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-2 rounded-full bg-primary-fixed px-3 py-2 text-label-sm font-semibold text-primary sm:flex">
        <User size={16} />
        {displayName ?? "…"}
      </span>
      <button
        onClick={handleSignOut}
        className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3 py-2 text-label-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container sm:px-4"
        title="Đăng xuất"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">Đăng xuất</span>
      </button>
    </div>
  );
}

function LoginButton() {
  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-label-sm font-semibold text-on-primary shadow-study transition-colors hover:bg-primary-strong sm:px-4"
    >
      <LogIn size={16} />
      Đăng nhập
    </Link>
  );
}

function SidebarContent({
  pathname,
  chapters,
  isAdmin,
}: {
  pathname: string;
  chapters: ChapterSummary[];
  isAdmin: boolean;
}) {
  const navItems = isAdmin
    ? [...NAV_ITEMS, { href: "/journal/members", label: "Quản lý thành viên", icon: UserCog, available: true }]
    : NAV_ITEMS;

  return (
    <>
      <div className="px-3 py-6">
        <h2 className="font-display text-headline-md font-semibold text-primary">Learning Path</h2>
        <p className="mt-1 text-label-sm text-on-surface-variant">Wyckoff Power Charting</p>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const active = item.available && pathname === item.href;
          const Icon = item.icon;
          if (!item.available) {
            return (
              <span
                key={item.label}
                className="flex cursor-not-allowed items-center justify-between gap-3 rounded-card px-3 py-3 text-label-sm font-semibold text-outline"
              >
                <span className="flex items-center gap-3">
                  <Icon size={20} strokeWidth={1.75} />
                  {item.label}
                </span>
                <span className="rounded-full bg-surface-container px-2 py-0.5 text-[11px] text-outline">
                  Sắp có
                </span>
              </span>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-card px-3 py-3 text-label-sm font-semibold transition-colors ${
                active
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <Icon size={20} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {chapters.length > 0 && (
        <div className="mt-4 border-t border-outline-variant px-2 pt-4">
          <p className="px-1 pb-2 text-caption font-medium uppercase tracking-wider text-outline">
            Mục lục
          </p>
          <div className="flex flex-col gap-1.5">
            {chapters.map((chapter) => {
              const isActive = pathname === `/chapters/${chapter.id}`;
              const content = (
                <>
                  <span className="truncate text-label-sm">
                    Ch {chapter.id}: {chapter.title}
                  </span>
                  <span
                    className={`mini-candlestick shrink-0 ${
                      chapter.available ? "candlestick-sage" : "candlestick-grey"
                    }`}
                  />
                </>
              );
              return chapter.available ? (
                <Link
                  key={chapter.id}
                  href={`/chapters/${chapter.id}`}
                  className={`flex items-center justify-between gap-2 rounded-card border px-2 py-2 transition-colors ${
                    isActive
                      ? "border-primary bg-surface-container-lowest"
                      : "border-outline-variant bg-surface-container-lowest hover:border-primary"
                  }`}
                >
                  {content}
                </Link>
              ) : (
                <span
                  key={chapter.id}
                  className="flex cursor-not-allowed items-center justify-between gap-2 rounded-card border border-outline-variant bg-surface-container-lowest px-2 py-2 opacity-60"
                >
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default function AppShell({
  children,
  chapters = [],
}: {
  children: React.ReactNode;
  chapters?: ChapterSummary[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // undefined = đang kiểm tra phiên đăng nhập, true/false = đã biết kết quả.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const [studyStreak, setStudyStreak] = useState(0);

  useEffect(() => {
    // Đọc lại streak từ localStorage mỗi khi chuyển trang — không đọc được ở
    // lần render server nên bắt buộc phải làm sau khi mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStudyStreak(getStudyStreak());
  }, [pathname]);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return;
      if (!user) {
        setIsLoggedIn(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("id", user.id)
        .maybeSingle();
      if (active) {
        setDisplayName(profile?.display_name ?? user.email ?? "");
        setIsAdmin(profile?.role === "admin");
        setIsLoggedIn(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 text-on-surface transition-colors hover:bg-surface-container md:hidden"
            aria-label="Mở menu"
          >
            <Menu size={22} />
          </button>
          <Image src="/logo-icon.png" alt="" width={677} height={442} className="h-8 w-auto object-contain" />
          <Image src="/logo-wordmark.png" alt="Wyckoff Study" width={812} height={335} className="h-7 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-2">
          {studyStreak > 0 && (
            <span
              title={`${studyStreak} ngày học liên tục`}
              className="flex items-center gap-1.5 rounded-full bg-crimson-soft px-3 py-2 text-label-sm font-bold text-crimson"
            >
              <Flame size={16} />
              {studyStreak}
            </span>
          )}
          {isLoggedIn && <UserMenu displayName={displayName} />}
          {isLoggedIn === false && <LoginButton />}
        </div>
      </header>

      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 flex-col gap-1 overflow-y-auto border-r border-outline-variant bg-surface-bright py-3 md:flex">
        <SidebarContent pathname={pathname} chapters={chapters} isAdmin={isAdmin} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Đóng menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col gap-1 overflow-y-auto bg-surface-bright py-3 shadow-study">
            <div className="flex items-center justify-between px-3">
              <span className="flex items-center gap-2">
                <Image src="/logo-icon.png" alt="" width={677} height={442} className="h-7 w-auto object-contain" />
                <Image src="/logo-wordmark.png" alt="Wyckoff Study" width={812} height={335} className="h-6 w-auto object-contain" />
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container"
                aria-label="Đóng menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-2">
              <SidebarContent pathname={pathname} chapters={chapters} isAdmin={isAdmin} />
            </div>
          </aside>
        </div>
      )}

      <main className="mt-16 flex flex-col md:ml-64">{children}</main>
    </div>
  );
}
