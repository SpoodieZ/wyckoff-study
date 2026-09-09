import type { GlossaryTerm } from "@/lib/glossary";

function GlossaryGroup({ title, terms, accent }: { title: string; terms: GlossaryTerm[]; accent: "sage" | "crimson" }) {
  return (
    <div>
      <h3
        className={`mb-3 text-label-sm font-bold uppercase tracking-wide ${
          accent === "sage" ? "text-sage" : "text-crimson"
        }`}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {terms.map((term) => (
          <div
            key={term.abbr}
            className="rounded-card border border-outline-variant bg-surface-container-lowest p-3 shadow-study"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-caption font-bold ${
                  accent === "sage" ? "bg-sage-soft text-sage" : "bg-crimson-soft text-crimson"
                }`}
              >
                {term.abbr}
              </span>
              <span className="text-body-md font-semibold text-on-surface">{term.name}</span>
            </div>
            <p className="mt-1 text-body-md text-on-surface-variant">{term.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GlossarySection({
  accumulation,
  distribution,
}: {
  accumulation: GlossaryTerm[];
  distribution: GlossaryTerm[];
}) {
  return (
    <section className="mb-8 rounded-frame border border-outline-variant bg-surface-container-lowest p-4 shadow-study md:p-6">
      <h2 className="font-display text-card-title font-bold text-on-surface">Bảng Thuật Ngữ</h2>
      <p className="mt-1 mb-5 text-body-md text-on-surface-variant">
        Đọc qua trước khi luyện tập — mỗi cấu trúc dưới đây đều xuất hiện trực tiếp trong các câu hỏi.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <GlossaryGroup title="Tích Lũy (Accumulation)" terms={accumulation} accent="sage" />
        <GlossaryGroup title="Phân Phối (Distribution)" terms={distribution} accent="crimson" />
      </div>
    </section>
  );
}
