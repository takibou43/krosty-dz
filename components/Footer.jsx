import Link from 'next/link';
import Icon from './Icon';

const QUICK_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/cars', label: 'تصفح السيارات' },
  { href: '/add', label: 'أضف إعلانك' },
  { href: '/favorites', label: 'المفضلة' },
];

const SUPPORT_LINKS = [
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'اتصل بنا' },
  { href: '/account', label: 'حسابي' },
];

const SOCIALS = [
  { icon: 'facebook', label: 'فيسبوك' },
  { icon: 'instagram', label: 'إنستغرام' },
  { icon: 'phone', label: 'واتساب' },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-primary text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* عن الموقع */}
          <div className="col-span-2 md:col-span-1">
            <img src="/logo.webp" alt="Crosty" className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              منصة إعلانات مبوبة متخصصة في بيع وشراء السيارات الجديدة والمستعملة في كل ولايات الجزائر.
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white">روابط سريعة</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الدعم */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white">الدعم</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تابعنا */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white">تابعنا</h3>
            <div className="mt-4 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.icon}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-slate-300 transition hover:border-accent hover:bg-accent hover:text-white"
                >
                  <Icon name={s.icon} className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <Icon name="shield" className="h-4 w-4 shrink-0" />
              منصة آمنة وموثوقة
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p className="nums">© 2026 كروستي DZ — جميع الحقوق محفوظة</p>
          <p>صُنع في الجزائر</p>
        </div>
      </div>
    </footer>
  );
}
