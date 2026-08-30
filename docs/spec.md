# Spec: Website Ôn Tập "Phương Pháp Wyckoff" (Wyckoff Power Charting)

## 1. Mục tiêu

Website ôn tập cho 2 người dùng (bạn + 1 người bạn), nội dung dựa trên sách
*Wyckoff Power Charting* (Bruce Fraser, bản dịch Huy Vũ). Mục đích: **học – nhớ – vận dụng**,
không phải chỉ đọc lại. Vì vậy trọng tâm là kiểm tra chủ động (active recall), không phải
hiển thị lại nội dung sách để đọc thụ động.

---

## 2. ✅ ĐÃ GIẢI QUYẾT: nguồn hình ảnh biểu đồ

Đã trích xuất thành công **338 ảnh biểu đồ thật** trực tiếp từ file PDF gốc (bản PDF gốc, không
phải bản trong Project — bản Project chỉ có text). Ảnh đã được:
- Lọc bỏ logo/icon trang trí (chỉ giữ ảnh đủ lớn để là chart thật).
- Nén lại cho web (110MB → 21MB).
- Sắp xếp sẵn theo từng Phần (1-42) dựa trên số trang in trong sách.
- Có file `charts_manifest.csv` tra cứu: part, tên chương, số trang, kích thước, đường dẫn.

→ **Dùng phương án B (ảnh gốc sách thật)**, không cần tự vẽ sơ đồ minh họa nữa. Copy thư mục
`charts_by_part/` vào `/public/charts/` trong project Next.js, và dùng `charts_manifest.csv`
làm nguồn tra cứu khi soạn câu hỏi (mỗi câu hỏi trỏ `chartImage` tới đúng file ảnh phù hợp
với chương đó).

Các phần có nhiều ảnh nhất (ưu tiên soạn câu hỏi "nhận diện biểu đồ" ở đây): Phần 33 (34 ảnh),
39 (33 ảnh), 37 (28 ảnh), 22 (15 ảnh), 27 (13 ảnh), 13 và 17 (10 ảnh mỗi phần).

---

## 3. Cấu trúc nội dung

- **43 "chương"**: Giới thiệu + 42 Phần (theo đúng mục lục sách).
- Mỗi chương có: tiêu đề, tóm tắt ngắn (1 đoạn), và **bộ câu hỏi kiểm tra riêng**.
- Số lượng câu hỏi/chương: đề xuất **8–15 câu** cho chương nội dung dày (VD: Phần 8, 18, 22,
  25-31 về Accumulation/Distribution/POE), **5–8 câu** cho chương ngắn (VD: Phần 1-7).
- Loại câu hỏi nên trộn 3 dạng (không chỉ trắc nghiệm) để phục vụ "nhớ và vận dụng":
  1. **Trắc nghiệm** (khái niệm, định nghĩa) — dễ chấm tự động.
  2. **Nhận diện trên biểu đồ** (có ảnh) — "đây là điểm nào: PS/SC/AR/ST?" — trắc nghiệm nhưng bắt buộc có ảnh.
  3. **Câu hỏi tự luận ngắn, tự chấm bằng gợi ý** (giống cách mình hỏi bạn xuyên suốt cuộc trò
     chuyện này: "vì sao...", "điều gì sẽ xảy ra nếu...") — không có đáp án đúng/sai cứng, hiển thị
     gợi ý trả lời mẫu sau khi người dùng tự đánh giá.

---

## 4. Tính năng cần có

### Bắt buộc
- [ ] Danh sách 43 chương, hiển thị % hoàn thành từng chương cho mỗi người dùng.
- [ ] Làm quiz theo từng chương, chấm điểm ngay, hiện giải thích sau mỗi câu (giống cách mình
      làm quiz cho bạn — feedback ngay, không đợi hết bài).
- [ ] Với câu hỏi có `chartImage`, ảnh **luôn hiển thị ngay dưới câu hỏi**, trước khi chọn đáp án.
- [ ] Chọn người dùng khi vào web (2 người dùng cố định, không cần đăng ký phức tạp — 1 dropdown
      hoặc 2 nút chọn tên là đủ).
