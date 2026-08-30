'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import SearchFilters from '@/components/SearchFilters';
import CarGrid from '@/components/CarGrid';
import AdSpace from '@/components/AdSpace';
import Icon from '@/components/Icon';
import { categoryLabel } from '@/utils/categories';

export default function CarsPage() {
  const [filters, setFilters] = useState({});
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  // نقرأ q و category من الرابط (بدل useSearchParams الذي يتطلب Suspense)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    const cat = params.get('category') || '';
    setKeyword(q);
    setCategory(cat);
    setFilters((prev) => ({
      ...prev,
      ...(q ? { keyword: q } : {}),
      ...(cat ? { category: cat } : {}),
    }));
  }, []);

  const handleSearch = (next) => {
    // البحث النصي والقسم يبقيان فعّالين مع فلاتر اللوحة
    setFilters({
      ...next,
      ...(keyword ? { keyword } : {}),
      ...(category ? { category } : {}),
    });
  };

  const clearKeyword = () => {
    setKeyword('');
    setFilters((prev) => {
      const { keyword: _drop, ...rest } = prev;
      return rest;
    });
    window.history.replaceState(null, '', '/cars');
  };

  const subtitle = category
    ? `قسم ${categoryLabel(category)} — تصفّح الإعلانات المتاحة`
    : 'تصفّح إعلانات السيارات الحقيقية في كل ولايات الجزائر';

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <PageHeader
        icon="car"
        title={category ? categoryLabel(category) : 'كل السيارات المعروضة للبيع'}
        subtitle={subtitle}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {keyword && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-card border border-line bg-white px-4 py-3 shadow-card">
            <Icon name="search" className="h-4 w-4 shrink-0 text-accent" />
            <span className="text-sm text-muted">
              نتائج البحث عن <span className="font-semibold text-ink">«{keyword}»</span>
            </span>
            <button
              type="button"
              onClick={clearKeyword}
              className="mr-auto inline-flex items-center gap-1 text-xs font-medium text-muted transition hover:text-accent"
            >
              <Icon name="close" className="h-3.5 w-3.5" />
              مسح البحث
            </button>
          </div>
        )}

        <SearchFilters onSearch={handleSearch} />
        <CarGrid filters={filters} columns={4} />
        <AdSpace position="banner" />
      </main>

      <Footer />
    </div>
  );
}
