// Dữ liệu mẫu cho trang "Ôn lại câu sai" — chưa nối với lưu trữ thật (Supabase sẽ làm sau).
// Nội dung câu hỏi/giải thích lấy thật từ /data/chapters để giao diện xem trước có ý nghĩa.
export interface ReviewSampleItem {
  chapterId: number;
  chapterTitle: string;
  questionPrompt: string;
  explanationSnippet: string;
  wrongDate: string; // dd/mm/yyyy
}

export const SAMPLE_REVIEW_ITEMS: ReviewSampleItem[] = [
  {
    chapterId: 2,
    chapterTitle: "Richard D. Wyckoff - Các Quy Tắc Thực Sự Của Trò Chơi",
    questionPrompt:
      "5 giai đoạn A-E của Sơ Đồ Tích Lũy/Phân Phối: giai đoạn nào là \"Building the Cause\"?",
    explanationSnippet:
      "Thứ tự đúng: |A| Stopping the Trend → |B| Building the Cause (Xây Dựng Mệnh Đề Nguyên Nhân) → |C| Test → |D| Defining the Trend → |E| Mark Up/Mark Down.",
    wrongDate: "12/05/2024",
  },
  {
    chapterId: 6,
    chapterTitle: "Francis Bacon - Tiết Lộ Bản Chất Xu Hướng Thị Trường",
    questionPrompt:
      "Vì sao Spring khối lượng CAO thường cần retest, còn Spring khối lượng THẤP đôi khi không cần?",
    explanationSnippet:
      "Khối lượng cao ở Spring cho thấy vẫn còn nguồn cung dồi dào ngay dưới hỗ trợ — cần retest với khối lượng giảm dần để xác nhận cung đã cạn trước khi tin tưởng mua vào.",
    wrongDate: "10/05/2024",
  },
  {
    chapterId: 3,
    chapterTitle: "Hành Động Dừng Của Xu Hướng Giảm",
    questionPrompt:
      "Vì sao Nhịp Phục Hồi Tự Động (AR) được xem là có phần \"đánh lừa\"?",
    explanationSnippet:
      "AR là kết quả của sự cạn kiệt cung trong thời gian ngắn — ấn tượng nhưng chỉ tạm thời. Sau AR, giá thường giảm trở lại hoặc dưới mức CLX.",
    wrongDate: "08/05/2024",
  },
];
