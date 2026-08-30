'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';

const inputClass =
  'w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-accent focus:outline-none';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <PageHeader
        icon="mail"
        title="اتصل بنا"
        subtitle="لديك استفسار أو مشكلة تقنية؟ فريقنا جاهز لمساعدتك"
      />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-4 flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3.5 shadow-card">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-50 text-accent">
            <Icon name="mail" className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="text-2xs uppercase tracking-wide text-muted">البريد الإلكتروني</p>
            <a
              href="mailto:support@krostydz.com"
              className="text-sm font-semibold text-ink transition hover:text-accent"
            >
              support@krostydz.com
            </a>
          </div>
        </div>

        <div className="rounded-card border border-line bg-white shadow-card">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">أرسل لنا رسالة</h2>
          </div>

          {sent ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon name="check" className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">تم إرسال رسالتك</p>
              <p className="mt-1 text-xs text-muted">سنقوم بالرد عليك في أقرب وقت ممكن.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              <label className="block">
                <span className="mb-1.5 block text-2xs font-medium uppercase tracking-wide text-muted">
                  الاسم
                </span>
                <input type="text" required placeholder="اسمك الكامل" className={inputClass} />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-2xs font-medium uppercase tracking-wide text-muted">
                  البريد الإلكتروني
                </span>
                <input type="email" required placeholder="example@mail.com" className={inputClass} />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-2xs font-medium uppercase tracking-wide text-muted">
                  الرسالة
                </span>
                <textarea
                  rows="5"
                  required
                  placeholder="اكتب رسالتك هنا..."
                  className={`${inputClass} resize-y`}
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-md bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
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
