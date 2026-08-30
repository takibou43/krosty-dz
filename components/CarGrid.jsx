'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon from './Icon';
import { getCars, isSupabaseConfigured } from '@/utils/supabase';
import CarCard from './CarCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'oldest', label: 'الأقدم' },
  { value: 'price_asc', label: 'السعر: الأقل أولاً' },
  { value: 'price_desc', label: 'السعر: الأعلى أولاً' },
  { value: 'year_desc', label: 'السنة: الأحدث' },
  { value: 'mileage_asc', label: 'الكيلومترات: الأقل' },
];

const CARS_PER_PAGE = 12;

function sortCars(cars, sortBy) {
  const list = [...cars];
  switch (sortBy) {
    case 'oldest':
      return list.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    case 'price_asc':
      return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    case 'price_desc':
      return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    case 'year_desc':
      return list.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    case 'mileage_asc':
      return list.sort((a, b) => Number(a.mileage || 0) - Number(b.mileage || 0));
    case 'newest':
    default:
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-white">
      <div className="aspect-[4/3] animate-pulse bg-slate-100" />
      <div className="space-y-2.5 p-3">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="grid grid-cols-2 gap-2 border-t border-line pt-2.5">
          <div className="h-3 animate-pulse rounded bg-slate-100" />
          <div className="h-3 animate-pulse rounded bg-slate-100" />
          <div className="h-3 animate-pulse rounded bg-slate-100" />
          <div className="h-3 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function CarGrid({ filters = {} }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isSupabaseConfigured) {
          setCars([]);
          return;
        }

        const data = await getCars({
          wilaya: filters.wilaya,
          brand: filters.brand,
          fuelType: filters.fuelType,
          gearbox: filters.gearbox,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        });

        setCars(data || []);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters]);

  const sortedCars = useMemo(() => sortCars(cars, sortBy), [cars, sortBy]);
  const totalPages = Math.ceil(sortedCars.length / CARS_PER_PAGE);
  const paginatedCars = sortedCars.slice((currentPage - 1) * CARS_PER_PAGE, currentPage * CARS_PER_PAGE);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-card border border-red-200 bg-red-50 px-4 py-6 text-center" dir="rtl">
        <p className="text-sm font-semibold text-red-800">تعذّر تحميل السيارات</p>
        <p className="mt-1 text-xs text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div dir="rtl">
      {/* شريط الأدوات */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink nums">{cars.length}</span> إعلان متاح
        </p>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-line bg-white py-2 pr-3 text-xs font-medium text-slate-600 transition hover:border-slate-300 focus:border-accent focus:outline-none"
            aria-label="ترتيب حسب"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-0.5 rounded-md border border-line bg-white p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="عرض شبكي"
              aria-pressed={viewMode === 'grid'}
              className={`flex h-7 w-7 items-center justify-center rounded transition ${
                viewMode === 'grid' ? 'bg-ink text-white' : 'text-slate-400 hover:text-ink'
              }`}
            >
              <Icon name="grid" className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="عرض قائمة"
              aria-pressed={viewMode === 'list'}
              className={`flex h-7 w-7 items-center justify-center rounded transition ${
                viewMode === 'list' ? 'bg-ink text-white' : 'text-slate-400 hover:text-ink'
              }`}
            >
              <Icon name="list" className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* النتائج */}
      {paginatedCars.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedCars.map((car) => (
              <CarCard key={car.id} car={car} view="grid" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {paginatedCars.map((car) => (
              <CarCard key={car.id} car={car} view="list" />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-card border border-dashed border-line bg-white px-6 py-16 text-center">
          <Icon name="search" className="mx-auto h-9 w-9 text-slate-300" strokeWidth={1.4} />
          <p className="mt-3 text-sm font-semibold text-ink">لا توجد نتائج مطابقة</p>
          <p className="mt-1 text-xs text-muted">جرّب تغيير معايير البحث أو اختيار ولاية أخرى</p>
        </div>
      )}

      {/* التنقل بين الصفحات */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="التنقل بين الصفحات">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`h-9 min-w-[36px] rounded-md px-2 text-sm font-medium transition nums ${
                page === currentPage
                  ? 'bg-ink text-white'
                  : 'border border-line bg-white text-slate-600 hover:border-slate-300 hover:text-ink'
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
