import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import { hasChapterData } from "@/lib/chapter-data";
import { getCurrentProfile, listProfiles } from "@/lib/journal";
import MembersView from "./MembersView";

export default async function JournalMembersPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/journal");

  const profiles = await listProfiles();

  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  return (
    <AppShell chapters={chapters}>
      <MembersView profiles={profiles} currentUserId={profile.id} />
    </AppShell>
  );
}
