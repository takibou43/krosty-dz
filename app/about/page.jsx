import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'من نحن - كروستي DZ',
  description: 'تعرف على منصة كروستي DZ لبيع وشراء السيارات في الجزائر',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <h1 className="text-3xl font-black text-primary mb-6">من نحن</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4 text-slate-700 leading-relaxed">
          <p>
            <strong>كروستي DZ</strong> منصة إعلانات مبوبة جزائرية متخصصة في بيع وشراء السيارات
            الجديدة والمستعملة. هدفنا تسهيل عملية البحث عن السيارة المناسبة أو بيع سيارتك
            بأسرع وقت وبأمان تام.
          </p>
          <p>
            نوفر لمستخدمينا تجربة بحث سلسة عبر فلاتر دقيقة (الولاية، الماركة، السعر، نوع
            الوقود وناقل الحركة)، بالإضافة إلى إمكانية نشر الإعلانات مجاناً في دقائق معدودة.
          </p>
          <p>
            نعمل باستمرار على تطوير المنصة لتقديم خدمة أفضل لكل الجزائريين الباحثين عن سيارة
            أحلامهم أو الراغبين في بيع سياراتهم.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
