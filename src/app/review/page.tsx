import AppShell from "@/components/AppShell";
import { CHAPTERS_META } from "@/lib/chapters-meta";
import { SAMPLE_REVIEW_ITEMS } from "@/lib/sample-review";
import ReviewView from "./ReviewView";

export default function ReviewPage() {
  return (
    <AppShell>
      <ReviewView items={SAMPLE_REVIEW_ITEMS} chapters={CHAPTERS_META} />
    </AppShell>
  );
}
