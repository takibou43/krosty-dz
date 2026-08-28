'use client';

import Link from 'next/link';

export default function CarCard({ car }) {
  return (
    <Link href={`/cars/${car.id}`} className="block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{car.title || 'سيارة مميزة'}</h3>
            <p className="text-sm text-slate-500">{car.brand || 'ماركة'} • {car.wilaya || 'الجزائر'}</p>
          </div>
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-accent">
            {car.is_featured ? 'مميز' : 'متوفر'}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>{car.fuel_type || 'وقود'}</span>
          <span>{car.gearbox || 'عادي'}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">{car.year || '2024'}</span>
          <span className="text-lg font-black text-accent">{Number(car.price || 0).toLocaleString('ar-DZ')} دج</span>
        </div>
      </div>
    </Link>
  );
}
