'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { signIn, isSupabaseConfigured } from '@/utils/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputClass =
    'w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-orange-200 bg-white text-gray-900';

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

    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Header />
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-6 text-primary border-b pb-3">
          🔑 تسجيل الدخول
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">البريد الإلكتروني *</label>
            <input
              type="email"
              required
              placeholder="example@mail.com"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">كلمة المرور *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-orange-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition duration-300 text-base shadow"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          ليس لديك حساب؟{' '}
          <Link href="/signup" className="text-accent font-bold hover:underline">
            أنشئ حساباً جديداً
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}
