import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentProfile, getJournalEntry } from "@/lib/journal";
import JournalForm from "../../JournalForm";

export default async function EditJournalEntryPage(props: PageProps<"/journal/[id]/edit">) {
  const { id } = await props.params;
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role === "viewer") redirect(`/journal/${id}`);

  const entry = await getJournalEntry(id);
  if (!entry) notFound();
  if (entry.owner_id !== profile.id) redirect(`/journal/${id}`);

  return (
    <AppShell>
      <JournalForm
        mode="edit"
        entryId={entry.id}
        initialValues={{
          symbol: entry.symbol,
          trade_date: entry.trade_date,
          outcome: entry.outcome,
          entry_zone: entry.entry_zone,
          entry_reason: entry.entry_reason,
          emotions: entry.emotions,
          lesson: entry.lesson,
          image_urls: entry.image_urls,
        }}
      />
    </AppShell>
  );
}
