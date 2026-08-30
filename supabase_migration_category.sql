-- ترحيل: عمود القسم (سيارات، شاحنات، جرارات…)
-- شغّله في Supabase: SQL Editor > New query > الصق > Run

alter table public.cars
  add column if not exists category text not null default 'cars';

create index if not exists cars_category_idx on public.cars (category);

-- الإعلانات القديمة كلها سيارات
update public.cars set category = 'cars' where category is null or category = '';
