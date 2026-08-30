'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import CarCard from '@/components/CarCard';
import Icon from '@/components/Icon';
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
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <PageHeader
        icon="heart"
        title="السيارات المفضلة"
        subtitle="السيارات التي حفظتها لمراجعتها لاحقاً"
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {loading && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-card border border-line bg-white">
                <div className="aspect-[4/3] animate-pulse bg-slate-100" />
                <div className="space-y-2 p-3">
                  <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && cars.length === 0 && (
          <div className="rounded-card border border-dashed border-line bg-white px-6 py-20 text-center">
            <Icon name="heart" className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.4} />
            <p className="mt-3 text-sm font-semibold text-ink">لا توجد سيارات في المفضلة بعد</p>
            <p className="mt-1 text-xs text-muted">
              اضغط على أيقونة القلب في أي إعلان لإضافته هنا
            </p>
            <Link
              href="/cars"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              <Icon name="search" className="h-4 w-4" />
              تصفّح السيارات
            </Link>
          </div>
        )}

        {!loading && cars.length > 0 && (
          <>
            <p className="mb-4 border-b border-line pb-3 text-sm text-muted">
              <span className="font-semibold text-ink nums">{cars.length}</span> سيارة محفوظة
            </p>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
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
