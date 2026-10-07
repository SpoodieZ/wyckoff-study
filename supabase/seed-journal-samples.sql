-- 3 bài Nhật Ký Giao Dịch mẫu (đề tài Wyckoff, mã cổ phiếu Việt Nam).
-- Chạy trong Supabase Dashboard → SQL Editor SAU KHI đã chạy schema.sql và
-- đăng nhập app ít nhất 1 lần (để có sẵn 1 dòng trong public.profiles).
-- Bài mẫu sẽ thuộc về tài khoản admin đầu tiên (hoặc profile bất kỳ nếu chưa có admin).
-- Chạy lại nhiều lần cũng an toàn (id cố định + on conflict do nothing).
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
select v.id::uuid, owner.id, v.symbol, v.trade_date::date, v.outcome, v.entry_zone, v.entry_reason, v.emotions, v.lesson, '{}'::text[],
       v.created_at::timestamptz, v.created_at::timestamptz
from owner,
(values
  (
    '00000000-0000-4000-8000-000000000001',
    'HPG', '2026-09-18', 'win',
    'Vùng 26,5 — ngay sau cú Spring phá đáy Trading Range rồi rút chân, nến Test sau đó khối lượng cạn kiệt.',
    'HPG đã đi ngang gần 4 tháng (Phase B) với biên độ và khối lượng thu hẹp dần. Phiên Spring phá xuống dưới đáy 26,8 nhưng đóng cửa quay lại trong range, khối lượng bán không lớn. Phiên Test sau đó khối lượng thấp nhất cả giai đoạn — đúng mẫu Spring #3 trong sách. Vào 1/3 vị thế ở Test, dừng lỗ dưới đáy Spring.',
    'Hơi sợ vì giá vừa phá đáy, tay muốn chờ thêm. Nhưng nhìn khối lượng cạn kiệt ở phiên Test nên tin vào kịch bản hấp thụ cung.',
    'Spring chỉ đáng tin khi có Test khối lượng thấp đi kèm — đừng vào ngay phiên phá đáy. Chia 3 phần vị thế giúp bình tĩnh hơn hẳn: phần đầu ở Test, phần hai ở LPS.',
    '2026-09-18 10:30:00+07'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'VNM', '2026-09-25', 'loss',
    'Vùng 62,0 — mua ngay khi nến phá kháng cự của Trading Range, chưa chờ nhịp lùi về.',
    'Thấy VNM bật mạnh vượt đường Creek với khối lượng lớn, nghĩ là SOS nên mua đuổi ngay. Không chờ LPS/BU (nhịp lùi kiểm tra lại cạnh Creek).',
    'FOMO — sợ mất cơ hội vì nến xanh dài, thấy mọi người đều khoe lãi. Vào lệnh nhanh, không đặt điểm dừng lỗ rõ ràng từ đầu.',
    'Giá quay lại xuyên xuống dưới Creek ngay hôm sau, hóa ra là upthrust giả chứ không phải SOS thật. Lần sau: SOS chỉ là tín hiệu để THEO DÕI, điểm vào lệnh phải là LPS/BU với khối lượng thấp. Luôn đặt dừng lỗ trước khi bấm mua.',
    '2026-09-25 14:15:00+07'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'FPT', '2026-10-02', 'win',
    'Vùng 118,5 — LPS sau pha nhảy qua Creek (JAC), giá lùi nhẹ về sát cạnh Creek với khối lượng thấp.',
    'FPT hoàn tất Tích lũy cấu trúc rõ (PS → SC → AR → ST → Spring), sau đó JAC với khối lượng lớn. Chờ đúng nhịp BU/LPS: nến nhỏ, bấc dưới, khối lượng thấp hơn hẳn nhịp JAC. Mục tiêu theo đếm Point & Figure ngang đáy range, tỷ lệ lợi nhuận/rủi ro khoảng 3:1.',
    'Bình tĩnh hơn lần VNM nhiều. Chờ được cả 2 ngày nhịp lùi mà không bị cám dỗ mua sớm.',
    'Kiên nhẫn chờ LPS thay vì đuổi JAC đã cải thiện rõ tỷ lệ lợi nhuận/rủi ro (điểm dừng lỗ gần hơn nhiều). Ghi nhớ: vào lệnh theo từng phần và chỉ khi cấu trúc đã đủ — đúng tinh thần "giao dịch cùng nhịp với Composite Man".',
    '2026-10-02 09:45:00+07'
  )
) as v(id, symbol, trade_date, outcome, entry_zone, entry_reason, emotions, lesson, created_at)
on conflict (id) do nothing;