- [ ] Lưu tiến độ + lịch sử câu sai theo từng người dùng (persist được, không mất khi tắt trình duyệt).

### Nên có (phục vụ đúng mục tiêu "nhớ lâu")
- [ ] **Chế độ "Ôn lại câu đã sai"** — lọc riêng các câu người dùng từng trả lời sai, ôn theo kiểu
      lặp lại ngắt quãng (spaced repetition đơn giản: câu sai gần đây ưu tiên xuất hiện lại sớm hơn).
- [ ] **Chế độ "Ôn tổng hợp"** — trộn ngẫu nhiên câu hỏi từ nhiều chương, mô phỏng bài kiểm tra
      tổng kết toàn sách.
- [ ] Bảng xếp hạng đơn giản 2 người (ai nhớ tốt hơn — vui là chính, tạo động lực ôn tập cùng nhau).

### Không cần (tránh làm phức tạp hóa quá mức)
- Không cần hệ thống đăng ký/đăng nhập đầy đủ (email, mật khẩu...) — chỉ 2 người dùng, dùng
  1 link riêng tư + chọn tên là đủ.
- Không cần responsive phức tạp nếu chỉ dùng trên máy tính — nhưng nên responsive cơ bản vì có
  thể học trên điện thoại.

---

## 5. Đề xuất kỹ thuật (tech stack)

Vì chỉ phục vụ 2 người, ưu tiên **đơn giản, rẻ/miễn phí, dễ Claude Code tự triển khai xong trong
1 phiên làm việc**, không cần hạ tầng phức tạp:

- **Framework**: Next.js (App Router) + TypeScript + TailwindCSS — Claude Code làm rất tốt với
  stack này, dễ deploy.
- **Lưu dữ liệu quiz (nội dung câu hỏi)**: file JSON tĩnh trong repo (`/data/chapters/01.json`,
  `02.json`...) — không cần database cho phần NỘI DUNG, vì nội dung không đổi thường xuyên.
- **Lưu tiến độ người dùng** (cần chia sẻ giữa 2 thiết bị khác nhau, nên **không** dùng
  localStorage thuần): dùng **Supabase** (free tier, có Postgres + API sẵn, dễ tích hợp) hoặc
  **Vercel KV**. Claude Code có thể tự setup schema đơn giản: `user_id, chapter_id, question_id,
  is_correct, answered_at`.
- **Hosting**: Vercel (free tier, deploy bằng `git push`, có URL riêng để 2 người cùng truy cập).
- **Ảnh biểu đồ**: để trong `/public/charts/`, tham chiếu qua path trong file JSON câu hỏi.

---

## 6. Cấu trúc dữ liệu đề xuất (ví dụ 1 chương)

```json
{
  "chapterId": 3,
  "title": "Hành Động Dừng Của Xu Hướng Giảm",
  "summary": "PS, SC(CLX), AR, ST — 4 điểm xác nhận downtrend đã dừng lại...",
  "questions": [
    {
      "id": "ch3-q1",
      "type": "multiple_choice",
      "prompt": "Một phiên được gọi là 'Climatic' khi có đặc điểm gì?",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 1,
      "explanation": "...",
      "chartImage": null
    },
    {
      "id": "ch3-q2",
      "type": "chart_identify",
      "prompt": "Nhìn biểu đồ dưới đây, khoanh tròn màu vàng là điểm nào trong PS-SC-AR-ST?",
      "chartImage": "/charts/ch3-aapl-2008-example.png",
      "options": ["PS", "SC", "AR", "ST"],
      "correctIndex": 2,
      "explanation": "..."
    },
    {
      "id": "ch3-q3",
      "type": "short_answer_selfgrade",
      "prompt": "Vì sao sách khuyên không nên giao dịch ngay trong phiên SC/CLX?",
      "sampleAnswer": "Vì biến động cực mạnh, khó lường, ngay cả người có kinh nghiệm cũng tránh.",
      "chartImage": null
    }
  ]
}
```

