import AppShell from "@/components/AppShell";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import { hasChapterData } from "@/lib/chapter-data";
import { SAMPLE_REVIEW_ITEMS } from "@/lib/sample-review";
import ReviewView from "./ReviewView";

export default function ReviewPage() {
  const chapters = CHAPTERS_META.map((c) => ({
    ...c,
    available: hasChapterData(c.id),
  }));

  return (
    <AppShell chapters={chapters}>
      <ReviewView items={SAMPLE_REVIEW_ITEMS} chapters={CHAPTERS_META} />
    </AppShell>
  );
}
