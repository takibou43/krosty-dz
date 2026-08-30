'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { isFavorite, toggleFavorite } from '@/utils/favorites';

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'الآن';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`;
  const years = Math.floor(months / 12);
  return `منذ ${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
}

function formatMileage(km) {
  const n = Number(km);
  if (!n || Number.isNaN(n)) return null;
  return `${n.toLocaleString('en-US')} كم`;
}

function FavoriteButton({ carId, className = '' }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(carId));
  }, [carId]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFav(toggleFavorite(carId));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={fav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      aria-pressed={fav}
      className={`flex items-center justify-center rounded-full border border-line bg-white/95 backdrop-blur transition hover:border-accent ${
        fav ? 'text-accent' : 'text-slate-400 hover:text-accent'
      } ${className}`}
    >
      <Icon name="heart" filled={fav} className="h-[18px] w-[18px]" strokeWidth={1.9} />
    </button>
  );
}

function SpecItem({ icon, value }) {
  if (!value) return null;
  return (
    <span className="inline-flex min-w-0 items-center gap-1 text-slate-600">
      <Icon name={icon} className="h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={1.8} />
      <span className="truncate nums">{value}</span>
    </span>
  );
}

function Placeholder({ size = 'h-8 w-8' }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
      <Icon name="car" className={size} strokeWidth={1.2} />
    </div>
  );
}

export default function CarCard({ car, view = 'grid' }) {
  const cover = Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : null;
  const posted = timeAgo(car.created_at);
  const price = Number(car.price || 0).toLocaleString('en-US');
  const mileage = formatMileage(car.mileage);
  const photoCount = Array.isArray(car.images) ? car.images.length : 0;

  /* ---------- عرض القائمة ---------- */
  if (view === 'list') {
    return (
      <article className="group relative flex overflow-hidden rounded-card border border-line bg-white shadow-card transition hover:border-slate-300 hover:shadow-pop">
        <Link
          href={`/cars/${car.id}`}
          className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden sm:w-44"
        >
          {cover ? (
            <img
              src={cover}
              alt={car.title || 'صورة السيارة'}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <Placeholder size="h-7 w-7" />
          )}
          {car.is_featured && (
            <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-2xs font-semibold text-white">
              <Icon name="star" filled className="h-2.5 w-2.5" />
              مميز
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-3">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/cars/${car.id}`} className="min-w-0">
                <h3 className="line-clamp-1 text-[15px] font-semibold text-ink transition group-hover:text-accent">
                  {car.title || 'سيارة معروضة'}
                </h3>
              </Link>
              <p className="shrink-0 text-[17px] font-bold leading-none text-ink nums">
                {price}
                <span className="mr-1 text-2xs font-medium text-muted">دج</span>
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs">
              <SpecItem icon="calendar" value={car.year} />
              <SpecItem icon="gauge" value={mileage} />
              <SpecItem icon="fuel" value={car.fuel_type} />
              <SpecItem icon="gearbox" value={car.gearbox} />
              <SpecItem icon="tag" value={car.brand} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-line pt-2">
            <div className="flex min-w-0 items-center gap-3 text-2xs text-muted">
              <span className="inline-flex items-center gap-1 truncate">
                <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                {car.wilaya || 'الجزائر'}
              </span>
              {posted && (
                <span className="inline-flex shrink-0 items-center gap-1">
                  <Icon name="clock" className="h-3.5 w-3.5 text-slate-400" />
                  {posted}
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <FavoriteButton carId={car.id} className="h-8 w-8" />
              {car.phone_number && (
                <a
                  href={`tel:${car.phone_number}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
                >
                  <Icon name="phone" className="h-3.5 w-3.5" />
                  اتصال
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ---------- عرض الشبكة ---------- */
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition hover:border-slate-300 hover:shadow-pop">
      <Link href={`/cars/${car.id}`} className="relative block aspect-[4/3] overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={car.title || 'صورة السيارة'}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <Placeholder />
        )}

        {car.is_featured && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-2xs font-semibold text-white">
            <Icon name="star" filled className="h-3 w-3" />
            مميز
          </span>
        )}

        {photoCount > 1 && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-black/65 px-1.5 py-0.5 text-2xs font-medium text-white backdrop-blur-sm nums">
            <Icon name="camera" className="h-3 w-3" strokeWidth={1.6} />
            {photoCount}
          </span>
        )}
      </Link>

      <FavoriteButton carId={car.id} className="absolute left-2 top-2 h-8 w-8" />

      <div className="flex flex-1 flex-col p-3">
        <Link href={`/cars/${car.id}`} className="min-w-0">
          <h3 className="line-clamp-1 text-sm font-semibold text-ink transition group-hover:text-accent">
            {car.title || 'سيارة معروضة'}
          </h3>
        </Link>

        <p className="mt-1.5 text-lg font-bold leading-none text-ink nums">
          {price}
          <span className="mr-1 text-xs font-medium text-muted">دج</span>
        </p>

        <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-line pt-2.5 text-xs">
          <SpecItem icon="calendar" value={car.year} />
          <SpecItem icon="gauge" value={mileage} />
          <SpecItem icon="fuel" value={car.fuel_type} />
          <SpecItem icon="gearbox" value={car.gearbox} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 text-2xs text-muted">
          <span className="inline-flex min-w-0 items-center gap-1">
            <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{car.wilaya || 'الجزائر'}</span>
          </span>
          {posted && <span className="shrink-0">{posted}</span>}
        </div>
      </div>

      {car.phone_number && (
        <a
          href={`tel:${car.phone_number}`}
          className="flex items-center justify-center gap-2 border-t border-line py-2.5 text-xs font-semibold text-ink transition hover:bg-slate-50 hover:text-accent"
        >
          <Icon name="phone" className="h-3.5 w-3.5" />
          اتصال بالبائع
        </a>
      )}
    </article>
  );
}
