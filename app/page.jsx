'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarGrid from '@/components/CarGrid';
import Icon from '@/components/Icon';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-ink md:text-2xl">السيارات المعروضة للبيع</h1>
            <p className="mt-1 text-sm text-muted">
              إعلانات حقيقية من بائعين في كل ولايات الجزائر
            </p>
          </div>

          <Link
            href="/add"
            className="inline-flex items-center gap-2 rounded-md border border-ink bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
          >
            <Icon name="plus" className="h-4 w-4" strokeWidth={2.2} />
            أضف إعلانك
          </Link>
        </div>

        <CarGrid filters={{}} />
      </main>

      <Footer />
    </div>
  );
}
