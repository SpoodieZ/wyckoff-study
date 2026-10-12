import Link from "next/link";
import { LineChart, Tag, Users } from "lucide-react";
import AppShell from "@/components/AppShell";
import { countStudySetQuestions } from "@/lib/chapter-data";
import { STUDY_SETS } from "@/lib/study-sets";
import { getLocale } from "@/lib/i18n/server";
import { makeT } from "@/lib/i18n/translate";

const SET_ICONS: Record<string, typeof LineChart> = {
  "thuc-hanh-bieu-do": LineChart,
  "cau-truc-thuat-ngu": Tag,
  "tu-duy-composite-man": Users,
};

export default async function StudySetsPage() {
  const t = makeT(await getLocale());
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl p-4 pb-24 md:p-6 lg:p-10">
        <h1 className="font-display text-card-title font-bold text-on-surface">{t("sets.title")}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {t("sets.intro")}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STUDY_SETS.map((set) => {
            const Icon = SET_ICONS[set.id] ?? Tag;
            const count = countStudySetQuestions(set);
            return (
              <Link
                key={set.id}
                href={`/study-sets/${set.id}`}
                className="group flex flex-col gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-study transition-colors hover:border-primary"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-secondary-container px-2.5 py-1 text-caption font-semibold text-on-secondary-container">
                    {t(set.tagKey)}
                  </span>
                  <Icon size={18} className="text-outline" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-display text-body-lg font-bold text-on-surface group-hover:text-primary">
                    {t(set.titleKey)}
                  </h3>
                  <p className="mt-1 text-body-md text-on-surface-variant">{t(set.descriptionKey)}</p>
                </div>
                <span className="text-caption text-outline">{t("common.questionsCount", { n: count })}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
