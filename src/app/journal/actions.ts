"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { JournalEntryFormValues } from "@/lib/journal-types";

type ActionResult<T = { ok: true }> = T | { error: string };
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const VIEWER_ERROR = "Bạn đang ở chế độ chỉ xem — liên hệ quản trị viên để được cấp quyền.";

async function hasWriteAccess(supabase: SupabaseServerClient, userId: string): Promise<boolean> {
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return data?.role === "member" || data?.role === "admin";
}

function validate(values: JournalEntryFormValues): string | null {
  if (!values.symbol.trim()) return "Vui lòng nhập mã/cặp tài sản.";
  if (!values.trade_date) return "Vui lòng chọn ngày vào lệnh.";
  if (values.outcome !== "win" && values.outcome !== "loss") return "Vui lòng chọn kết quả Lãi/Lỗ.";
  if (values.image_urls.length === 0) return "Vui lòng thêm ít nhất 1 ảnh biểu đồ.";
  return null;
}

export async function createJournalEntry(
  values: JournalEntryFormValues
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập lại." };
  if (!(await hasWriteAccess(supabase, user.id))) return { error: VIEWER_ERROR };

  const invalidReason = validate(values);
  if (invalidReason) return { error: invalidReason };

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({ ...values, owner_id: user.id })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/journal");
  return { id: data.id };
}

export async function updateJournalEntry(
  id: string,
  values: JournalEntryFormValues
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập lại." };
  if (!(await hasWriteAccess(supabase, user.id))) return { error: VIEWER_ERROR };

  const invalidReason = validate(values);
  if (invalidReason) return { error: invalidReason };

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("owner_id")
    .eq("id", id)
    .maybeSingle();
  if (!entry) return { error: "Không tìm thấy bài học." };
  if (entry.owner_id !== user.id) return { error: "Bạn chỉ có thể sửa bài học của chính mình." };

  const { error } = await supabase
    .from("journal_entries")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/journal");
  revalidatePath(`/journal/${id}`);
  return { ok: true };
}

export async function deleteJournalEntry(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập lại." };
  if (!(await hasWriteAccess(supabase, user.id))) return { error: VIEWER_ERROR };

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("owner_id")
    .eq("id", id)
    .maybeSingle();
  if (!entry) return { error: "Không tìm thấy bài học." };
  if (entry.owner_id !== user.id) return { error: "Bạn chỉ có thể xóa bài học của chính mình." };

  const { error } = await supabase.from("journal_entries").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/journal");
  return { ok: true };
}

export async function addJournalComment(entryId: string, body: string): Promise<ActionResult> {
  const trimmed = body.trim();
  if (!trimmed) return { error: "Bình luận không được để trống." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập lại." };
  if (!(await hasWriteAccess(supabase, user.id))) return { error: VIEWER_ERROR };

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("owner_id")
    .eq("id", entryId)
    .maybeSingle();
  if (!entry) return { error: "Không tìm thấy bài học." };
  if (entry.owner_id === user.id) return { error: "Bạn không thể bình luận vào bài học của chính mình." };

  const { error } = await supabase
    .from("journal_comments")
    .insert({ entry_id: entryId, author_id: user.id, body: trimmed });

  if (error) return { error: error.message };
  revalidatePath(`/journal/${entryId}`);
  return { ok: true };
}
