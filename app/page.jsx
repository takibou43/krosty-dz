'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import CarGrid from '@/components/CarGrid';
import FeaturedAdsSection from '@/components/FeaturedAdsSection';
import AdSpace from '@/components/AdSpace';

export default function HomePage() {
  const [filters, setFilters] = useState({});

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#fff7ed_100%)]" dir="rtl">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 rounded-[2rem] bg-gradient-to-br from-primary via-blue-900 to-blue-950 p-6 md:p-8 text-white shadow-2xl overflow-hidden">
          <div className="space-y-5">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
              🔥 أفضل منصة لبيع وشراء السيارات في الجزائر
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              ابحث عن سيارتك المثالية أو انشر إعلانك في دقائق
            </h1>
            <p className="text-base md:text-lg text-blue-100 max-w-2xl">
              من السيارات المستعملة إلى الموديلات الجديدة، كل ما تحتاجه في مكان واحد مع تجربة بحث سهلة وآمنة.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/cars" className="rounded-full bg-accent px-5 py-3 font-bold text-white shadow-lg hover:bg-orange-600 transition">
                تصفح السيارات
              </a>
              <a href="/add" className="rounded-full border border-white/40 px-5 py-3 font-bold text-white hover:bg-white/10 transition">
                أضف إعلانك الآن
              </a>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur">
            <div className="rounded-[1.25rem] bg-white p-5 text-slate-800 shadow-xl">
              <p className="text-sm font-bold text-accent">أحدث العروض</p>
              <div className="mt-4 space-y-3">
                {['سيارة BMW X5', 'Renault Clio 2022', 'Peugeot 208 موديل 2021'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                    <span className="font-semibold">{item}</span>
                    <span className="text-sm text-slate-500">متوفر الآن</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <SearchFilters onSearch={setFilters} />
        </div>

        <FeaturedAdsSection />
        <AdSpace position="banner" />
        <CarGrid filters={filters} />
      </main>

      <Footer />
    </div>
  );
}