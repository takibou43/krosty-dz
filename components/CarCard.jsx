'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
      className={`flex items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110 ${className}`}
    >
      <span className={fav ? 'text-red-500' : 'text-gray-400'}>{fav ? '❤️' : '🤍'}</span>
    </button>
  );
}

export default function CarCard({ car, view = 'grid' }) {
  const cover = Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : null;
  const posted = timeAgo(car.created_at);

  if (view === 'list') {
    return (
      <div className="group flex overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg">
        <Link href={`/cars/${car.id}`} className="relative h-32 w-32 sm:h-36 sm:w-48 flex-shrink-0 overflow-hidden bg-slate-100">
          {cover ? (
            <img src={cover} alt={car.title || 'صورة السيارة'} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 text-2xl">🚗</div>
          )}
          {car.is_featured && (
            <span className="absolute top-1.5 right-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white shadow">⭐ مميز</span>
          )}
        </Link>

        <div className="flex flex-1 flex-col justify-between p-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Link href={`/cars/${car.id}`} className="min-w-0">
                <h3 className="line-clamp-1 text-[15px] font-bold text-slate-800">{car.title || 'سيارة مميزة'}</h3>
              </Link>
              <FavoriteButton carId={car.id} className="h-7 w-7 flex-shrink-0 text-sm" />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">🏷️ {car.brand || 'ماركة'}</span>
              <span className="flex items-center gap-1">📅 {car.year || '-'}</span>
              <span className="flex items-center gap-1">⛽ {car.fuel_type || '-'}</span>
              <span className="flex items-center gap-1">⚙️ {car.gearbox || '-'}</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 mt-2">
            <div>
              <p className="text-lg font-black text-accent">
                {Number(car.price || 0).toLocaleString('ar-DZ')}
                <span className="mr-1 text-xs font-semibold text-slate-400">دج</span>
              </p>
              <p className="text-[11px] text-slate-400">📍 {car.wilaya || 'الجزائر'}{posted ? ` · ${posted}` : ''}</p>
            </div>
            {car.phone_number && (
              <a
                href={`tel:${car.phone_number}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20"
              >
                📞 اتصال
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/cars/${car.id}`} className="block">
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          {cover ? (
            <img
              src={cover}
              alt={car.title || 'صورة السيارة'}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 text-3xl">
              🚗
            </div>
          )}

          {car.is_featured && (
            <span className="absolute top-2 right-2 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-white shadow">
              ⭐ مميز
            </span>
          )}

          <FavoriteButton carId={car.id} className="absolute top-2 left-2 h-8 w-8" />

          <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
            📍 {car.wilaya || 'الجزائر'}
          </span>
        </div>

        <div className="p-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-[15px] font-bold text-slate-800">
              {car.title || 'سيارة مميزة'}
            </h3>
          </div>

          <p className="mt-1.5 text-xl font-black text-accent">
            {Number(car.price || 0).toLocaleString('ar-DZ')}
            <span className="mr-1 text-xs font-semibold text-slate-400">دج</span>
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-gray-100 pt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">🏷️ {car.brand || 'ماركة'}</span>
            <span className="flex items-center gap-1">📅 {car.year || '-'}</span>
            <span className="flex items-center gap-1">⛽ {car.fuel_type || '-'}</span>
            <span className="flex items-center gap-1">⚙️ {car.gearbox || '-'}</span>
          </div>

          {posted && <p className="mt-2 text-[11px] text-slate-400">🕒 {posted}</p>}
        </div>
      </Link>

      {car.phone_number && (
        <a
          href={`tel:${car.phone_number}`}
          className="flex items-center justify-center gap-2 border-t border-gray-100 py-2.5 text-sm font-bold text-primary transition hover:bg-slate-50"
        >
          📞 اتصال بالبائع
        </a>
      )}
    </div>
  );
}