---

## 7. Prompt hoàn chỉnh để dán vào Claude Code

Copy đoạn dưới đây làm prompt khởi động cho Claude Code (đã điền sẵn quyết định ở mục 2,
bạn chỉnh lại nếu chọn phương án khác):

```
Tôi muốn xây một website ôn tập kiến thức từ sách "Wyckoff Power Charting" (42 chương),
dùng cho 2 người dùng cố định (không cần đăng ký phức tạp).

Yêu cầu:
1. Next.js (App Router) + TypeScript + TailwindCSS, deploy lên Vercel.
2. Trang chủ: danh sách 43 chương (Giới thiệu + Phần 1-42), hiển thị % hoàn thành mỗi chương
   theo người dùng đang chọn.
3. Chọn người dùng bằng 2 nút bấm đơn giản ở đầu (tên: [điền tên bạn] / [điền tên bạn của bạn]),
   lưu lựa chọn vào cookie/localStorage.
4. Mỗi chương có trang quiz riêng, đọc dữ liệu từ file JSON trong /data/chapters/{id}.json
   theo đúng cấu trúc mẫu tôi sẽ cung cấp (có 3 loại câu: multiple_choice, chart_identify,
   short_answer_selfgrade).
5. Với câu hỏi có trường chartImage khác null, LUÔN hiển thị ảnh ngay dưới phần câu hỏi,
   trước khi người dùng chọn đáp án.
6. Chấm điểm ngay sau mỗi câu, hiện explanation, rồi mới cho sang câu tiếp theo (không đợi
   hết bài mới chấm).
7. Lưu tiến độ + lịch sử đúng/sai mỗi câu vào Supabase (Postgres), theo user_id.
8. Có chế độ "Ôn lại câu đã sai" (lọc câu từng sai, ưu tiên câu sai gần đây nhất) và chế độ
   "Ôn tổng hợp" (trộn ngẫu nhiên câu từ nhiều chương).
9. Giao diện tối giản, ưu tiên rõ ràng dễ đọc, responsive cơ bản cho điện thoại.
10. Setup sẵn 2-3 file JSON mẫu cho chương 1-3 làm ví dụ cấu trúc, các chương còn lại tôi sẽ
    tự bổ sung dữ liệu sau.

Hãy hỏi tôi nếu cần làm rõ trước khi bắt đầu, đặc biệt là phần setup Supabase (tôi có thể cần
hướng dẫn tạo project).
```

---

## 8. Việc bạn cần chuẩn bị TRƯỚC khi chạy Claude Code

1. ~~Quyết định phương án ảnh biểu đồ~~ — **Xong** (mục 2), đã có 338 ảnh + manifest.
2. Tạo tài khoản Supabase (miễn phí) nếu dùng phương án lưu tiến độ như đề xuất.
3. Chuẩn bị dữ liệu câu hỏi cho từng chương — đây là phần tốn thời gian nhất. Mình có thể giúp
   bạn soạn sẵn bộ câu hỏi (dạng JSON đúng cấu trúc trên) cho từng chương ngay trong cuộc trò
   chuyện này, giống cách mình đã làm quiz tương tác cho Phần 1-3 — chỉ cần bạn xác nhận muốn
   làm theo cách này, mình sẽ soạn dần từng chương.

## 9. Prompt thiết kế giao diện (đã dùng cho v0/Stitch)

Bản đầy đủ đã chốt — lưu lại đây để tham chiếu, phòng khi cần tạo lại hoặc chỉnh sửa sau:

