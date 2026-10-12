import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentProfile } from "@/lib/journal";
import JournalForm from "../JournalForm";

export default async function NewJournalEntryPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role === "viewer") redirect("/journal");

  return (
    <AppShell>
      <JournalForm mode="create" />
    </AppShell>
  );
}
