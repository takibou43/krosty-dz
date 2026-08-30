import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';

export const metadata = {
  title: 'من نحن - كروستي DZ',
  description: 'تعرف على منصة كروستي DZ لبيع وشراء السيارات في الجزائر',
};

const FEATURES = [
  {
    icon: 'search',
    title: 'بحث دقيق',
    text: 'فلاتر حسب الولاية، الماركة، السعر، نوع الوقود وناقل الحركة للوصول إلى السيارة المناسبة بسرعة.',
  },
  {
    icon: 'bolt',
    title: 'نشر مجاني وسريع',
    text: 'انشر إعلانك مجاناً في أقل من دقيقة مع إمكانية إضافة صور متعددة ووصف مفصّل.',
  },
  {
    icon: 'shield',
    title: 'إعلانات موثوقة',
    text: 'نعمل على مراجعة الإعلانات للحدّ من المحتوى المكرر أو المضلل والحفاظ على جودة المنصة.',
  },
  {
    icon: 'mapPin',
    title: 'تغطية وطنية',
    text: 'إعلانات من كل الولايات الجزائرية الـ58، من الشمال إلى أقصى الجنوب.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <PageHeader
        icon="info"
        title="من نحن"
        subtitle="منصة إعلانات مبوبة جزائرية متخصصة في السيارات"
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            <p>
              <strong className="text-ink">كروستي DZ</strong> منصة إعلانات مبوبة جزائرية متخصصة في
              بيع وشراء السيارات الجديدة والمستعملة. هدفنا تسهيل عملية البحث عن السيارة المناسبة أو
              بيع سيارتك بأسرع وقت وبأمان تام.
            </p>
            <p>
              نوفّر لمستخدمينا تجربة بحث سلسة عبر فلاتر دقيقة، بالإضافة إلى إمكانية نشر الإعلانات
              مجاناً في دقائق معدودة، ونعمل باستمرار على تطوير المنصة لتقديم خدمة أفضل لكل
              الجزائريين.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-card border border-line bg-white p-5 shadow-card">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-50 text-accent">
                <Icon name={f.icon} className="h-[18px] w-[18px]" />
              </span>
              <h2 className="mt-3.5 text-sm font-semibold text-ink">{f.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
