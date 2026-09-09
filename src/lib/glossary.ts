export interface GlossaryTerm {
  abbr: string;
  name: string;
  meaning: string;
}

export const ACCUMULATION_GLOSSARY: GlossaryTerm[] = [
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

export const DISTRIBUTION_GLOSSARY: GlossaryTerm[] = [
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
