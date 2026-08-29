'use client';

import { useState } from 'react';

const plans = [
  {
    id: 'standard',
    name: 'إعلان عادي',
    price: 'مجاني',
    duration: 'غير محدود',
    features: ['ظهور عادي في الشبكة', 'صور حتى 10', 'وصف مفصل للسيارة'],
  },
  {
    id: 'featured-7days',
    name: 'مميز 7 أيام',
    price: '1,500 DA',
    duration: '7 أيام',
    badge: 'الأكثر شهرة',
    features: ['✨ تثبيت في أعلى النتائج', '⭐ شارة إعلان مميز', '📈 زيارات ومشاهدات 10x', 'أولوية متقدمة في البحث'],
  },
  {
    id: 'featured-30days',
    name: 'مميز شهر كامل',
    price: '4,500 DA',
    duration: '30 يوم',
    features: ['✨ تثبيت في أعلى النتائج', '⭐ شارة إعلان مميز', '📈 زيارات ومشاهدات 10x', 'أولوية قصوى ودعم مستمر'],
  },
];

export default function FeaturedAdsSection({ onPlanSelect }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    
    // إذا كانت الخطة مجانية، نمررها مباشرة دون الحاجة لفتح نافذة الدفع عبر بريدي موب
    if (plan.id === 'standard') {
      if (onPlanSelect) onPlanSelect('standard');
      alert('تم اختيار الإعلان العادي بنجاح. سيتم نشر إعلانك مجاناً!');
      return;
    }

    // إذا كانت خطة مدفوعة، نفتح نافذة الدفع والتأكيد
    setShowModal(true);
  };

  const handleConfirmPayment = () => {
    setShowModal(false);
    if (onPlanSelect && selectedPlan) {
      onPlanSelect(selectedPlan.id);
    }
    alert(`شكراً لك! تم تأكيد اختيار باقة (${selectedPlan.name}). سيتم تفعيل الميزة فور التحقق من عملية بريدي موب.`);
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100" dir="rtl">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">✨ ترويج الإعلان الخاص بك</h2>
        <p className="text-gray-500 text-sm md:text-base">اختر خطة تميز للحصول على بيع أسرع ونسب مشاهدة مضاعفة لسيارتك</p>
      </div>

      {/* شبكة الباقات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl p-6 transition duration-300 bg-white border-2 flex flex-col justify-between ${
              plan.badge
                ? 'border-accent shadow-lg md:-translate-y-2'
                : 'border-gray-200 hover:border-accent shadow-sm'
            }`}
          >
            {/* شارة التميز فوق الكارت */}
            {plan.badge && (
              <div className="absolute -top-3.5 right-6 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold shadow-sm">
                {plan.badge}
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-primary mb-2">{plan.name}</h3>

              {/* تفاصيل السعر */}
              <div className="mb-4 bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-black text-accent">{plan.price}</div>
                <div className="text-xs text-gray-400 mt-0.5">صلاحية التثبيت: {plan.duration}</div>
              </div>

              {/* الميزات المتوفرة */}
              <ul className="mb-6 space-y-2.5">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-accent font-bold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* زر الاختيار */}
            <button
              type="button"
              onClick={() => handleSelectPlan(plan)}
              className={`w-full font-bold py-2.5 rounded-lg text-sm transition duration-300 ${
                plan.badge
                  ? 'bg-accent hover:bg-orange-600 text-white shadow-md'
                  : 'bg-primary hover:bg-black text-white'
              }`}
            >
              {plan.id === 'standard' ? 'انشر مجاناً' : 'ترقية الإعلان الآن'}
            </button>
          </div>
        ))}
      </div>

      {/* نافذة تأكيد بريدي موب المنبثقة (Modal) */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl border border-gray-100" dir="rtl">
            <span className="text-4xl mb-2 block">📱</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الدفع عبر BaridiMob</h3>
            <p className="text-sm text-gray-500 mb-6">
              يرجى إرسال المبلغ المستحق للعملية إلى حسابنا، وسيتم ترقية إعلانك مباشرة بعد المراجعة.
            </p>

            {/* الحاوية المالية */}
            <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-100">
              <p className="text-xs text-gray-500 mb-1">الخطة: <span className="font-bold text-gray-700">{selectedPlan.name}</span></p>
              <p className="text-xs text-gray-500 mb-2">المبلغ الإجمالي المستحق:</p>
              <p className="text-3xl font-black text-accent">{selectedPlan.price}</p>
            </div>

            {/* أزرار الإجراءات */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="w-full bg-accent text-white font-bold py-3 rounded-lg text-sm hover:bg-orange-600 shadow transition"
              >
                لقد قمت بالتحويل (تأكيد الطلب)
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-100 text-gray-600 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                إلغاء والتراجع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}