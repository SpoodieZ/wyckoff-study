import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentProfile, listCommentCounts, listJournalEntries, listProfileNames } from "@/lib/journal";
import JournalListView from "./JournalListView";

export default async function JournalPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const [entries, profileNames, commentCounts] = await Promise.all([
    listJournalEntries(),
    listProfileNames(),
    listCommentCounts(),
  ]);

  return (
    <AppShell>
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
