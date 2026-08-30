'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // 1. قمنا باستيراد مكون التنقل من Next.js
import { getFavoritesCount, subscribeFavorites } from '@/utils/favorites';
import { useAuth } from '@/utils/useAuth';
import { signOut } from '@/utils/supabase';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setFavCount(getFavoritesCount());
    const unsubscribe = subscribeFavorites((ids) => setFavCount(ids.length));
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md border-b-4 border-accent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer"> {/* جعلنا الشعار يعيد للمجال الرئيسي عند الضغط */}
            <span className="text-2xl">🚗</span>
            <div>
              <h1 className="text-xl font-bold leading-none">
                <span className="text-accent">Carrosti</span>
                <span className="text-primary"> DZ</span>
              </h1>
              <p className="text-xs text-gray-500">إعلانات السيارات في الجزائر</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-semibold text-gray-700 text-sm">
            <Link href="/" className="hover:text-accent transition">الرئيسية</Link>
            <Link href="/cars" className="hover:text-accent transition">السيارات</Link>
            <Link href="/about" className="hover:text-accent transition">من نحن</Link>
            <Link href="/contact" className="hover:text-accent transition">اتصل بنا</Link>
          </nav>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* المفضلة */}
            <Link
              href="/favorites"
              aria-label="المفضلة"
              className="relative flex items-center justify-center text-gray-500 hover:text-accent transition"
            >
              <span className="text-xl">❤️</span>
              {favCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {favCount}
                </span>
              )}
            </Link>

            {/* حالة تسجيل الدخول (Desktop) */}
            {!loading && (
              user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/account" className="text-sm font-semibold text-gray-700 hover:text-accent transition">
                    👤 حسابي
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold text-gray-400 hover:text-red-600 transition"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hidden md:block text-sm font-semibold text-gray-700 hover:text-accent transition">
                  تسجيل الدخول
                </Link>
              )
            )}

            {/* 2. تحويل الزر إلى Link ليوجه المستخدم إلى صفحة إضافة إعلان */}
            <Link
              href="/add"  /* ⚠️ غير هذا المسار إلى اسم مجلد صفحة إضافة الإعلان لديك، مثلاً /create أو /add-listing */
              className="bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm block"
            >
              + أضف إعلانك
            </Link>

            <button
              className="md:hidden text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden mt-3 pt-3 border-t flex flex-col gap-3 font-semibold text-gray-700">
            <Link href="/" className="hover:text-accent transition">الرئيسية</Link>
            <Link href="/cars" className="hover:text-accent transition">السيارات</Link>
            <Link href="/favorites" className="hover:text-accent transition">❤️ المفضلة{favCount > 0 ? ` (${favCount})` : ''}</Link>
            {user ? (
              <>
                <Link href="/account" className="hover:text-accent transition">👤 حسابي</Link>
                <button onClick={handleLogout} className="text-right hover:text-red-600 transition">تسجيل الخروج</button>
              </>
            ) : (
              <Link href="/login" className="hover:text-accent transition">تسجيل الدخول</Link>
            )}
            <Link href="/about" className="hover:text-accent transition">من نحن</Link>
            <Link href="/contact" className="hover:text-accent transition">اتصل بنا</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
