'use client';

import { useState } from 'react';

const wilayat = [
  'الجزائر العاصمة', 'وهران', 'قسنطينة', 'سطيف', 'عنابة',
  'بجاية', 'تيزي وزو', 'قالمة', 'سكيكدة', 'المدية',
  'تلمسان', 'البليدة', 'سيدي بلعباس', 'مستغانم', 'الشلف',
  'أم البواقي', 'باتنة', 'بسكرة', 'الجلفة', 'المسيلة',
  'غرداية', 'ورقلة', 'تبسة', 'سوق أهراس', 'خنشلة',
  'جيجل', 'عين الدفلى', 'النعامة', 'عين تيموشنت', 'تيارت',
  'بومرداس', 'الطارف', 'تندوف', 'تيسمسيلت', 'إليزي',
  'برج بوعريريج', 'البويرة', 'الأغواط', 'أدرار', 'بشار',
  'تمنراست', 'معسكر', 'الوادي', 'غليزان', 'بريكة'
];

const brands = [
  'Renault', 'Peugeot', 'Volkswagen', 'Hyundai', 'Dacia',
  'Toyota', 'Honda', 'Kia', 'BMW', 'Mercedes-Benz',
  'Audi', 'Citroën', 'Opel', 'Ford', 'Chevrolet',
  'Nissan', 'Mazda', 'Suzuki', 'Mitsubishi', 'Fiat',
  'Seat', 'Skoda', 'Jeep', 'Land Rover', 'Tesla'
];

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

  const selectClass = "w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-orange-200 text-sm bg-white";

  return (
    <div className="bg-white shadow-md rounded-xl p-5 mb-8 border border-gray-100">
      <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
        🔍 ابحث عن سيارتك
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {/* Wilaya */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">الولاية</label>
          <select name="wilaya" value={filters.wilaya} onChange={handleChange} className={selectClass}>
            <option value="">كل الولايات</option>
            {wilayat.map((w, index) => <option key={`wilaya-${index}-${w}`} value={w}>{w}</option>)}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">الماركة</label>
          <select name="brand" value={filters.brand} onChange={handleChange} className={selectClass}>
            <option value="">كل الماركات</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Fuel */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">الوقود</label>
          <select name="fuelType" value={filters.fuelType} onChange={handleChange} className={selectClass}>
            <option value="">كل الأنواع</option>
            {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Gearbox */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">ناقل الحركة</label>
          <select name="gearbox" value={filters.gearbox} onChange={handleChange} className={selectClass}>
            <option value="">الكل</option>
            {gearboxTypes.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">السعر من (دج)</label>
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
          <label className="block text-xs font-semibold text-gray-600 mb-1">السعر إلى (دج)</label>
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
          className="flex-1 bg-primary hover:bg-blue-900 text-white font-bold py-2.5 px-4 rounded-lg transition duration-300 text-sm"
        >
          🔍 بحث
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 px-5 rounded-lg transition duration-300 text-sm"
        >
          مسح
        </button>
      </div>
    </div>
  );
}