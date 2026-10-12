"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { JournalEntryFormValues } from "@/lib/journal-types";
import { getLocale } from "@/lib/i18n/server";
import { makeT, type TFunction } from "@/lib/i18n/translate";

type ActionResult<T = { ok: true }> = T | { error: string };
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function hasWriteAccess(supabase: SupabaseServerClient, userId: string): Promise<boolean> {
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return data?.role === "member" || data?.role === "admin";
}

function validate(t: TFunction, values: JournalEntryFormValues): string | null {
  if (!values.symbol.trim()) return t("err.symbol");
  if (!values.trade_date) return t("err.date");
  if (values.outcome !== "win" && values.outcome !== "loss") return t("err.outcome");
  if (values.image_urls.length === 0) return t("err.image");
  return null;
}

export async function createJournalEntry(
  values: JournalEntryFormValues
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const t = makeT(await getLocale());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("err.relogin") };
  if (!(await hasWriteAccess(supabase, user.id))) return { error: t("err.viewer") };

  const invalidReason = validate(t, values);
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
  const t = makeT(await getLocale());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("err.relogin") };
  if (!(await hasWriteAccess(supabase, user.id))) return { error: t("err.viewer") };

  const invalidReason = validate(t, values);
  if (invalidReason) return { error: invalidReason };

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("owner_id")
    .eq("id", id)
    .maybeSingle();
  if (!entry) return { error: t("err.notFound") };
  if (entry.owner_id !== user.id) return { error: t("err.editOwn") };

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
  const t = makeT(await getLocale());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("err.relogin") };
  if (!(await hasWriteAccess(supabase, user.id))) return { error: t("err.viewer") };

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("owner_id")
    .eq("id", id)
    .maybeSingle();
  if (!entry) return { error: t("err.notFound") };
  if (entry.owner_id !== user.id) return { error: t("err.deleteOwn") };

  const { error } = await supabase.from("journal_entries").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/journal");
  return { ok: true };
}

export async function addJournalComment(entryId: string, body: string): Promise<ActionResult> {
  const t = makeT(await getLocale());
  const trimmed = body.trim();
  if (!trimmed) return { error: t("err.commentEmpty") };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t("err.relogin") };
  if (!(await hasWriteAccess(supabase, user.id))) return { error: t("err.viewer") };

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("owner_id")
    .eq("id", entryId)
    .maybeSingle();
  if (!entry) return { error: t("err.notFound") };
  if (entry.owner_id === user.id) return { error: t("err.commentOwn") };

  const { error } = await supabase
    .from("journal_comments")
    .insert({ entry_id: entryId, author_id: user.id, body: trimmed });

  if (error) return { error: error.message };
  revalidatePath(`/journal/${entryId}`);
  return { ok: true };
}
