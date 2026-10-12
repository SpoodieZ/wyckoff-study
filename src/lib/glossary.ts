import type { Locale } from "./i18n/config";

export interface GlossaryTerm {
  abbr: string;
  name: string;
  meaning: string;
}

const ACCUMULATION_GLOSSARY_VI: GlossaryTerm[] = [
  {
    abbr: "PS",
    name: "Preliminary Support — Hỗ Trợ Sơ Bộ",
    meaning:
      "Tín hiệu mua đáng kể đầu tiên xuất hiện sau một downtrend dài, khối lượng tăng và biên độ giảm — chưa đủ chặn đà giảm nhưng là dấu hiệu Composite Man bắt đầu quan tâm.",
  },
  {
    abbr: "SC",
    name: "Selling Climax — Cao Trào Bán",
    meaning:
      "Phiên hoảng loạn bán tháo với biên độ và khối lượng cực lớn; giá thường đóng cửa cách xa đáy phiên vì lực mua ẩn đã hấp thụ phần lớn nguồn cung bán tháo.",
  },
  {
    abbr: "AR",
    name: "Automatic Rally — Nhịp Phục Hồi Tự Động",
    meaning:
      "Ngay sau SC, áp lực bán cạn kiệt khiến giá bật tăng mạnh không cần tin tức hỗ trợ — đỉnh của AR xác lập biên trên tạm thời của Trading Range.",
  },
  {
    abbr: "ST",
    name: "Secondary Test — Điểm Kiểm Tra Thứ Cấp",
    meaning:
      "Giá quay lại vùng SC để 'kiểm tra' cung còn hay hết, với khối lượng và biên độ thu hẹp hơn hẳn so với SC.",
  },
  {
    abbr: "Spring",
    name: "Spring",
    meaning:
      "Cú phá đáy Trading Range ở Phase C rồi đảo chiều tăng ngay sau đó — một cái bẫy rũ bỏ nhà đầu tư yếu tay (Weak Hands) trước khi xu hướng tăng thật sự bắt đầu.",
  },
  {
    abbr: "SOS",
    name: "Sign of Strength — Dấu Hiệu Sức Mạnh",
    meaning:
      "Nhịp tăng giá mạnh, biên độ nới rộng kèm khối lượng lớn, phá vỡ vùng kháng cự trong Trading Range — xác nhận cầu đã áp đảo cung.",
  },
  {
    abbr: "LPS",
    name: "Last Point of Support — Điểm Hỗ Trợ Cuối Cùng",
    meaning:
      "Nhịp điều chỉnh giảm nhẹ, khối lượng thấp, xảy ra ngay sau SOS — thường là điểm mua an toàn cuối cùng trước khi xu hướng tăng chính thức tăng tốc.",
  },
  {
    abbr: "JAC / BU",
    name: "Jump Across the Creek / Backup",
    meaning:
      "Ẩn dụ 'nhảy qua suối' khi giá phá vỡ vùng cung phía trên (the Creek), sau đó 'lùi lại' (Backup) kiểm tra trước khi tăng tiếp — có thể dùng thay thế cho cặp SOS/LPS.",
  },
];

const DISTRIBUTION_GLOSSARY_VI: GlossaryTerm[] = [
  {
    abbr: "PSY",
    name: "Preliminary Supply — Cung Sơ Bộ",
    meaning: "Tín hiệu bán đáng kể đầu tiên sau một uptrend dài — đối xứng với PS bên Tích Lũy.",
  },
  {
    abbr: "BC",
    name: "Buying Climax — Cao Trào Mua",
    meaning:
      "Phiên FOMO mua vào cực đoan, biên độ/khối lượng cực lớn nhưng giá đóng cửa yếu — Composite Man âm thầm bán ra cho đám đông đang hưng phấn.",
  },
  {
    abbr: "AR",
    name: "Automatic Reaction — Phản Ứng Tự Động",
    meaning:
      "Ngay sau BC, giá rơi mạnh tự động vì thiếu lực mua tiếp sức — đáy của AR xác lập biên dưới tạm thời của Trading Range.",
  },
  {
    abbr: "ST",
    name: "Secondary Test",
    meaning: "Giá quay lại kiểm tra vùng BC; nếu không vượt qua nổi với khối lượng thấp thì xác nhận cung đang áp đảo.",
  },
  {
    abbr: "UTAD",
    name: "Upthrust After Distribution",
    meaning:
      "Cú phá đỉnh Trading Range ở Phase C rồi đảo chiều giảm ngay sau đó — đối xứng với Spring, rũ bỏ những người mua đuổi giá.",
  },
  {
    abbr: "SOW",
    name: "Sign of Weakness — Dấu Hiệu Suy Yếu",
    meaning:
      "Nhịp giảm mạnh, khối lượng lớn, phá vỡ vùng hỗ trợ trong Trading Range — xác nhận cung đã áp đảo cầu.",
  },
  {
    abbr: "LPSY",
    name: "Last Point of Supply — Điểm Cung Cuối Cùng",
    meaning:
      "Nhịp hồi phục yếu ớt, khối lượng thấp, ngay sau SOW — thường là điểm bán an toàn cuối cùng trước khi downtrend chính thức tăng tốc.",
  },
];

