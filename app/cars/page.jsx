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

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-black text-primary mb-6">
          🚗 كل السيارات المعروضة للبيع
        </h1>

        <SearchFilters onSearch={setFilters} />
        <AdSpace position="banner" />
        <CarGrid filters={filters} />
      </main>

      <Footer />
    </div>
  );
}
