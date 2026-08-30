'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanners from '@/components/HeroBanners';
import CategoryCarousel from '@/components/CategoryCarousel';
import CarGrid from '@/components/CarGrid';
import Icon from '@/components/Icon';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5">
        {/* البانرات الترويجية */}
        <HeroBanners />

        {/* شريط الأقسام */}
        <CategoryCarousel />

        {/* الإعلانات المميزة */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink">
              <Icon name="star" filled className="h-[18px] w-[18px] text-accent" />
              إعلانات مميزة
            </h2>

            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-accent"
            >
              عرض الكل
              <Icon name="chevronLeft" className="h-3.5 w-3.5" />
            </Link>
          </div>

          <CarGrid filters={{}} columns={6} showToolbar={false} limit={12} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
