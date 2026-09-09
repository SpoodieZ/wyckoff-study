import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import { hasChapterData } from "@/lib/chapter-data";
import { getCurrentProfile, getJournalEntry, listComments, listProfileNames } from "@/lib/journal";
import JournalDetailView from "./JournalDetailView";

export default async function JournalEntryPage(props: PageProps<"/journal/[id]">) {
  const { id } = await props.params;
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const entry = await getJournalEntry(id);
  if (!entry) notFound();

  const [comments, profileNames] = await Promise.all([listComments(id), listProfileNames()]);

  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  return (
    <AppShell chapters={chapters}>
      <JournalDetailView
        entry={entry}
        comments={comments}
        profileNames={profileNames}
        currentUserId={profile.id}
        canWrite={profile.role !== "viewer"}
      />
    </AppShell>
  );
}
