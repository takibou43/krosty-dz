'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import { useAuth } from '@/utils/useAuth';
import { getMyCars, deleteCar } from '@/utils/supabase';

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadCars = async (userId) => {
    setLoading(true);
    const data = await getMyCars(userId);
    setCars(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadCars(user.id);
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const handleDelete = async (carId) => {
    setDeletingId(carId);
    const ok = await deleteCar(carId);
    if (ok) {
      setCars((prev) => prev.filter((c) => c.id !== carId));
    }
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Header />

      <div className="bg-gradient-to-l from-primary to-blue-900 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            👤 حسابي
          </h1>
          {user && <p className="text-sm text-blue-100 mt-1">{user.email}</p>}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {authLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mb-4"></div>
          </div>
        )}

        {!authLoading && !user && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-3">🔒</div>
            <p className="font-semibold text-gray-800">يجب تسجيل الدخول لعرض حسابك</p>
            <Link href="/login" className="mt-4 inline-block bg-accent hover:bg-orange-700 text-white font-bold py-2.5 px-5 rounded-lg transition">
              تسجيل الدخول
            </Link>
          </div>
        )}

        {!authLoading && user && (
          <>
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              🚗 إعلاناتي
              {!loading && <span className="text-sm font-normal text-gray-500">({cars.length})</span>}
            </h2>

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mb-4"></div>
                <p className="text-sm font-medium">جاري تحميل إعلاناتك...</p>
              </div>
            )}

            {!loading && cars.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-5xl mb-3">📭</div>
                <p className="font-semibold text-gray-800">لم تنشر أي إعلان بعد</p>
                <Link href="/add" className="mt-4 inline-block bg-accent hover:bg-orange-700 text-white font-bold py-2.5 px-5 rounded-lg transition">
                  + أضف إعلانك الأول
                </Link>
              </div>
            )}

            {!loading && cars.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {cars.map((car) => (
                  <div key={car.id} className="relative">
                    <CarCard car={car} view="grid" />
                    <button
                      type="button"
                      onClick={() => handleDelete(car.id)}
                      disabled={deletingId === car.id}
                      className="mt-2 w-full rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === car.id ? 'جاري الحذف...' : '🗑️ حذف الإعلان'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
