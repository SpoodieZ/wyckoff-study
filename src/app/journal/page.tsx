import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import { hasChapterData } from "@/lib/chapter-data";
import { getCurrentProfile, listCommentCounts, listJournalEntries, listProfileNames } from "@/lib/journal";
import JournalListView from "./JournalListView";

export default async function JournalPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  const [entries, profileNames, commentCounts] = await Promise.all([
    listJournalEntries(),
    listProfileNames(),
    listCommentCounts(),
  ]);

  return (
    <AppShell chapters={chapters}>
      <JournalListView
        entries={entries}
        profileNames={profileNames}
        commentCounts={commentCounts}
        currentUserId={profile.id}
        canWrite={profile.role !== "viewer"}
      />
    </AppShell>
  );
}
