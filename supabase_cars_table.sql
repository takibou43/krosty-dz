-- جدول السيارات لمنصة كروستي DZ
-- شغّل هذا الملف في Supabase: SQL Editor > New query > الصق المحتوى > Run

create extension if not exists "uuid-ossp";

create table if not exists public.cars (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  brand text not null,
  model text not null,
  year integer not null,
  wilaya text not null,
  fuel_type text not null check (fuel_type in ('Essence', 'Diesel', 'GPL', 'Hybride', 'Électrique')),
  gearbox text not null check (gearbox in ('Manuelle', 'Automatique')),
  mileage integer not null default 0,
  documents text check (documents in ('صافية', 'Carte Grise', 'رخصة مجاهدين')),
  price numeric not null,
  phone_number text not null,
  images text[] default '{}',
  is_featured boolean not null default false,
  featured_until timestamptz,
  created_at timestamptz not null default now()
);

-- فهارس لتسريع البحث والفلترة
create index if not exists cars_wilaya_idx on public.cars (wilaya);
create index if not exists cars_brand_idx on public.cars (brand);
create index if not exists cars_created_at_idx on public.cars (created_at desc);
create index if not exists cars_is_featured_idx on public.cars (is_featured);

-- تفعيل أمان الصفوف (RLS)
alter table public.cars enable row level security;

-- يمكن للجميع قراءة الإعلانات (السوق عام)
create policy if not exists "Public can view cars"
  on public.cars for select
  using (true);

-- يمكن للجميع (بما فيهم الزوار غير المسجلين) إضافة إعلان
create policy if not exists "Anyone can insert a car"
  on public.cars for insert
  with check (true);

-- تعديل/حذف الإعلان مسموح فقط لصاحبه إن كان مسجلاً
create policy if not exists "Owners can update their cars"
  on public.cars for update
  using (auth.uid() = user_id);

create policy if not exists "Owners can delete their cars"
  on public.cars for delete
  using (auth.uid() = user_id);
