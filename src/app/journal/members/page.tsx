import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentProfile, listPendingInvites, listProfiles } from "@/lib/journal";
import MembersView from "./MembersView";

export default async function JournalMembersPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/journal");

  const [profiles, pendingInvites] = await Promise.all([listProfiles(), listPendingInvites()]);

  return (
    <AppShell>
      <MembersView profiles={profiles} pendingInvites={pendingInvites} currentUserId={profile.id} />
    </AppShell>
  );
}
