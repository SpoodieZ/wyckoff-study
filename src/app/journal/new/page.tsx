import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import { hasChapterData } from "@/lib/chapter-data";
import { getCurrentProfile } from "@/lib/journal";
import JournalForm from "../JournalForm";

export default async function NewJournalEntryPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role === "viewer") redirect("/journal");

  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  return (
    <AppShell chapters={chapters}>
      <JournalForm mode="create" />
    </AppShell>
  );
}
