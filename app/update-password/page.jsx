'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/Icon';
import { updatePassword, isSupabaseConfigured } from '@/utils/supabase';

const inputClass =
  'w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-accent focus:outline-none';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('الخدمة غير متاحة حالياً.');
      return;
    }
    if (password.length < 6) {
      setError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
      return;
    }
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);
    const ok = await updatePassword(password);
    setLoading(false);

    if (!ok) {
      setError('تعذّر تغيير كلمة المرور. قد يكون الرابط منتهي الصلاحية — اطلب رابطاً جديداً.');
      return;
    }

    setDone(true);
    setTimeout(() => router.push('/account'), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-12">
        <div className="rounded-card border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-5">
            <h1 className="flex items-center gap-2.5 text-lg font-bold text-ink">
              <Icon name="lock" className="h-5 w-5 text-accent" strokeWidth={1.7} />
              كلمة مرور جديدة
            </h1>
            <p className="mt-1 text-xs text-muted">اختر كلمة مرور قوية لحسابك</p>
          </div>

          {done ? (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon name="check" className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">تم تغيير كلمة المرور</p>
              <p className="mt-1.5 text-xs text-muted">جاري تحويلك إلى حسابك...</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
                {error && (
                  <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-800">
                    <Icon name="info" className="mt-px h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-2xs font-medium uppercase tracking-wide text-muted">
                    كلمة المرور الجديدة
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="6 أحرف على الأقل"
                    className={inputClass}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-2xs font-medium uppercase tracking-wide text-muted">
                    تأكيد كلمة المرور
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="أعد كتابتها"
                    className={inputClass}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
                </button>
              </form>

              <div className="border-t border-line px-6 py-4 text-center text-xs text-muted">
                لم يصلك الرابط؟{' '}
                <Link href="/reset-password" className="font-semibold text-accent hover:underline">
                  اطلب رابطاً جديداً
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
