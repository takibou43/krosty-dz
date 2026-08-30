'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/Icon';
import { signIn, isSupabaseConfigured } from '@/utils/supabase';

const inputClass =
  'w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-accent focus:outline-none';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirectTo, setRedirectTo] = useState('/account');

  // نقرأ وجهة العودة من الرابط مباشرة (بدل useSearchParams الذي يتطلب Suspense)
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get('redirect');
    // نقبل المسارات الداخلية فقط، منعاً لإعادة التوجيه إلى موقع خارجي
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

    setLoading(true);
    const user = await signIn(email, password);
    setLoading(false);

    if (!user) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      return;
    }

    router.push(redirectTo);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-12">
        <div className="rounded-card border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-5">
            <h1 className="flex items-center gap-2.5 text-lg font-bold text-ink">
              <Icon name="lock" className="h-5 w-5 text-accent" strokeWidth={1.7} />
              تسجيل الدخول
            </h1>
            <p className="mt-1 text-xs text-muted">أدخل بياناتك للوصول إلى حسابك وإعلاناتك</p>
          </div>

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

            <label className="block">
              <span className="mb-1.5 block text-2xs font-medium uppercase tracking-wide text-muted">
                كلمة المرور
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
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
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="border-t border-line px-6 py-4 text-center text-xs text-muted">
            ليس لديك حساب؟{' '}
            <Link
              href={`/signup${redirectTo !== '/account' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
              className="font-semibold text-accent hover:underline"
            >
              أنشئ حساباً جديداً
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
