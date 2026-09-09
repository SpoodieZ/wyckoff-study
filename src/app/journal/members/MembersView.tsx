"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, UserCog } from "lucide-react";
import type { Profile, UserRole } from "@/lib/journal-types";
import { setMemberRole } from "./actions";

const ROLE_LABEL: Record<UserRole, string> = {
  viewer: "Chỉ xem",
  member: "Thành viên",
  admin: "Quản trị viên",
};

const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  viewer: "bg-surface-container-high text-on-surface-variant",
  member: "bg-sage-soft text-sage",
  admin: "bg-primary-fixed text-primary",
};

export default function MembersView({
  profiles,
  currentUserId,
}: {
  profiles: Profile[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChangeRole(userId: string, role: "viewer" | "member") {
    setPendingId(userId);
    setError(null);
    const result = await setMemberRole(userId, role);
    setPendingId(null);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 pb-16 md:p-6 lg:p-10">
      <div>
        <h1 className="font-display text-card-title font-bold text-on-surface">Quản lý thành viên</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Cấp quyền thành viên để cho phép thêm bài học và bình luận. Người mới đăng nhập bằng Google mặc
          định chỉ xem được.
        </p>
      </div>

      {error && <p className="rounded-control bg-crimson-soft px-3 py-2 text-label-sm text-crimson">{error}</p>}

      <div className="flex flex-col gap-2">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-label-sm font-semibold text-on-surface-variant">
                {p.display_name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-on-surface">
                  {p.display_name}
                  {p.id === currentUserId && " (bạn)"}
                </p>
                {p.email && <p className="truncate text-caption text-outline">{p.email}</p>}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-caption font-semibold ${ROLE_BADGE_CLASS[p.role]}`}>
                {p.role === "admin" && <ShieldCheck size={12} className="mr-1 inline" />}
                {ROLE_LABEL[p.role]}
              </span>

              {p.role !== "admin" && (
                <button
                  onClick={() => handleChangeRole(p.id, p.role === "viewer" ? "member" : "viewer")}
                  disabled={pendingId === p.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-label-sm font-semibold text-primary transition-colors hover:bg-surface-container disabled:opacity-60"
                >
                  {pendingId === p.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <UserCog size={14} />
                  )}
                  {p.role === "viewer" ? "Cấp quyền thành viên" : "Thu hồi quyền"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
