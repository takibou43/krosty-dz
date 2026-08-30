'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/Icon';
import { signUp, isSupabaseConfigured } from '@/utils/supabase';

const inputClass =
  'w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-accent focus:outline-none';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/account');

  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get('redirect');
    if (target && target.startsWith('/') && !target.startsWith('//')) {
      setRedirectTo(target);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('قاعدة البيانات غير مهيأة حالياً. يرجى المحاولة لاحقاً.');
      return;
    }

    if (password.length < 6) {
      setError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
      return;
    }

    setLoading(true);
    const user = await signUp(email, password, { full_name: fullName });
    setLoading(false);

    if (!user) {
      setError('تعذر إنشاء الحساب. ربما البريد الإلكتروني مستخدم من قبل.');
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-12">
        <div className="rounded-card border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-5">
            <h1 className="flex items-center gap-2.5 text-lg font-bold text-ink">
              <Icon name="user" className="h-5 w-5 text-accent" strokeWidth={1.7} />
              إنشاء حساب جديد
            </h1>
            <p className="mt-1 text-xs text-muted">أنشئ حسابك لتتمكن من نشر وإدارة إعلاناتك</p>
          </div>

          {success ? (
            <div className="px-6 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon name="check" className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">تم إنشاء حسابك بنجاح</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                إذا طُلب منك تأكيد بريدك الإلكتروني، تحقّق من صندوق الوارد قبل تسجيل الدخول.
              </p>
              <Link
                href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
              >
                تسجيل الدخول الآن
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
                    الاسم الكامل
                  </span>
                  <input
                    type="text"
                    placeholder="محمد بن علي"
                    className={inputClass}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>

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

                <label className="block">
                  <span className="mb-1.5 block text-2xs font-medium uppercase tracking-wide text-muted">
                    كلمة المرور
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
                >
                  {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                </button>
              </form>

              <div className="border-t border-line px-6 py-4 text-center text-xs text-muted">
                لديك حساب بالفعل؟{' '}
                <Link
                  href={`/login${redirectTo !== '/account' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                  className="font-semibold text-accent hover:underline"
                >
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
