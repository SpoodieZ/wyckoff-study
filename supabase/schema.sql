-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor → New query → Run.
-- Trước khi chạy: bật đăng nhập Google trong Authentication → Providers → Google,
-- và bật "Allow new user signups" trong Authentication → Settings — ai cũng đăng
-- nhập được bằng Gmail, nhưng mặc định chỉ có quyền xem (role = 'viewer').
--
-- Sau khi chạy file này: đăng nhập vào app bằng Gmail của chính bạn 1 lần (để
-- tài khoản + profile được tạo), rồi chạy riêng dòng UPDATE ở mục 7 bên dưới để
-- tự phong 'admin' cho mình. Từ đó vào trang /journal/members trong app để cấp
-- quyền 'member' cho bạn bè, không cần đụng SQL nữa.

-- 1) Bảng profiles: map auth.users -> tên hiển thị + vai trò
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  email text,
  role text not null default 'viewer' check (role in ('viewer', 'member', 'admin'))
);

-- Nếu bảng đã tồn tại từ trước (chưa có cột role/email), thêm cột vào:
alter table public.profiles
  add column if not exists role text not null default 'viewer';
alter table public.profiles
  add column if not exists email text;
alter table public.profiles
  drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('viewer', 'member', 'admin'));

-- Bảng danh sách email được admin duyệt trước — ai đăng nhập lần đầu bằng
-- Gmail trùng trong bảng này sẽ được cấp quyền 'member' ngay, không cần chờ
-- admin duyệt thủ công sau khi họ đã đăng nhập.
create table if not exists public.invited_members (
  email text primary key,
  invited_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Tự tạo 1 dòng profiles mỗi khi có user mới trong auth.users — role mặc định
-- 'viewer', trừ khi email đã có trong invited_members thì lên thẳng 'member'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  initial_role text := 'viewer';
begin
  if exists (select 1 from public.invited_members where email = new.email) then
    initial_role := 'member';
  end if;

  insert into public.profiles (id, display_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    initial_role
  )
  on conflict (id) do nothing;

  delete from public.invited_members where email = new.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Hàm tiện ích: người đang gọi request có quyền viết (member/admin) không?
create or replace function public.has_write_access()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('member', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 2) Bảng journal_entries
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  symbol text not null,
  trade_date date not null,
  outcome text not null check (outcome in ('win', 'loss')),
  entry_zone text not null default '',
  entry_reason text not null default '',
  emotions text not null default '',
  lesson text not null default '',
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Bảng journal_comments
create table if not exists public.journal_comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.journal_entries (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- 4) Row Level Security
alter table public.profiles enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_comments enable row level security;
alter table public.invited_members enable row level security;

-- Chỉ admin mới xem/thêm/xóa được danh sách email mời trước.
drop policy if exists "invited_members: admin only" on public.invited_members;
create policy "invited_members: admin only"
  on public.invited_members for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Mở cho cả người chưa đăng nhập (to public) vì trang chủ hiện có preview vài
-- bài Nhật Ký mới nhất kèm tên người đăng cho mọi khách truy cập.
drop policy if exists "profiles: read all" on public.profiles;
create policy "profiles: read all"
  on public.profiles for select
  to public
  using (true);

-- Chỉ admin mới đổi được role của người khác (và của chính mình) — chặn tự nâng quyền.
drop policy if exists "profiles: admin can update roles" on public.profiles;
create policy "profiles: admin can update roles"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Ai cũng đọc được nhật ký, kể cả khách chưa đăng nhập — trang chủ hiện preview
-- vài bài mới nhất công khai; chỉ tạo/sửa/xóa bài mới cần đăng nhập.
drop policy if exists "journal_entries: read all" on public.journal_entries;
create policy "journal_entries: read all"
  on public.journal_entries for select
  to public
  using (true);

-- Chỉ member/admin mới được tạo bài, và chỉ tạo cho chính mình.
drop policy if exists "journal_entries: insert own" on public.journal_entries;
create policy "journal_entries: insert own"
  on public.journal_entries for insert
  to authenticated
  with check (owner_id = auth.uid() and public.has_write_access());

drop policy if exists "journal_entries: update own" on public.journal_entries;
create policy "journal_entries: update own"
  on public.journal_entries for update
  to authenticated
  using (owner_id = auth.uid() and public.has_write_access())
  with check (owner_id = auth.uid() and public.has_write_access());

drop policy if exists "journal_entries: delete own" on public.journal_entries;
create policy "journal_entries: delete own"
  on public.journal_entries for delete
  to authenticated
  using (owner_id = auth.uid() and public.has_write_access());

drop policy if exists "journal_comments: read all" on public.journal_comments;
create policy "journal_comments: read all"
  on public.journal_comments for select
  to authenticated
  using (true);

-- Chỉ member/admin mới bình luận được, và chỉ vào bài của NGƯỜI KHÁC.
drop policy if exists "journal_comments: insert on others entries" on public.journal_comments;
create policy "journal_comments: insert on others entries"
  on public.journal_comments for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.has_write_access()
    and exists (
      select 1 from public.journal_entries e
      where e.id = entry_id and e.owner_id <> auth.uid()
    )
  );

drop policy if exists "journal_comments: update own" on public.journal_comments;
create policy "journal_comments: update own"
  on public.journal_comments for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "journal_comments: delete own" on public.journal_comments;
create policy "journal_comments: delete own"
  on public.journal_comments for delete
  to authenticated
  using (author_id = auth.uid());

-- 5) Storage bucket cho ảnh biểu đồ (public read, chỉ member/admin mới upload được)
insert into storage.buckets (id, name, public)
values ('journal-charts', 'journal-charts', true)
on conflict (id) do nothing;

drop policy if exists "journal-charts: public read" on storage.objects;
create policy "journal-charts: public read"
  on storage.objects for select
  to public
  using (bucket_id = 'journal-charts');

drop policy if exists "journal-charts: authenticated upload" on storage.objects;
create policy "journal-charts: authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'journal-charts' and public.has_write_access());

drop policy if exists "journal-charts: owner delete" on storage.objects;
create policy "journal-charts: owner delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'journal-charts' and owner = auth.uid());

-- 6) (Tùy chọn) Đặt tên hiển thị đẹp hơn cho chính mình sau khi đăng nhập lần đầu,
-- nếu không muốn dùng tên/email lấy tự động từ tài khoản Google.
-- update public.profiles set display_name = 'Người 1' where id = auth.uid();

-- 7) BẮT BUỘC: sau khi đăng nhập bằng Gmail của bạn lần đầu, sửa email bên dưới
-- cho đúng rồi chạy RIÊNG dòng này để tự phong admin cho chính mình.
-- update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'ban@gmail.com');
