'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSpace from '@/components/AdSpace';
import CarCard from '@/components/CarCard';
import Icon from '@/components/Icon';
import ReportDialog from '@/components/ReportDialog';
import { getCarById, getSimilarCars, incrementCarViews } from '@/utils/supabase';
import { isFavorite, toggleFavorite } from '@/utils/favorites';

const SPEC_ROWS = [
  { key: 'brand', label: 'الماركة', icon: 'tag' },
  { key: 'model', label: 'الموديل', icon: 'car' },
  { key: 'year', label: 'سنة الصنع', icon: 'calendar' },
  { key: 'mileage', label: 'الممشى', icon: 'gauge' },
  { key: 'fuel_type', label: 'الوقود', icon: 'fuel' },
  { key: 'gearbox', label: 'ناقل الحركة', icon: 'gearbox' },
  { key: 'wilaya', label: 'الولاية', icon: 'mapPin' },
  { key: 'documents', label: 'الوثائق', icon: 'shield' },
];

function Spec({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-line py-2.5 last:border-0">
      <Icon name={icon} className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="text-xs text-muted">{label}</span>
      <span className="mr-auto text-sm font-medium text-ink nums">{value || '—'}</span>
    </div>
  );
}

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
        // نحتسب المشاهدة مرة واحدة لكل زيارة، بلا انتظار
        incrementCarViews(data.id);
      }
      setLoading(false);
    };
    if (params?.id) fetchCar();
  }, [params?.id]);

  const handleToggleFavorite = () => {
    if (!car) return;
    setFav(toggleFavorite(car.id));
  };

  const images = Array.isArray(car?.images) ? car.images : [];

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:pb-6">
        {loading && (
          <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
            <div className="overflow-hidden rounded-card border border-line bg-white">
              <div className="aspect-[16/10] animate-pulse bg-slate-100" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="h-7 w-1/3 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
            <div className="h-52 animate-pulse rounded-card bg-white" />
          </div>
        )}

        {!loading && notFound && (
          <div className="rounded-card border border-dashed border-line bg-white px-6 py-20 text-center">
            <Icon name="search" className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.4} />
            <p className="mt-3 text-sm font-semibold text-ink">لم يتم العثور على هذا الإعلان</p>
            <Link
              href="/cars"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              العودة إلى كل السيارات
            </Link>
          </div>
        )}

        {!loading && car && (
          <>
            {/* مسار التنقل */}
            <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted">
              <Link href="/" className="transition hover:text-accent">
                الرئيسية
              </Link>
              <Icon name="chevronLeft" className="h-3.5 w-3.5" />
              <Link href="/cars" className="transition hover:text-accent">
                السيارات
              </Link>
              <Icon name="chevronLeft" className="h-3.5 w-3.5" />
              <span className="truncate text-ink">{car.title}</span>
            </nav>

            <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
              {/* العمود الأيمن */}
              <div className="space-y-4">
                {/* معرض الصور */}
                <div className="overflow-hidden rounded-card border border-line bg-white shadow-card">
                  {images.length > 0 ? (
                    <>
                      <div className="relative aspect-[16/10] bg-slate-100">
                        <img
                          src={images[activeImage] || images[0]}
                          alt={car.title}
                          className="h-full w-full object-cover"
                        />
                        {images.length > 1 && (
                          <span className="absolute bottom-3 left-3 rounded bg-black/65 px-2 py-1 text-2xs font-medium text-white backdrop-blur-sm nums">
                            {activeImage + 1} / {images.length}
                          </span>
                        )}
                      </div>
                      {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto border-t border-line p-3">
                          {images.map((src, i) => (
                            <button
                              key={src}
                              type="button"
                              onClick={() => setActiveImage(i)}
                              aria-label={`عرض الصورة ${i + 1}`}
                              className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition ${
                                i === activeImage ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={src} alt="" className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-slate-100 text-slate-300">
                      <Icon name="car" className="h-14 w-14" strokeWidth={1} />
                    </div>
                  )}
                </div>

                {/* المواصفات */}
                <div className="rounded-card border border-line bg-white shadow-card">
                  <div className="border-b border-line px-5 py-3.5">
                    <h2 className="text-sm font-semibold text-ink">المواصفات</h2>
                  </div>
                  <div className="grid gap-x-8 px-5 py-2 sm:grid-cols-2">
                    {SPEC_ROWS.map((row) => (
                      <Spec
                        key={row.key}
                        icon={row.icon}
                        label={row.label}
                        value={
                          row.key === 'mileage'
                            ? car.mileage
                              ? `${Number(car.mileage).toLocaleString('en-US')} كم`
                              : null
                            : car[row.key]
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* الوصف */}
                {car.description && (
                  <div className="rounded-card border border-line bg-white shadow-card">
                    <div className="border-b border-line px-5 py-3.5">
                      <h2 className="text-sm font-semibold text-ink">الوصف</h2>
                    </div>
                    <p className="whitespace-pre-line px-5 py-4 text-sm leading-relaxed text-slate-700">
                      {car.description}
                    </p>
                  </div>
                )}
              </div>

              {/* العمود الجانبي */}
              <aside className="space-y-4 md:sticky md:top-20 md:self-start">
                <div className="rounded-card border border-line bg-white p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-lg font-bold leading-snug text-ink">{car.title}</h1>
                    <button
                      type="button"
                      onClick={handleToggleFavorite}
                      aria-label={fav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                      aria-pressed={fav}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line transition hover:border-accent ${
                        fav ? 'text-accent' : 'text-slate-400 hover:text-accent'
                      }`}
                    >
                      <Icon name="heart" filled={fav} className="h-[18px] w-[18px]" />
                    </button>
                  </div>

                  {car.is_featured && (
                    <span className="mt-3 inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-2xs font-semibold text-white">
                      <Icon name="star" filled className="h-3 w-3" />
                      إعلان مميز
                    </span>
                  )}

                  <p className="mt-3 text-3xl font-bold text-ink nums">
                    {Number(car.price || 0).toLocaleString('en-US')}
                    <span className="mr-1.5 text-sm font-medium text-muted">دج</span>
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="mapPin" className="h-3.5 w-3.5 text-slate-400" />
                      {car.wilaya || 'الجزائر'}
                    </span>
                    {car.year && (
                      <span className="inline-flex items-center gap-1 nums">
                        <Icon name="calendar" className="h-3.5 w-3.5 text-slate-400" />
                        {car.year}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 nums">
                      <Icon name="eye" className="h-3.5 w-3.5 text-slate-400" />
                      {Number(car.views || 0).toLocaleString('en-US')} مشاهدة
                    </span>
                  </div>

                  <div className="mt-4 border-t border-line pt-4">
                    <p className="mb-2 text-2xs font-medium uppercase tracking-wide text-muted">
                      تواصل مع البائع
                    </p>
                    {car.phone_number ? (
                      <a
                        href={`tel:${car.phone_number}`}
                        className="flex items-center justify-center gap-2 rounded-md bg-accent py-3 text-sm font-semibold text-white transition hover:bg-accent-dark nums"
                        dir="ltr"
                      >
                        <Icon name="phone" className="h-4 w-4" />
                        {car.phone_number}
                      </a>
                    ) : (
                      <p className="text-sm text-muted">رقم الهاتف غير متوفر</p>
                    )}
                    <p className="mt-2.5 flex items-start gap-1.5 text-2xs leading-relaxed text-muted">
                      <Icon name="shield" className="mt-px h-3.5 w-3.5 shrink-0 text-slate-400" />
                      تأكّد من معاينة السيارة ووثائقها قبل إتمام أي عملية دفع.
                    </p>
                  </div>
                </div>

                <ReportDialog carId={car.id} />

                <AdSpace />
              </aside>
            </div>

            {similarCars.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 border-b border-line pb-3 text-sm font-semibold text-ink">
                  سيارات مشابهة
                </h2>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                  {similarCars.map((c) => (
                    <CarCard key={c.id} car={c} view="grid" />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* شريط سفلي ثابت — الجوال فقط: السعر والاتصال في متناول اليد دائماً */}
      {!loading && car && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-2.5 backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold leading-tight text-ink nums">
                {Number(car.price || 0).toLocaleString('en-US')}
                <span className="mr-1 text-xs font-medium text-muted">دج</span>
              </p>
              <p className="truncate text-2xs text-muted">{car.wilaya || 'الجزائر'}</p>
            </div>

            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={fav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              aria-pressed={fav}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line transition ${
                fav ? 'text-accent' : 'text-slate-400'
              }`}
            >
              <Icon name="heart" filled={fav} className="h-5 w-5" />
            </button>

            {car.phone_number && (
              <a
                href={`tel:${car.phone_number}`}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-white"
              >
                <Icon name="phone" className="h-4 w-4" />
                اتصال
              </a>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
