import AppShell from "@/components/AppShell";
import BadgesView from "@/components/BadgesView";

export default function BadgesPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl p-4 pb-24 md:p-6 lg:p-10">
        <BadgesView />
      </div>
    </AppShell>
  );
}
