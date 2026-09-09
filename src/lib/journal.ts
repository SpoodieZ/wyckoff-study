import { createClient } from "@/lib/supabase/server";
import type { JournalEntry, JournalComment, Profile } from "@/lib/journal-types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Hồ sơ (tên hiển thị + vai trò) của người đang đăng nhập, hoặc null nếu chưa đăng nhập. */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, email, role")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

/** Toàn bộ hồ sơ người dùng, dùng cho trang quản trị thành viên. */
export async function listProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, email, role")
    .order("display_name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listJournalEntries(): Promise<JournalEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("trade_date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getJournalEntry(id: string): Promise<JournalEntry | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("journal_entries").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function listComments(entryId: string): Promise<JournalComment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_comments")
    .select("*")
    .eq("entry_id", entryId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Số lượng bình luận theo từng entry_id, dùng cho danh sách. */
export async function listCommentCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("journal_comments").select("entry_id");
  if (error) throw new Error(error.message);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.entry_id] = (counts[row.entry_id] ?? 0) + 1;
  }
  return counts;
}

/** Map user id -> "Người 1"/"Người 2" display name. */
export async function listProfileNames(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("id, display_name");
  if (error) throw new Error(error.message);
  return Object.fromEntries((data ?? []).map((p) => [p.id, p.display_name]));
}
