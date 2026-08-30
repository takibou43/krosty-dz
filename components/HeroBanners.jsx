import Link from 'next/link';
import Icon from './Icon';

// شعارات الشركاء — نصية حتى تستبدلها بشعارات حقيقية
const PARTNERS = ['CROSTY', 'AUTO DZ', 'MOTORS', 'PREMIUM'];

export default function HeroBanners() {
  return (
    <section className="grid gap-3 lg:grid-cols-[1fr_2fr]">
      {/* البانر الجانبي */}
      <Link
        href="/add"
        className="group relative order-2 flex min-h-[180px] flex-col justify-between overflow-hidden rounded-card border border-line bg-white p-5 shadow-card transition hover:border-slate-300 hover:shadow-pop lg:order-none"
      >
        <div>
          <span className="inline-flex items-center gap-1.5 rounded bg-accent/10 px-2 py-1 text-2xs font-semibold text-accent">
            <Icon name="bolt" className="h-3 w-3" />
            مجاناً
          </span>
          <h2 className="mt-3 text-lg font-bold leading-snug text-ink">
            بِع سيارتك
            <br />
            بسرعة وأمان
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            انشر إعلانك في أقل من دقيقة ويصل إلى آلاف المشترين في كل الجزائر.
          </p>
        </div>

        <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-md bg-ink px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-accent">
          <Icon name="plus" className="h-3.5 w-3.5" strokeWidth={2.2} />
          أضف إعلانك
        </span>

        <Icon
          name="car"
          className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 text-slate-100"
          strokeWidth={1}
        />
      </Link>

      {/* البانر الرئيسي */}
      <div className="relative order-1 flex min-h-[180px] flex-col justify-between overflow-hidden rounded-card border border-line bg-primary p-5 text-white shadow-card sm:p-6 lg:order-none">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, #e8141c 0%, transparent 45%), radial-gradient(circle at 85% 80%, #e8141c 0%, transparent 40%)',
          }}
        />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded bg-white/10 px-2 py-1 text-2xs font-semibold backdrop-blur">
            <Icon name="star" filled className="h-3 w-3 text-accent" />
            إعلانات مميزة
          </span>
          <h2 className="mt-3 max-w-md text-xl font-bold leading-snug md:text-2xl">
            سيارات وآلات ومعدات ثقيلة من كل ولايات الجزائر
          </h2>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-300 md:text-sm">
            تصفّح آلاف الإعلانات الموثوقة — سيارات، شاحنات، جرارات ومقطورات.
          </p>

          <Link
            href="/cars"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-dark"
          >
            <Icon name="search" className="h-3.5 w-3.5" />
            تصفّح الإعلانات
          </Link>
        </div>

        {/* شعارات الشركاء */}
        <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4">
          {PARTNERS.map((p) => (
            <span
              key={p}
              className="text-2xs font-semibold uppercase tracking-widest text-white/35 transition hover:text-white/70"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
