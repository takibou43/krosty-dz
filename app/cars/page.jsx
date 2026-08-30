'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import SearchFilters from '@/components/SearchFilters';
import CarGrid from '@/components/CarGrid';
import AdSpace from '@/components/AdSpace';

export default function CarsPage() {
  const [filters, setFilters] = useState({});

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <PageHeader
        icon="car"
        title="كل السيارات المعروضة للبيع"
        subtitle="تصفّح إعلانات السيارات الحقيقية في كل ولايات الجزائر"
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <SearchFilters onSearch={setFilters} />
        <CarGrid filters={filters} />
        <AdSpace position="banner" />
      </main>

      <Footer />
    </div>
  );
}
