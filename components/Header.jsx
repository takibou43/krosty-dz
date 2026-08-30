'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Icon from './Icon';
import { getFavoritesCount, subscribeFavorites } from '@/utils/favorites';
import { useAuth } from '@/utils/useAuth';
import { signOut } from '@/utils/supabase';

const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/cars', label: 'السيارات' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'اتصل بنا' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [query, setQuery] = useState('');
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/cars?q=${encodeURIComponent(q)}` : '/cars');
  };

  useEffect(() => {
    setFavCount(getFavoritesCount());
    const unsubscribe = subscribeFavorites((ids) => setFavCount(ids.length));
    return unsubscribe;
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* الشعار */}
          <Link href="/" className="flex shrink-0 items-center" aria-label="كروستي DZ - الصفحة الرئيسية">
            <img
              src="/logo.webp"
              alt="Crosty — بيع وشراء السيارات"
              className="h-10 w-auto md:h-11"
            />
          </Link>

          {/* شريط البحث — سطح المكتب */}
          <form onSubmit={handleSearch} className="hidden min-w-0 flex-1 md:block lg:px-6">
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="أدخل بحثك هنا"
                aria-label="بحث"
                className="w-full rounded-md border border-line bg-slate-50 py-2.5 pr-10 pl-3 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>
          </form>

          {/* الإجراءات */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/favorites"
              aria-label={`المفضلة${favCount > 0 ? ` (${favCount})` : ''}`}
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-accent"
            >
              <Icon name="heart" className="h-[18px] w-[18px]" />
              {favCount > 0 && (
                <span className="absolute -left-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white nums">
                  {favCount}
                </span>
              )}
            </Link>

            {!loading &&
              (user ? (
                <div className="hidden items-center gap-1 md:flex">
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-ink"
                  >
                    <Icon name="user" className="h-[18px] w-[18px]" />
                    حسابي
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="تسجيل الخروج"
                    className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-accent"
                  >
                    <Icon name="logout" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-ink md:block"
                >
                  تسجيل الدخول
                </Link>
              ))}

            <Link
              href="/add"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark md:px-4"
            >
              <Icon name="plus" className="h-4 w-4" strokeWidth={2.2} />
              <span className="hidden sm:inline">أضف إعلانك</span>
              <span className="sm:hidden">إعلان</span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 md:hidden"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* شريط البحث — الجوال (سطر مستقل بعرض كامل) */}
        <form onSubmit={handleSearch} className="pb-2.5 md:hidden">
          <div className="relative">
            <Icon
              name="search"
              className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="أدخل بحثك هنا"
              aria-label="بحث"
              className="w-full rounded-md border border-line bg-slate-50 py-2.5 pr-10 pl-3 text-base text-ink transition placeholder:text-slate-400 focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>
        </form>

        {/* تنقّل ثانوي — سطح المكتب */}
        <nav className="hidden items-center gap-1 border-t border-line py-1.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-2.5 py-1.5 text-xs font-medium transition ${
                isActive(link.href)
                  ? 'text-accent'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* قائمة الجوال */}
        {menuOpen && (
          <nav className="flex flex-col gap-0.5 border-t border-line py-2 md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive(link.href) ? 'bg-slate-50 text-accent' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/favorites"
              className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <Icon name="heart" className="h-4 w-4 text-slate-400" />
                المفضلة
              </span>
              {favCount > 0 && <span className="text-xs text-muted nums">{favCount}</span>}
            </Link>

            {user ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <Icon name="user" className="h-4 w-4 text-slate-400" />
                  حسابي
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-right text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <Icon name="logout" className="h-4 w-4 text-slate-400" />
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <Icon name="lock" className="h-4 w-4 text-slate-400" />
                تسجيل الدخول
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
