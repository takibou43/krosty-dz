'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import CarForm from '@/components/CarForm';
import { getCarById, updateCar, isSupabaseConfigured } from '@/utils/supabase';
import { useAuth } from '@/utils/useAuth';

export default function EditCarPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getCarById(params.id);
      if (!data) setNotFound(true);
      else setCar(data);
      setLoading(false);
    };
    if (params?.id) load();
  }, [params?.id]);

  const handleSubmit = async (payload) => {
    if (!isSupabaseConfigured) return 'قاعدة البيانات غير مهيأة حالياً.';
    const updated = await updateCar(params.id, payload);
    if (!updated) return 'تعذّر حفظ التعديلات. تأكّد من البيانات وحاول مجدداً.';
    router.push('/account');
    return null;
  };

  const isOwner = user && car && car.user_id === user.id;
  const busy = loading || authLoading;

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <PageHeader
        icon="tag"
        title="تعديل الإعلان"
        subtitle="عدّل بيانات إعلانك — التعديل لا يغيّر مدة العرض المتبقية"
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        {busy && (
          <div className="rounded-card border border-line bg-white px-6 py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
          </div>
        )}

        {!busy && notFound && (
          <div className="rounded-card border border-dashed border-line bg-white px-6 py-16 text-center">
            <Icon name="search" className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.4} />
            <p className="mt-3 text-sm font-semibold text-ink">لم يتم العثور على هذا الإعلان</p>
            <Link
              href="/account"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              العودة إلى حسابي
            </Link>
          </div>
        )}

        {!busy && car && !isOwner && (
          <div className="rounded-card border border-dashed border-line bg-white px-6 py-16 text-center">
            <Icon name="lock" className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.4} />
            <p className="mt-3 text-sm font-semibold text-ink">لا يمكنك تعديل هذا الإعلان</p>
            <p className="mt-1.5 text-xs text-muted">التعديل متاح لصاحب الإعلان فقط.</p>
            <Link
              href={`/cars/${params.id}`}
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              عرض الإعلان
            </Link>
          </div>
        )}

        {!busy && car && isOwner && (
          <CarForm
            initialData={{
              category: car.category || 'cars',
              title: car.title || '',
              description: car.description || '',
              brand: car.brand || '',
              model: car.model || '',
              year: car.year || new Date().getFullYear(),
              wilaya: car.wilaya,
              fuel_type: car.fuel_type,
              gearbox: car.gearbox,
              mileage: car.mileage ?? '',
              documents: car.documents,
              price: car.price ?? '',
              phone_number: car.phone_number || '',
            }}
            existingImages={Array.isArray(car.images) ? car.images : []}
            submitLabel="حفظ التعديلات"
            pendingLabel="جاري الحفظ..."
            onSubmit={handleSubmit}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
