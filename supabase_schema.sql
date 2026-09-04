-- ============================================================
-- 2026 River Run '세종' — Supabase 스키마 (RLS 없음 · 전체 공개 접근)
-- Supabase 대시보드 → SQL Editor → 전체 붙여넣고 Run
-- ============================================================

-- ------------------------------------------------------------
-- 1. event (행사 정보 — 항상 1행만 존재)
-- ------------------------------------------------------------
create table event (
  id smallint primary key default 1 check (id = 1),
  title text not null,
  subtitle text,
  date timestamp not null,
  location text,
  distance text,
  fee integer not null default 0,
  host text,
  organizer text,
  apply_open timestamp not null,
  apply_close timestamp not null,
  max_capacity integer not null default 300,
  -- 참가비 입금 계좌 (신청완료 화면에 안내용으로 표시)
  bank_name text,
  account_number text,
  account_holder text
);

insert into event (id, title, subtitle, date, location, distance, fee, host, organizer, apply_open, apply_close, max_capacity)
values (
  1, '2026 River Run ''세종''', '우리 강·하천 달리기', '2026-10-17 09:00',
  '세종보 홍보관 일원 (세종시 나리로 82)', '10km (단일)', 15000,
  'K-water (한국수자원공사)', '케이워터운영관리(주)',
  '2026-09-04 14:00', '2026-09-11 12:00', 300
);

-- ------------------------------------------------------------
-- 2. pace_groups (페이스 그룹 — master/runner/starter 고정 3행)
-- 정원 개념 없음 — 참가자가 자유롭게 선택하는 그룹이며 applied는 순수 통계용.
-- 선착순 마감 기준은 이 테이블이 아니라 event.max_capacity 하나뿐.
-- applied는 아래 트리거가 applicants 변경 시마다 자동 재계산 (수동 sync 불필요)
-- ------------------------------------------------------------
create table pace_groups (
  id text primary key,
  label text not null,
  description text,
  applied integer not null default 0
);

insert into pace_groups (id, label, description, applied) values
  ('master',  'Master',  '50분 이내 완주', 0),
  ('runner',  'Runner',  '60분 이내 완주', 0),
  ('starter', 'Starter', '60분 이상 러닝', 0);

-- ------------------------------------------------------------
-- 3. notices (공지사항)
-- ------------------------------------------------------------
create table notices (
  id bigint generated always as identity primary key,
  badge text not null check (badge in ('important','info','event')),
  badge_label text not null,
  title text not null,
  body text,
  image_url text,
  date date not null default current_date,
  pinned boolean not null default false,
  created_at timestamp not null default now()
);

-- ------------------------------------------------------------
-- 4. gallery (갤러리 — 실제 이미지 파일은 Storage 버킷에, 여기엔 URL만)
-- ------------------------------------------------------------
create table gallery (
  id bigint generated always as identity primary key,
  src text not null,
  caption text,
  created_at timestamp not null default now()
);

-- ------------------------------------------------------------
-- 5. applicants (참가 신청자 — 개인/가족/단체 공용)
-- ------------------------------------------------------------
create sequence applicant_seq start 100001;

create table applicants (
  id text primary key default ('RR-' || nextval('applicant_seq')::text),
  type text not null check (type in ('individual','group','family')),
  -- 개인 전용
  name text,
  birth text,
  address text,
  gender text check (gender in ('male','female')),
  size text check (size in ('S','M','L','XL','XXL')),
  -- 단체/가족 전용
  team_name text,
  leader_name text,
  members jsonb,
  -- 공통
  phone text not null,
  email text,
  pace text not null references pace_groups(id),
  password text not null,
  -- 입금 확인 (정원 차감과는 무관 — 신청 즉시 정원에 카운트되고, 이 값은 관리자 확인용 상태 표시만)
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','cancelled')),
  created_at timestamp not null default now()
);

create index idx_applicants_phone on applicants (regexp_replace(phone, '\D', '', 'g'));

-- ------------------------------------------------------------
-- 5-1. applicants_cancelled (참가자 본인이 취소한 신청의 백업 — 입금대기 상태일 때만 취소 가능)
-- applicants에서 삭제되기 직전 스냅샷을 그대로 보관. 취소한 본인은 더 이상 조회할 수 없지만
-- 관리자는 이 테이블에서 이후에도 확인 가능. CHECK 제약은 두지 않아 원본 스키마가 바뀌어도 백업에 영향 없음.
-- ------------------------------------------------------------
create table applicants_cancelled (
  id text primary key,
  type text not null,
  name text,
  birth text,
  address text,
  gender text,
  size text,
  team_name text,
  leader_name text,
  members jsonb,
  phone text,
  email text,
  pace text,
  password text,
  payment_status text,
  created_at timestamp,
  cancelled_at timestamp not null default now()
);

