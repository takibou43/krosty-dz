-- ترحيل: انتهاء صلاحية الإعلانات + إلزام تسجيل الدخول للنشر
-- شغّله في Supabase: SQL Editor > New query > الصق > Run

-- ═══════════════════════════════════════════
-- 1) عمود تاريخ الانتهاء
-- ═══════════════════════════════════════════
alter table public.cars
  add column if not exists expires_at timestamptz;

-- الإعلانات القديمة: امنحها 3 أيام من الآن حتى لا تختفي فجأة
update public.cars
  set expires_at = now() + interval '3 days'
  where expires_at is null;

-- الإعلانات الجديدة تنتهي بعد 3 أيام تلقائياً
alter table public.cars
  alter column expires_at set default (now() + interval '3 days');

alter table public.cars
  alter column expires_at set not null;

create index if not exists cars_expires_at_idx on public.cars (expires_at desc);

-- ═══════════════════════════════════════════
-- 2) سياسات الأمان (RLS)
-- ═══════════════════════════════════════════

-- القراءة: الجمهور يرى الإعلانات السارية فقط
drop policy if exists "Public can view cars" on public.cars;
drop policy if exists "Public can view active cars" on public.cars;
create policy "Public can view active cars"
  on public.cars for select
  using (expires_at > now());

-- صاحب الإعلان يرى إعلاناته كلها (بما فيها المنتهية) في صفحة «حسابي»
drop policy if exists "Owners can view their own cars" on public.cars;
create policy "Owners can view their own cars"
  on public.cars for select
  using (auth.uid() = user_id);

-- النشر: للمسجّلين فقط، وكل مستخدم ينشر باسمه هو
drop policy if exists "Anyone can insert a car" on public.cars;
drop policy if exists "Authenticated users insert own cars" on public.cars;
create policy "Authenticated users insert own cars"
  on public.cars for insert
  to authenticated
  with check (auth.uid() = user_id);

-- التعديل والحذف: لصاحب الإعلان فقط
drop policy if exists "Owners can update their cars" on public.cars;
create policy "Owners can update their cars"
  on public.cars for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Owners can delete their cars" on public.cars;
create policy "Owners can delete their cars"
  on public.cars for delete
  using (auth.uid() = user_id);

-- ═══════════════════════════════════════════
-- 3) الحذف النهائي بعد 30 يوماً من الانتهاء
-- ═══════════════════════════════════════════
create extension if not exists pg_cron;

create or replace function public.purge_old_cars()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.cars
   where expires_at < now() - interval '30 days';
$$;

-- يعمل يومياً الساعة 03:00 (توقيت UTC)
select cron.unschedule('purge-old-cars')
  where exists (select 1 from cron.job where jobname = 'purge-old-cars');

select cron.schedule(
  'purge-old-cars',
  '0 3 * * *',
  $$ select public.purge_old_cars(); $$
);