```
Thiết kế giao diện cho một web app học tập cá nhân "Wyckoff Study" — ôn tập kiến thức
từ sách Wyckoff Power Charting, dùng cho 2 người dùng.

HƯỚNG THẨM MỸ: "Trạm phân tích" (analyst desk) — lấy cảm hứng trực tiếp từ giao diện
TradingView, vì các câu hỏi sẽ nhúng ảnh chụp chart nền tối thật. Không dùng giao diện
nền trắng kiểu app học tập thông thường.

BẢNG MÀU:
- Nền chính: #131722 (xanh than rất tối, giống nền TradingView)
- Nền panel/card: #1E222D
- Chữ chính: #D1D4DC, chữ phụ: #787B86
- Accent đúng/thành công: #1D9E75 (xanh lá — trùng màu nến tăng)
- Accent sai/cảnh báo: #E5484D (đỏ — trùng màu nến giảm)
- Accent trung tính/tương tác: #FFB800 (vàng hổ phách — dùng cho nút chính, tiến độ)

TYPOGRAPHY: Font UI chính dùng sans-serif hình học gọn (kiểu Inter). Các con số
(phần trăm hoàn thành, điểm số, số thứ tự chương) dùng font monospace (kiểu JetBrains
Mono) để tạo cảm giác "dữ liệu/terminal" — đúng tinh thần đọc bảng giá.

BỐ CỤC: Sidebar bên trái liệt kê 43 chương (Giới thiệu + Phần 1-42) theo kiểu
"watchlist" — mỗi dòng có tên chương + thanh tiến độ nhỏ ngang (giống thanh volume bar),
không phải progress bar tròn kiểu app thông thường. Vùng nội dung chính bên phải.

ĐIỂM NHẤN THỊ GIÁC (signature element): chuỗi kết quả gần đây của mỗi chương hiển thị
dạng một dải nến nhỏ (mini candlestick strip) — câu trả lời đúng = nến xanh đi lên,
câu sai = nến đỏ đi xuống — thay vì thanh progress bar thông thường. Dùng lại chi tiết
này ở cả sidebar (thu nhỏ) và màn hình kết quả (đầy đủ).

CÁC MÀN HÌNH CẦN THIẾT KẾ:
1. Trang chủ: sidebar danh sách chương (như trên) + góc trên có nút chuyển đổi
   người dùng (2 nút tên, không cần form đăng nhập). Card lớn ở giữa hiện "chương đang
   học dở" để tiếp tục nhanh.
2. Màn hình quiz: câu hỏi ở trên, NẾU có ảnh biểu đồ thì ảnh hiện ngay dưới câu hỏi.
   Khung ảnh có viền mảnh sáng nhẹ (1px, màu #363A45) + bóng đổ nhẹ, tạo cảm giác
   "màn hình con" tách biệt khỏi nền app, giữ đúng tỷ lệ ảnh gốc, không méo.
   4 lựa chọn dạng nút bấm full-width bên dưới. Nút xác nhận đáp án ghi "Kiểm tra".
   Sau khi chọn: đáp án đúng sáng xanh, đáp án sai (nếu chọn nhầm) sáng đỏ, hiện khung
   giải thích ngay bên dưới, nút chuyển câu ghi "Câu tiếp theo".
3. Màn hình "Ôn lại câu sai": danh sách câu từng sai, có thể lọc theo chương. Nếu
   danh sách rỗng, hiện thông báo: "Chưa có câu nào cần ôn lại — bạn đang nhớ tốt đấy".
4. Màn hình kết quả cuối bài: điểm số, dải nến kết quả (như mô tả ở trên) theo từng
   chương đã ôn, nút "Ôn lại câu sai" và "Chương tiếp theo".

ICON: chỉ dùng icon dạng đường nét mảnh (outline, stroke-based), không dùng icon màu
mè, gradient, hay minh họa 3D/hoạt hình.

YÊU CẦU KHÁC: chữ đủ lớn dễ đọc trên di động (đây là app học, sẽ dùng nhiều trên điện
thoại lúc rảnh), trạng thái focus bàn phím rõ ràng, hạn chế hiệu ứng chuyển động thừa —
ưu tiên rõ ràng, "công cụ làm việc nghiêm túc" hơn là vui nhộn.
```
