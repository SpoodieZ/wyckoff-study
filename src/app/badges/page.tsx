import { hasChapterData } from "@/lib/chapter-data";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import AppShell from "@/components/AppShell";
import BadgesView from "@/components/BadgesView";

export default function BadgesPage() {
  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  return (
    <AppShell chapters={chapters}>
      <div className="mx-auto w-full max-w-5xl p-4 pb-24 md:p-6 lg:p-10">
        <BadgesView />
      </div>
    </AppShell>
  );
}
