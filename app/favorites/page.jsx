'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import { getCarsByIds, isSupabaseConfigured } from '@/utils/supabase';
import { getFavoriteIds, subscribeFavorites } from '@/utils/favorites';

export default function FavoritesPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    const ids = getFavoriteIds();
    if (!isSupabaseConfigured || ids.length === 0) {
      setCars([]);
      setLoading(false);
      return;
    }
    const data = await getCarsByIds(ids);
    // الحفاظ على ترتيب الإضافة الأحدث أولاً
    const ordered = [...data].sort((a, b) => ids.indexOf(String(b.id)) - ids.indexOf(String(a.id)));
    setCars(ordered);
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
    const unsubscribe = subscribeFavorites(() => loadFavorites());
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Header />

      <div className="bg-gradient-to-l from-primary to-black py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            ❤️ السيارات المفضلة
          </h1>
          <p className="text-sm text-gray-300 mt-1">السيارات التي حفظتها لمراجعتها لاحقاً</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-4"></div>
            <p className="text-sm font-medium">جاري تحميل المفضلة...</p>
          </div>
        )}

        {!loading && cars.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-3">🤍</div>
            <p className="font-semibold text-gray-800">لا توجد سيارات في المفضلة بعد</p>
            <p className="text-sm text-gray-500 mt-1 mb-4">اضغط على أيقونة القلب في أي إعلان لإضافته هنا</p>
            <a href="/cars" className="inline-block bg-accent hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition">
              تصفح السيارات
            </a>
          </div>
        )}

        {!loading && cars.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">{cars.length} سيارة محفوظة</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
