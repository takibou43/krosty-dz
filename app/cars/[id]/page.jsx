'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSpace from '@/components/AdSpace';
import CarCard from '@/components/CarCard';
import { getCarById, getSimilarCars } from '@/utils/supabase';
import { isFavorite, toggleFavorite } from '@/utils/favorites';

export default function CarDetailPage() {
  const params = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [fav, setFav] = useState(false);
  const [similarCars, setSimilarCars] = useState([]);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      const data = await getCarById(params.id);
      if (!data) {
        setNotFound(true);
      } else {
        setCar(data);
        setFav(isFavorite(data.id));
        getSimilarCars(data).then(setSimilarCars);
      }
      setLoading(false);
    };
    if (params?.id) fetchCar();
  }, [params?.id]);

  const handleToggleFavorite = () => {
    if (!car) return;
    setFav(toggleFavorite(car.id));
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-4"></div>
            <p className="text-sm font-medium">جاري تحميل تفاصيل الإعلان...</p>
          </div>
        )}

        {!loading && notFound && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-semibold text-gray-800">لم يتم العثور على هذا الإعلان</p>
            <a href="/cars" className="mt-4 inline-block text-accent font-bold hover:underline">
              العودة إلى كل السيارات
            </a>
          </div>
        )}

        {!loading && car && (
          <>
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {Array.isArray(car.images) && car.images.length > 0 ? (
                  <div>
                    <div className="h-64 md:h-80 w-full bg-slate-100">
                      <img
                        src={car.images[activeImage] || car.images[0]}
                        alt={car.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {car.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto p-3 border-t border-gray-100">
                        {car.images.map((src, i) => (
                          <button
                            key={src}
                            type="button"
                            onClick={() => setActiveImage(i)}
                            className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                              i === activeImage ? 'border-accent' : 'border-transparent'
                            }`}
                          >
                            <img src={src} alt={`صورة ${i + 1}`} className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 text-5xl">
                    🚗
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-slate-800">{car.title}</h1>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {car.is_featured && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-accent whitespace-nowrap">
                          مميز
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleToggleFavorite}
                        aria-label={fav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:scale-110"
                      >
                        <span className={fav ? 'text-red-500' : 'text-gray-400'}>{fav ? '❤️' : '🤍'}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-3xl font-black text-accent mb-6">
                    {Number(car.price || 0).toLocaleString('ar-DZ')} دج
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
                    <Detail label="الماركة" value={car.brand} />
                    <Detail label="الموديل" value={car.model} />
                    <Detail label="سنة الصنع" value={car.year} />
                    <Detail label="الولاية" value={car.wilaya} />
                    <Detail label="الوقود" value={car.fuel_type} />
                    <Detail label="ناقل الحركة" value={car.gearbox} />
                    <Detail label="الممشى" value={car.mileage ? `${Number(car.mileage).toLocaleString('ar-DZ')} كم` : '-'} />
                    <Detail label="الوثائق" value={car.documents} />
                  </div>

                  {car.description && (
                    <div>
                      <h2 className="font-bold text-slate-800 mb-2">الوصف</h2>
                      <p className="text-sm text-slate-600 whitespace-pre-line">{car.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-bold text-slate-800 mb-3">تواصل مع البائع</h2>
                  {car.phone_number ? (
                    <a
                      href={`tel:${car.phone_number}`}
                      className="block text-center bg-accent hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                    >
                      📞 {car.phone_number}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500">رقم الهاتف غير متوفر</p>
                  )}
                </div>
                <AdSpace />
              </div>
            </div>

            {similarCars.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  🚗 سيارات مشابهة
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {similarCars.map((c) => (
                    <CarCard key={c.id} car={c} view="grid" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold text-slate-700">{value || '-'}</p>
    </div>
  );
}
