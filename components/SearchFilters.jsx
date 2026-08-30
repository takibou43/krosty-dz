'use client';

import { useState } from 'react';
import Icon from './Icon';
import { WILAYAT, BRANDS } from '@/utils/constants';
import { getModelsForBrand } from '@/utils/carModels';

const fuelTypes = ['Essence', 'Diesel', 'GPL', 'Hybride', 'Électrique'];
const gearboxTypes = ['Manuelle', 'Automatique'];

const EMPTY = { wilaya: '', brand: '', model: '', fuelType: '', gearbox: '', minPrice: '', maxPrice: '' };

const fieldClass =
  'w-full rounded-md border border-line bg-white px-3 py-2.5 text-base text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-accent focus:outline-none md:py-2 md:text-sm';

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-2xs font-medium uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}

export default function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState(EMPTY);
  // على الجوال تبقى اللوحة مطويّة حتى لا تدفع الإعلانات خارج الشاشة
  const [open, setOpen] = useState(false);

  const activeCount = Object.values(filters).filter(Boolean).length;

  const models = getModelsForBrand(filters.brand);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // تغيير الماركة يُصفّر الموديل
    setFilters((prev) =>
      name === 'brand' ? { ...prev, brand: value, model: '' } : { ...prev, [name]: value }
    );
  };

  const handleSearch = () => {
    if (onSearch) onSearch(filters);
    setOpen(false); // على الجوال نطوي اللوحة لتظهر النتائج مباشرة
  };

  const handleReset = () => {
    setFilters(EMPTY);
    if (onSearch) onSearch(EMPTY);
  };

  return (
    <section className="mb-5 rounded-card border border-line bg-white shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Icon name="search" className="h-4 w-4 text-accent" />
          ابحث عن سيارتك
          {activeCount > 0 && (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-2xs font-semibold text-white nums">
              {activeCount}
            </span>
          )}
        </h2>

        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted transition hover:text-accent"
            >
              <Icon name="close" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">مسح الفلاتر</span>
              <span className="sm:hidden">مسح</span>
            </button>
          )}

          {/* زر الطيّ — الجوال فقط */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent md:hidden"
          >
            {open ? 'إخفاء الفلاتر' : 'الفلاتر'}
            <Icon
              name="chevronDown"
              className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      <div className={`${open ? 'block' : 'hidden'} p-4 md:block`}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          <Field label="الولاية">
            <select name="wilaya" value={filters.wilaya} onChange={handleChange} className={fieldClass}>
              <option value="">كل الولايات</option>
              {WILAYAT.map((w, i) => (
                <option key={`wilaya-${i}-${w}`} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </Field>

          <Field label="الماركة">
            <select name="brand" value={filters.brand} onChange={handleChange} className={fieldClass}>
              <option value="">كل الماركات</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>

          <Field label="الموديل">
            <select
              name="model"
              value={filters.model}
              onChange={handleChange}
              disabled={!filters.brand}
              className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
            >
              <option value="">{filters.brand ? 'كل الموديلات' : 'اختر الماركة أولاً'}</option>
              {filters.brand &&
                models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
            </select>
          </Field>

          <Field label="الوقود">
            <select name="fuelType" value={filters.fuelType} onChange={handleChange} className={fieldClass}>
              <option value="">كل الأنواع</option>
              {fuelTypes.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>

          <Field label="ناقل الحركة">
            <select name="gearbox" value={filters.gearbox} onChange={handleChange} className={fieldClass}>
              <option value="">الكل</option>
              {gearboxTypes.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>

          <Field label="السعر من (دج)">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="0"
              className={`${fieldClass} nums`}
            />
          </Field>

          <Field label="السعر إلى (دج)">
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="بلا حد"
              className={`${fieldClass} nums`}
            />
          </Field>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark sm:flex-none sm:px-8"
          >
            <Icon name="search" className="h-4 w-4" strokeWidth={2} />
            بحث
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-line px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            مسح
          </button>
        </div>
      </div>
    </section>
  );
}
