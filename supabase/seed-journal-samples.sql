-- 3 bài Nhật Ký Giao Dịch mẫu, mỗi bài kèm biểu đồ thật lấy từ sách (CMG, PII, STLD).
-- Chạy trong Supabase Dashboard → SQL Editor SAU KHI đã chạy schema.sql và
-- đăng nhập app ít nhất 1 lần (để có sẵn 1 dòng trong public.profiles).
-- Bài mẫu thuộc về tài khoản admin đầu tiên (hoặc profile bất kỳ nếu chưa có admin).
-- Chạy lại nhiều lần an toàn: id cố định, bài đã có sẽ được cập nhật theo nội dung mới.
-- Ảnh được tải từ chính trang web (https://wyckoff-study.vercel.app/charts/...).
-- Muốn xóa bài mẫu: delete from public.journal_entries where id in (
--   '00000000-0000-4000-8000-000000000001',
--   '00000000-0000-4000-8000-000000000002',
--   '00000000-0000-4000-8000-000000000003');

with owner as (
  select id from public.profiles
  order by (role = 'admin') desc, display_name
  limit 1
)
insert into public.journal_entries
  (id, owner_id, symbol, trade_date, outcome, entry_zone, entry_reason, emotions, lesson, image_urls, created_at, updated_at)
select v.id::uuid, owner.id, v.symbol, v.trade_date::date, v.outcome, v.entry_zone, v.entry_reason, v.emotions, v.lesson,
       array[v.image_url]::text[], v.created_at::timestamptz, v.created_at::timestamptz
from owner,
(values
  (
    '00000000-0000-4000-8000-000000000001',
    'CMG', '2008-11-24', 'win',
    'Khoảng $40–42 — ngay phiên Spring #3: giá chỉ chọc nhẹ xuống dưới đáy cũ (~$40) rồi đóng cửa tăng. Dừng lỗ ngay dưới đáy Spring (~$38).',
    '(Bài mẫu minh họa theo biểu đồ CMG 2008-09 trong sách.) CMG vừa đi qua PS → SCLX → AR → ST rồi đi ngang hai tháng trong Trading Range. Phiên Spring phá đáy rất nhẹ, khối lượng thấp, không có đợt tăng khối lượng ở nhịp đẩy xuống cuối cùng, và đúng ngày Spring là nến tăng với khối lượng nhỉnh hơn một chút. Đây là mẫu Spring #3: có thể mua ngay, không cần chờ Test.',
    'Lo vì thị trường chung cuối 2008 rất xấu và giá vừa phá đáy. Nhưng cấu trúc và khối lượng cạn kiệt nói ngược lại với nỗi sợ, nên chọn làm theo cấu trúc.',
    'Spring #3 khác #1/#2: phá đáy nông, khối lượng thấp, đóng cửa hồi lại — mua được ngay chứ không phải chờ Test. Dừng lỗ đặt sát dưới đáy Spring nên rủi ro nhỏ, trong khi phía sau còn Creek 1, Creek 2 và hai điểm LPS để gia tăng vị thế. Đến tháng 4/2009 giá lên gần $79.',
    'https://wyckoff-study.vercel.app/charts/part_06/p020_chart-094.jpg',
    '2026-09-18 10:30:00+07'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'PII', '2017-05-12', 'loss',
    'Khoảng $88–90 — mua ngay khi nến nhảy qua đường Creek (JAC đầu tiên), dừng lỗ chặt sát dưới đáy nến JAC.',
    '(Bài mẫu minh họa theo biểu đồ PII 2016-18 trong sách.) Thấy PII nhảy qua Creek kèm khối lượng lớn nên vào lệnh luôn. Bỏ qua một chi tiết quan trọng: các thanh "cầu" của cú nhảy này đóng cửa ở phần THẤP của biên độ — dấu hiệu nguồn cung vẫn còn (sách ghi "1st JAC has Signs of Supply").',
    'Vội, sợ lỡ nhịp bứt phá. Chỉ nhìn khối lượng lớn mà không nhìn nến đóng cửa ở đâu trong biên độ.',
    'Khối lượng lớn chưa đủ để kết luận JAC thật — phải xem vị trí đóng cửa của nến. Giá lùi về nhịp BU quanh $83–85 và quét mất điểm dừng lỗ chặt; sau đó mới có cú JAC thứ hai mạnh, đẩy giá lên vùng $130+. Lần sau: JAC đầu có dấu hiệu cung thì chờ nhịp BU nông với khối lượng cạn (hoặc chờ JAC thứ hai), và đặt dừng lỗ rộng hơn biên độ BU thông thường.',
    'https://wyckoff-study.vercel.app/charts/part_39/p267_chart-930.jpg',
    '2026-09-25 14:15:00+07'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'STLD', '2016-04-08', 'win',
    'Chia 3 phần: #1 ≈ $16,3 (giá đóng cửa trở lại trên đáy cũ sau Spring & Test), #2 ≈ $17,0–17,5 (LPS), #3 ≈ $19,5 (LPS/BU sau khi vượt Creek). Giá vốn trung bình ≈ $17,83.',
    '(Bài mẫu minh họa theo biểu đồ STLD 2015-16 trong sách.) STLD tạo Spring & Test cuối tháng 1/2016 quanh $15,5. Mua #1 khi giá đóng cửa trở lại trên đáy cũ — xác nhận Spring. Mua #2 ở LPS khi xuất hiện nến cầu có spread và khối lượng. Mua #3 ở nhịp BU sau khi giá vượt đường kháng cự ~$19,5.',
    'Chia vị thế làm 3 phần giúp nhẹ đầu hẳn: không cần bắt đúng đáy, cũng không sợ lỡ cú bứt phá.',
    'Mỗi lần mua thêm thì nâng điểm dừng lỗ cho cả vị thế lên ngay dưới đáy của Spring hoặc LPS gần nhất (sau lần mua #2, dừng lỗ dưới $16,75 → lần #1 đã hòa vốn). Điểm vào lệnh không bao giờ hoàn hảo nên mua theo vùng, tìm nến cầu có spread và khối lượng. Đến 8/4/2016 giá ≈ $22,8, lãi khoảng 28% trên giá vốn trung bình.',
    'https://wyckoff-study.vercel.app/charts/part_27/p138_chart-513.jpg',
    '2026-10-02 09:45:00+07'
  )
) as v(id, symbol, trade_date, outcome, entry_zone, entry_reason, emotions, lesson, image_url, created_at)
on conflict (id) do update set
  symbol = excluded.symbol,
  trade_date = excluded.trade_date,
  outcome = excluded.outcome,
  entry_zone = excluded.entry_zone,
  entry_reason = excluded.entry_reason,
  emotions = excluded.emotions,
  lesson = excluded.lesson,
  image_urls = excluded.image_urls,
  updated_at = now();
