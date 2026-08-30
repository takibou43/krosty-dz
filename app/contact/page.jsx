'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const inputClass =
    'w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-red-200 bg-white text-gray-900';

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-10 md:py-14">
        <h1 className="text-3xl font-black text-primary mb-6">اتصل بنا</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <p className="text-slate-600 mb-6 text-sm">
            لديك استفسار أو مشكلة تقنية؟ راسلنا عبر النموذج أدناه أو على البريد الإلكتروني{' '}
            <a href="mailto:support@krostydz.com" className="text-accent font-semibold">
              support@krostydz.com
            </a>
          </p>

          {sent ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 text-sm font-semibold">
              شكراً لتواصلك معنا! سنقوم بالرد عليك في أقرب وقت ممكن.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الاسم *</label>
                <input type="text" required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">البريد الإلكتروني *</label>
                <input type="email" required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">الرسالة *</label>
                <textarea rows="4" required className={inputClass} />
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-red-700 text-white font-bold py-3 rounded-lg transition text-base shadow"
              >
                إرسال الرسالة
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
