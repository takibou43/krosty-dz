'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { CATEGORIES } from '@/utils/categories';

const PER_PAGE = 5; // عدد الأقسام في كل صفحة على الشاشات الصغيرة

export default function CategoryCarousel() {
  const scrollerRef = useRef(null);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(CATEGORIES.length / PER_PAGE);

  // تحديث النقطة النشطة أثناء التمرير
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return setPage(0);
      // القائمة RTL: التمرير يكون بقيم سالبة في بعض المتصفحات
      const ratio = Math.abs(el.scrollLeft) / max;
      setPage(Math.min(pageCount - 1, Math.round(ratio * (pageCount - 1))));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [pageCount]);

  const goToPage = (i) => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const target = pageCount > 1 ? (max * i) / (pageCount - 1) : 0;
    // نحافظ على إشارة التمرير كما يستخدمها المتصفح في وضع RTL
    el.scrollTo({ left: el.scrollLeft < 0 ? -target : target, behavior: 'smooth' });
    setPage(i);
  };

  return (
    <section className="py-6">
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/cars?category=${cat.slug}`}
            className="group flex w-[104px] shrink-0 flex-col items-center gap-2.5 sm:w-[116px]"
          >
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-white text-slate-500 shadow-card transition duration-300 group-hover:-translate-y-1 group-hover:border-accent group-hover:text-accent group-hover:shadow-pop sm:h-24 sm:w-24"
            >
              <Icon name={cat.icon} className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={1.4} />
            </span>
            <span className="text-center text-2xs font-medium leading-tight text-slate-600 transition group-hover:text-accent sm:text-xs">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>

      {/* مؤشرات الصفحات */}
      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              aria-label={`الصفحة ${i + 1}`}
              aria-current={i === page ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === page ? 'w-6 bg-accent' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
