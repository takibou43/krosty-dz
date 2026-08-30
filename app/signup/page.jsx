'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { signUp, isSupabaseConfigured } from '@/utils/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const inputClass =
    'w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-red-200 bg-white text-gray-900';

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
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Header />
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-6 text-primary border-b pb-3">
          ✍️ إنشاء حساب جديد
        </h2>

        {success ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 text-center">
            <p className="font-bold mb-2">تم إنشاء حسابك بنجاح 🎉</p>
            <p className="mb-4">إذا طُلب منك تأكيد بريدك الإلكتروني، تحقق من صندوق الوارد قبل تسجيل الدخول.</p>
            <Link href="/login" className="inline-block bg-accent hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition">
              تسجيل الدخول الآن
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  placeholder="محمد بن علي"
                  className={inputClass}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
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
                  placeholder="6 أحرف على الأقل"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition duration-300 text-base shadow"
              >
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-5">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-accent font-bold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
