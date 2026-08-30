'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import CarForm from '@/components/CarForm';
import {
  addCar,
  isSupabaseConfigured,
  countActiveCars,
  MAX_ACTIVE_ADS,
  AD_DURATION_DAYS,
} from '@/utils/supabase';
import { publishCarToFacebook } from '@/utils/facebook';
import { useAuth } from '@/utils/useAuth';

export default function AddCarPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeCount, setActiveCount] = useState(null);

  useEffect(() => {
    if (user) countActiveCars(user.id).then(setActiveCount);
  }, [user]);

  const reachedLimit = activeCount !== null && activeCount >= MAX_ACTIVE_ADS;

  const handleSubmit = async (payload) => {
    if (!isSupabaseConfigured) return 'قاعدة البيانات غير مهيأة حالياً. يرجى المحاولة لاحقاً.';
    if (!user) {
      router.push('/login?redirect=/add');
      return null;
    }

    // حد أقصى للإعلانات النشطة — حماية من الإغراق
    const current = await countActiveCars(user.id);
    if (current >= MAX_ACTIVE_ADS) {
      return `وصلت الحد الأقصى (${MAX_ACTIVE_ADS} إعلاناً نشطاً). احذف إعلاناً قديماً لنشر إعلان جديد.`;
    }

    const result = await addCar({ ...payload, is_featured: false, userId: user.id });
    if (!result) return 'تعذر نشر الإعلان، يرجى التحقق من البيانات والمحاولة مجدداً.';

    // النشر على فيسبوك لا يعطّل الإعلان إن فشل
    await publishCarToFacebook(result.id);
    router.push('/account');
    return null;
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <PageHeader
        icon="plus"
        title="أضف إعلان سيارة"
        subtitle={`النشر مجاني — الإعلان يُعرض ${AD_DURATION_DAYS} أيام وقابل للتجديد`}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        {authLoading && (
          <div className="rounded-card border border-line bg-white px-6 py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
          </div>
        )}

        {!authLoading && !user && (
          <div className="rounded-card border border-dashed border-line bg-white px-6 py-16 text-center">
            <Icon name="lock" className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.4} />
            <p className="mt-3 text-sm font-semibold text-ink">سجّل الدخول لنشر إعلانك</p>
            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted">
              النشر يتطلب حساباً حتى تتمكن من إدارة إعلاناتك وتجديدها وحذفها في أي وقت.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/login?redirect=/add"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/signup?redirect=/add"
                className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        )}

        {!authLoading && user && reachedLimit && (
          <div className="rounded-card border border-dashed border-line bg-white px-6 py-16 text-center">
            <Icon name="inbox" className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.4} />
            <p className="mt-3 text-sm font-semibold text-ink">وصلت الحد الأقصى للإعلانات</p>
            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted">
              يمكنك نشر {MAX_ACTIVE_ADS} إعلاناً نشطاً كحد أقصى. احذف إعلاناً قديماً من «حسابي» لتتمكن
              من نشر إعلان جديد.
            </p>
            <Link
              href="/account"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              إدارة إعلاناتي
            </Link>
          </div>
        )}

        {!authLoading && user && !reachedLimit && <CarForm onSubmit={handleSubmit} />}
      </main>

      <Footer />
    </div>
  );
}