const ACCUMULATION_GLOSSARY_EN: GlossaryTerm[] = [
  {
    abbr: "PS",
    name: "Preliminary Support",
    meaning:
      "The first notable buying after a long downtrend: volume rises and the price spread narrows. It isn't enough to stop the decline, but it's the first sign that the Composite Man is taking an interest.",
  },
  {
    abbr: "SC",
    name: "Selling Climax",
    meaning:
      "A panic-selling session with a huge price spread and volume. The price often closes far from the session low because hidden buying has absorbed most of the panic supply.",
  },
  {
    abbr: "AR",
    name: "Automatic Rally",
    meaning:
      "Right after the SC, selling pressure is exhausted and price bounces sharply with no news needed. The top of the AR sets the temporary upper boundary of the Trading Range.",
  },
  {
    abbr: "ST",
    name: "Secondary Test",
    meaning:
      "Price returns to the SC area to 'test' whether supply is gone, with markedly narrower spread and lower volume than the SC.",
  },
  {
    abbr: "Spring",
    name: "Spring",
    meaning:
      "A break below the Trading Range low in Phase C that quickly reverses upward — a trap that shakes out weak hands before the real uptrend begins.",
  },
  {
    abbr: "SOS",
    name: "Sign of Strength",
    meaning:
      "A strong advance with widening spread and heavy volume that breaks resistance inside the Trading Range — confirming demand now overpowers supply.",
  },
  {
    abbr: "LPS",
    name: "Last Point of Support",
    meaning:
      "A shallow, low-volume pullback right after the SOS — typically the last safe place to buy before the uptrend accelerates.",
  },
  {
    abbr: "JAC / BU",
    name: "Jump Across the Creek / Backup",
    meaning:
      "The 'jump over the creek' metaphor: price breaks through the supply zone above (the Creek), then 'backs up' to test it before continuing higher — interchangeable with the SOS/LPS pair.",
  },
];

const DISTRIBUTION_GLOSSARY_EN: GlossaryTerm[] = [
  {
    abbr: "PSY",
    name: "Preliminary Supply",
    meaning: "The first notable selling after a long uptrend — the mirror image of PS in Accumulation.",
  },
  {
    abbr: "BC",
    name: "Buying Climax",
    meaning:
      "An extreme FOMO buying session with a huge spread and volume but a weak close — the Composite Man quietly sells to the excited crowd.",
  },
  {
    abbr: "AR",
    name: "Automatic Reaction",
    meaning:
      "Right after the BC, price falls sharply on its own for lack of buying support — the bottom of the AR sets the temporary lower boundary of the Trading Range.",
  },
  {
    abbr: "ST",
    name: "Secondary Test",
    meaning:
      "Price returns to test the BC area; failing to push through on low volume confirms supply is taking control.",
  },
  {
    abbr: "UTAD",
    name: "Upthrust After Distribution",
    meaning:
      "A break above the Trading Range high in Phase C that quickly reverses down — the mirror of the Spring, shaking out late buyers chasing price.",
  },
  {
    abbr: "SOW",
    name: "Sign of Weakness",
    meaning:
      "A sharp decline on heavy volume that breaks support inside the Trading Range — confirming supply now overpowers demand.",
  },
  {
    abbr: "LPSY",
    name: "Last Point of Supply",
    meaning:
      "A weak, low-volume rally right after the SOW — typically the last safe place to sell before the downtrend accelerates.",
  },
];

export function getGlossary(locale: Locale): { accumulation: GlossaryTerm[]; distribution: GlossaryTerm[] } {
  return locale === "en"
    ? { accumulation: ACCUMULATION_GLOSSARY_EN, distribution: DISTRIBUTION_GLOSSARY_EN }
    : { accumulation: ACCUMULATION_GLOSSARY_VI, distribution: DISTRIBUTION_GLOSSARY_VI };
}
