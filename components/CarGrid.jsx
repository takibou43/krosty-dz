'use client';

import { useEffect, useState } from 'react';
import { getCars, isSupabaseConfigured } from '@/utils/supabase';
import CarCard from './CarCard'; // المكون المسؤول عن تصميم كارت السيارة الفردي

export default function CarGrid({ filters = {} }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  // حسابات الحوسبة لعرض الصفحات (Pagination) محلياً
  const totalPages = Math.ceil(cars.length / carsPerPage);
  const paginatedCars = cars.slice((currentPage - 1) * carsPerPage, currentPage * carsPerPage);

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          🚗 السيارات المتاحة
          <span className="text-sm font-normal text-gray-500">({cars.length} إعلان حقيقي)</span>
        </h2>
      </div>

      {/* عرض البيانات الحقيقية */}
      {paginatedCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {paginatedCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
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