-- pace_groups.applied 자동 재계산 (개인=1명, 단체·가족=members 배열 길이)
-- 기존 프론트 코드의 syncPaceApplied()는 family를 집계에서 빠뜨리는 버그가 있었는데 여기선 수정함
create or replace function recalc_pace_applied() returns trigger
language plpgsql as $$
declare
  affected_pace text;
begin
  affected_pace := case when TG_OP = 'DELETE' then OLD.pace else NEW.pace end;

  update pace_groups pg
  set applied = coalesce((
    select sum(case when a.type = 'individual' then 1 else jsonb_array_length(coalesce(a.members, '[]'::jsonb)) end)
    from applicants a
    where a.pace = pg.id
  ), 0)
  where pg.id = affected_pace;

  if TG_OP = 'UPDATE' and OLD.pace is distinct from NEW.pace then
    update pace_groups pg
    set applied = coalesce((
      select sum(case when a.type = 'individual' then 1 else jsonb_array_length(coalesce(a.members, '[]'::jsonb)) end)
      from applicants a
      where a.pace = pg.id
    ), 0)
    where pg.id = OLD.pace;
  end if;

  return coalesce(NEW, OLD);
end;
$$;

create trigger trg_applicants_recalc_pace
after insert or update or delete on applicants
for each row execute function recalc_pace_applied();

-- 참가신청 화면(유형 선택)의 정원 마감 판단용 — 전체 신청 인원 합계만 반환 (개인정보 노출 없음)
create or replace function total_applied_count()
returns integer
language sql
stable
as $$
  select coalesce(sum(case when type = 'individual' then 1 else jsonb_array_length(coalesce(members, '[]'::jsonb)) end), 0)::integer
  from applicants;
$$;
grant execute on function total_applied_count() to anon;

-- 접수확인(조회) 전용 — 이름·연락처·비밀번호가 정확히 일치하는 신청 1건만 반환 (전체 명단 노출 없음)
create or replace function lookup_applicant(p_name text, p_phone text, p_password text)
returns setof applicants
language sql
stable
as $$
  select *
  from applicants
  where password = p_password
    and regexp_replace(phone, '\D', '', 'g') = regexp_replace(p_phone, '\D', '', 'g')
    and (
      (type = 'individual' and name = p_name)
      or (type in ('group','family') and (leader_name = p_name or team_name = p_name))
    );
$$;
grant execute on function lookup_applicant(text, text, text) to anon;

-- 참가신청 제출 직전 중복 신청 확인 — 이름·생년월일·연락처가 모두 일치하는 기존 신청자(개인 또는
-- 가족·단체 구성원 중 누구든)를 찾아 유형·팀명과 함께 반환. p_candidates는 [{"name","birth","phone"}...]
-- 형태의 jsonb 배열 (개인은 1명, 가족·단체는 구성원 전체를 넘김).
create or replace function check_duplicate_applicants(p_candidates jsonb)
returns table(type text, team_name text, name text, birth text, phone text)
language sql
stable
as $$
  select a.type, null::text, a.name, a.birth, a.phone
  from applicants a, jsonb_array_elements(p_candidates) c
  where a.type = 'individual'
    and a.name = c->>'name'
    and regexp_replace(a.birth, '\D', '', 'g') = regexp_replace(c->>'birth', '\D', '', 'g')
    and regexp_replace(a.phone, '\D', '', 'g') = regexp_replace(c->>'phone', '\D', '', 'g')

  union all

  select a.type, a.team_name, m->>'name', m->>'birth', m->>'phone'
  from applicants a, jsonb_array_elements(a.members) m, jsonb_array_elements(p_candidates) c
  where a.type in ('group','family')
    and m->>'name' = c->>'name'
    and regexp_replace(m->>'birth', '\D', '', 'g') = regexp_replace(c->>'birth', '\D', '', 'g')
    and regexp_replace(m->>'phone', '\D', '', 'g') = regexp_replace(c->>'phone', '\D', '', 'g');
$$;
grant execute on function check_duplicate_applicants(jsonb) to anon;

-- ============================================================
-- 권한 — RLS 사용 안 함, anon 키에 전체 테이블 읽기/쓰기 허용
-- ============================================================
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- ============================================================
-- Storage — 갤러리 이미지 저장용 버킷 (공개 읽기 + 공개 업로드/삭제)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "gallery public select" on storage.objects for select using (bucket_id = 'gallery');
create policy "gallery public insert" on storage.objects for insert with check (bucket_id = 'gallery');
create policy "gallery public update" on storage.objects for update using (bucket_id = 'gallery');
create policy "gallery public delete" on storage.objects for delete using (bucket_id = 'gallery');

-- 공지사항 첨부 이미지용 버킷
insert into storage.buckets (id, name, public)
values ('notices', 'notices', true)
on conflict (id) do nothing;

create policy "notices public select" on storage.objects for select using (bucket_id = 'notices');
create policy "notices public insert" on storage.objects for insert with check (bucket_id = 'notices');
create policy "notices public update" on storage.objects for update using (bucket_id = 'notices');
create policy "notices public delete" on storage.objects for delete using (bucket_id = 'notices');
