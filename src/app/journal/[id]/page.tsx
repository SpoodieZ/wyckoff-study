import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentProfile, getJournalEntry, listComments, listProfileNames } from "@/lib/journal";
import JournalDetailView from "./JournalDetailView";

export default async function JournalEntryPage(props: PageProps<"/journal/[id]">) {
  const { id } = await props.params;
  const profile = await getCurrentProfile();

  const entry = await getJournalEntry(id);
  if (!entry) notFound();

  // Khách chưa đăng nhập chỉ xem bài, không xem bình luận.
  const [comments, profileNames] = await Promise.all([
    profile ? listComments(id) : Promise.resolve([]),
    listProfileNames(),
  ]);

  return (
    <AppShell>
      <JournalDetailView
        entry={entry}
        comments={comments}
        profileNames={profileNames}
        currentUserId={profile?.id ?? null}
        canWrite={profile !== null && profile.role !== "viewer"}
      />
    </AppShell>
  );
}
