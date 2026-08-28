'use client';

import { useState } from 'react';
import { WILAYAT, BRANDS } from '@/utils/constants';

const wilayat = WILAYAT;
const brands = BRANDS;

const fuelTypes = ['Essence', 'Diesel', 'GPL', 'Hybride', 'Électrique'];
const gearboxTypes = ['Manuelle', 'Automatique'];

export default function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    wilaya: '',
    brand: '',
    fuelType: '',
    gearbox: '',
    minPrice: '',
    maxPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    if (onSearch) onSearch(filters);
  };

  const handleReset = () => {
    const empty = { wilaya: '', brand: '', fuelType: '', gearbox: '', minPrice: '', maxPrice: '' };
    setFilters(empty);
    if (onSearch) onSearch(empty);
  };

  const selectClass = "w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-orange-100 text-sm bg-slate-50 focus:bg-white transition";

  return (
    <div className="bg-white shadow-sm rounded-2xl p-5 mb-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-accent">🔍</span>
        <h2 className="text-base font-bold text-primary">ابحث عن سيارتك</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {/* Wilaya */}
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">📍 الولاية</label>
          <select name="wilaya" value={filters.wilaya} onChange={handleChange} className={selectClass}>
            <option value="">كل الولايات</option>
            {wilayat.map((w, index) => <option key={`wilaya-${index}-${w}`} value={w}>{w}</option>)}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">🏷️ الماركة</label>
          <select name="brand" value={filters.brand} onChange={handleChange} className={selectClass}>
            <option value="">كل الماركات</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Fuel */}
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">⛽ الوقود</label>
          <select name="fuelType" value={filters.fuelType} onChange={handleChange} className={selectClass}>
            <option value="">كل الأنواع</option>
            {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Gearbox */}
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">⚙️ ناقل الحركة</label>
          <select name="gearbox" value={filters.gearbox} onChange={handleChange} className={selectClass}>
            <option value="">الكل</option>
            {gearboxTypes.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">💰 السعر من (دج)</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="0"
            className={selectClass}
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">💰 السعر إلى (دج)</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="بلا حد"
            className={selectClass}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          className="flex-1 bg-accent hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-300 text-sm shadow-sm"
        >
          🔍 بحث
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 px-5 rounded-lg transition duration-300 text-sm"
        >
          مسح
        </button>
      </div>
    </div>
  );
}