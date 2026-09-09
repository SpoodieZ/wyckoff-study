"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { error: string };

export async function setMemberRole(targetUserId: string, role: "viewer" | "member"): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập lại." };

  const { data: callerProfile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (callerProfile?.role !== "admin") return { error: "Chỉ quản trị viên mới cấp quyền được." };

  const { data: target } = await supabase.from("profiles").select("role").eq("id", targetUserId).maybeSingle();
  if (!target) return { error: "Không tìm thấy người dùng." };
  if (target.role === "admin") return { error: "Không thể đổi quyền của quản trị viên." };

  const { error } = await supabase.from("profiles").update({ role }).eq("id", targetUserId);
  if (error) return { error: error.message };

  revalidatePath("/journal/members");
  return { ok: true };
}
