import AppShell from "@/components/AppShell";
import { getCurrentProfile, listCommentCounts, listJournalEntries, listProfileNames } from "@/lib/journal";
import JournalListView from "./JournalListView";

export default async function JournalPage() {
  // Nhật ký chung ai cũng xem được; chỉ viết/sửa mới cần đăng nhập.
  const profile = await getCurrentProfile();

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
        currentUserId={profile?.id ?? null}
        canWrite={profile !== null && profile.role !== "viewer"}
      />
    </AppShell>
  );
}
