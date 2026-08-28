'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCars, isSupabaseConfigured } from '@/utils/supabase';
import CarCard from './CarCard'; // المكون المسؤول عن تصميم كارت السيارة الفردي

const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'oldest', label: 'الأقدم' },
  { value: 'price_asc', label: 'السعر: من الأقل إلى الأعلى' },
  { value: 'price_desc', label: 'السعر: من الأعلى إلى الأقل' },
  { value: 'year_desc', label: 'السنة: الأحدث' },
  { value: 'mileage_asc', label: 'الكيلومترات: الأقل' },
];

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

export default function CarGrid({ filters = {} }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const carsPerPage = 6; // يمكنك تعديل عدد السيارات في الصفحة الواحدة من هنا

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isSupabaseConfigured) {
          setCars([]);
          return;
        }

        // جلب البيانات مع تطبيق الفلاتر القادمة من شريط البحث
        const data = await getCars({
          wilaya: filters.wilaya,
          brand: filters.brand,
          fuelType: filters.fuelType,
          gearbox: filters.gearbox,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        });

        setCars(data || []);
        // إعادة تعيين الصفحة إلى الأولى عند تغيير فلاتر البحث
        setCurrentPage(1);

      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters]); // ستتم إعادة جلب البيانات فوراً عند تغيير أي فلتر بحث

  const sortedCars = useMemo(() => sortCars(cars, sortBy), [cars, sortBy]);

  // حسابات الحوسبة لعرض الصفحات (Pagination) محلياً
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);
  const paginatedCars = sortedCars.slice((currentPage - 1) * carsPerPage, currentPage * carsPerPage);

  // 1. حالة تحميل البيانات
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mb-4"></div>
        <p className="text-sm font-medium">جاري البحث في قاعدة البيانات...</p>
      </div>
    );
  }

  // 2. حالة حدوث خطأ
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center font-medium my-6" dir="rtl">
        حدث خطأ أثناء تحميل السيارات: {error}
      </div>
    );
  }

  return (
    <div dir="rtl">
      {/* الـ Header الخاص بشبكة السيارات */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          🚗 السيارات المتاحة
          <span className="text-sm font-normal text-gray-500">({cars.length} إعلان حقيقي)</span>
        </h2>

        <div className="flex items-center gap-2">
          {/* ترتيب النتائج */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-2 text-xs font-semibold text-slate-600 focus:outline-none focus:border-accent focus:ring-2 focus:ring-orange-100"
            aria-label="ترتيب حسب"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>ترتيب: {opt.label}</option>
            ))}
          </select>

          {/* تبديل العرض */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="عرض شبكي"
              className={`rounded-md px-2.5 py-1.5 text-sm transition ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary'}`}
            >
              ▦
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="عرض قائمة"
              className={`rounded-md px-2.5 py-1.5 text-sm transition ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary'}`}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* عرض البيانات الحقيقية */}
      {paginatedCars.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {paginatedCars.map((car) => (
              <CarCard key={car.id} car={car} view="grid" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {paginatedCars.map((car) => (
              <CarCard key={car.id} car={car} view="list" />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-semibold text-gray-800">لا توجد نتائج مطابقة لبحثك</p>
          <p className="text-sm text-gray-500 mt-1">جرب تغيير معايير البحث أو اختيار ولاية أخرى</p>
        </div>
      )}

      {/* أزرار التنقل بين الصفحات (Pagination) */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' }); // صعود سلس لأعلى الشبكة عند تغيير الصفحة
              }}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
