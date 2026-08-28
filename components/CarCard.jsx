'use client';

import Link from 'next/link';

export default function CarCard({ car }) {
  const cover = Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : null;

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

          <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
            📍 {car.wilaya || 'الجزائر'}
          </span>
        </div>

        <div className="p-3.5">
          <h3 className="line-clamp-1 text-[15px] font-bold text-slate-800">
            {car.title || 'سيارة مميزة'}
          </h3>

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
