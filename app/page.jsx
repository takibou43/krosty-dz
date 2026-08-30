'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarGrid from '@/components/CarGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f5f5f5_0%,#fff3e8_100%)]" dir="rtl">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex justify-end mb-6">
          <a
            href="/add"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-white shadow-lg hover:bg-orange-600 transition"
          >
            <span className="text-lg leading-none">+</span> أضف إعلانك
          </a>
        </div>

        <CarGrid filters={{}} />
      </main>

      <Footer />
    </div>
  );
}
