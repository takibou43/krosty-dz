'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import CarGrid from '@/components/CarGrid';
import AdSpace from '@/components/AdSpace';

export default function CarsPage() {
  const [filters, setFilters] = useState({});

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Header />

      <div className="bg-gradient-to-l from-primary to-blue-900 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            🚗 كل السيارات المعروضة للبيع
          </h1>
          <p className="text-sm text-blue-100 mt-1">
            تصفح آلاف إعلانات السيارات الحقيقية في كل ولايات الجزائر
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <SearchFilters onSearch={setFilters} />
        <AdSpace position="banner" />
        <CarGrid filters={filters} />
      </main>

      <Footer />
    </div>
  );
}
