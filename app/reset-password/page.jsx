'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/Icon';
import { requestPasswordReset, isSupabaseConfigured } from '@/utils/supabase';

const inputClass =
  'w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-accent focus:outline-none';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.');
      return;
    }

    setLoading(true);
    await requestPasswordReset(email);
    setLoading(false);
    // نعرض نفس الرسالة دائماً حتى لا يُكشف ما إذا كان البريد مسجّلاً
    setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-12">
        <div className="rounded-card border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-5">
            <h1 className="flex items-center gap-2.5 text-lg font-bold text-ink">
              <Icon name="lock" className="h-5 w-5 text-accent" strokeWidth={1.7} />
              استرجاع كلمة المرور
            </h1>
            <p className="mt-1 text-xs text-muted">سنرسل لك رابطاً لتعيين كلمة مرور جديدة</p>
          </div>

          {sent ? (
            <div className="px-6 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon name="mail" className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">تحقّق من بريدك</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                إن كان <span className="font-medium text-ink">{email}</span> مسجّلاً لدينا، فستصلك رسالة
                تحتوي رابط تعيين كلمة مرور جديدة. تحقّق من مجلد الرسائل غير المرغوبة إن لم تجدها.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                العودة لتسجيل الدخول
              </Link>
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
                    البريد الإلكتروني
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="example@mail.com"
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال رابط الاسترجاع'}
                </button>
              </form>

              <div className="border-t border-line px-6 py-4 text-center text-xs text-muted">
                تذكّرت كلمة المرور؟{' '}
                <Link href="/login" className="font-semibold text-accent hover:underline">
                  تسجيل الدخول
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
