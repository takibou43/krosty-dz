'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import CarCard from '@/components/CarCard';
import Icon from '@/components/Icon';
import { useAuth } from '@/utils/useAuth';
import { publishCarToFacebook } from '@/utils/facebook';
import {
  getMyCars,
  deleteCar,
  renewCar,
  isExpired,
  timeLeft,
  AD_DURATION_DAYS,
} from '@/utils/supabase';

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [renewingId, setRenewingId] = useState(null);
  const [sharingId, setSharingId] = useState(null);
  const [shareResult, setShareResult] = useState({});

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

  const handleRenew = async (carId) => {
    setRenewingId(carId);
    const updated = await renewCar(carId);
    if (updated) {
      setCars((prev) => prev.map((c) => (c.id === carId ? { ...c, ...updated } : c)));
    }
    setRenewingId(null);
  };

  const handleShare = async (carId) => {
    setSharingId(carId);
    setShareResult((prev) => ({ ...prev, [carId]: null }));
    const res = await publishCarToFacebook(carId);
    let msg;
    if (res?.ok) {
      msg = { ok: true, text: 'تم النشر على صفحة فيسبوك' };
      // نُحدّث البطاقة فوراً حتى تتحوّل الشارة دون إعادة تحميل
      setCars((prev) =>
        prev.map((c) => (c.id === carId ? { ...c, fb_post_id: res.postId || 'posted' } : c))
      );
    } else if (res?.skipped === 'facebook_not_configured') {
      msg = { ok: false, text: 'ربط فيسبوك غير مُفعَّل بعد' };
    } else {
      msg = { ok: false, text: res?.detail ? `تعذّر النشر: ${res.detail}` : 'تعذّر النشر على فيسبوك' };
    }
    setShareResult((prev) => ({ ...prev, [carId]: msg }));
    setSharingId(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <PageHeader
        icon="user"
        title="حسابي"
        subtitle={user?.email || 'إدارة إعلاناتك المنشورة'}
        action={
          user ? (
            <Link
              href="/add"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              <Icon name="plus" className="h-4 w-4" strokeWidth={2.2} />
              إعلان جديد
            </Link>
          ) : null
        }
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {authLoading && (
          <div className="rounded-card border border-line bg-white px-6 py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
          </div>
        )}

        {!authLoading && !user && (
          <div className="rounded-card border border-dashed border-line bg-white px-6 py-20 text-center">
            <Icon name="lock" className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.4} />
            <p className="mt-3 text-sm font-semibold text-ink">يجب تسجيل الدخول لعرض حسابك</p>
            <p className="mt-1 text-xs text-muted">سجّل دخولك للوصول إلى إعلاناتك وإدارتها</p>
            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              تسجيل الدخول
            </Link>
          </div>
        )}

        {!authLoading && user && (
          <>
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <h2 className="text-sm font-semibold text-ink">إعلاناتي</h2>
              {!loading && (
                <span className="text-sm text-muted">
                  <span className="font-semibold text-ink nums">{cars.length}</span> إعلان
                </span>
              )}
            </div>

            {loading && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                <Icon name="inbox" className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.4} />
                <p className="mt-3 text-sm font-semibold text-ink">لم تنشر أي إعلان بعد</p>
                <p className="mt-1 text-xs text-muted">انشر إعلانك الأول مجاناً في أقل من دقيقة</p>
                <Link
                  href="/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
                >
                  <Icon name="plus" className="h-4 w-4" strokeWidth={2.2} />
                  أضف إعلانك الأول
                </Link>
              </div>
            )}

            {!loading && cars.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cars.map((car) => {
                  const expired = isExpired(car);
                  const left = timeLeft(car);
                  return (
                    <div key={car.id} className="flex flex-col gap-2">
                      <div className={expired ? 'opacity-60 grayscale' : undefined}>
                        <CarCard car={car} view="grid" />
                      </div>

                      {/* حالة الإعلان */}
                      {expired ? (
                        <p className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-2xs font-medium text-amber-800">
                          <Icon name="clock" className="h-3.5 w-3.5 shrink-0" />
                          انتهى العرض — جدّده ليظهر من جديد
                        </p>
                      ) : (
                        <p className="flex items-center gap-1.5 px-1 text-2xs text-muted">
                          <Icon name="clock" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          يُعرض لمدة {left} بعد
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleRenew(car.id)}
                          disabled={renewingId === car.id}
                          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold transition disabled:opacity-50 ${
                            expired
                              ? 'bg-accent text-white hover:bg-accent-dark'
                              : 'border border-line text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <Icon name="bolt" className="h-3.5 w-3.5" />
                          {renewingId === car.id ? 'جاري التجديد...' : `تجديد ${AD_DURATION_DAYS} أيام`}
                        </button>

                        <Link
                          href={`/cars/${car.id}/edit`}
                          aria-label="تعديل الإعلان"
                          className="inline-flex items-center justify-center rounded-md border border-line px-3 py-2 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-ink"
                        >
                          <Icon name="edit" className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(car.id)}
                          disabled={deletingId === car.id}
                          aria-label="حذف الإعلان"
                          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
                          {deletingId === car.id ? '...' : ''}
                        </button>
                      </div>

                      {/* حالة النشر على فيسبوك — لا نترك الفشل يمرّ بصمت */}
                      {car.fb_post_id ? (
                        <p className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-2xs font-medium text-emerald-800">
                          <Icon name="check" className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                          نُشر على فيسبوك
                        </p>
                      ) : (
                        <>
                          <p className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-2xs font-medium text-amber-800">
                            <Icon name="info" className="h-3.5 w-3.5 shrink-0" />
                            لم يُنشر على فيسبوك
                          </p>

                          <button
                            type="button"
                            onClick={() => handleShare(car.id)}
                            disabled={sharingId === car.id}
                            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-line py-2 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-ink disabled:opacity-50"
                          >
                            <Icon name="facebook" className="h-3.5 w-3.5" filled />
                            {sharingId === car.id ? 'جاري النشر...' : 'إعادة المحاولة'}
                          </button>
                        </>
                      )}

                      {shareResult[car.id] && (
                        <p
                          className={`rounded-md px-2.5 py-1.5 text-2xs font-medium ${
                            shareResult[car.id].ok
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {shareResult[car.id].text}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
