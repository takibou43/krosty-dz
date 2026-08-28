'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { addCar, isSupabaseConfigured, uploadCarImages } from '@/utils/supabase';
import { WILAYAT, BRANDS, FUEL_TYPES, GEARBOX_TYPES, DOCUMENTS_STATUS } from '@/utils/constants';
import { useAuth } from '@/utils/useAuth';

const initialForm = {
  title: '',
  description: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  wilaya: WILAYAT[0],
  fuel_type: FUEL_TYPES[0],
  gearbox: GEARBOX_TYPES[0],
  mileage: '',
  documents: DOCUMENTS_STATUS[0],
  price: '',
  phone_number: '',
};

export default function AddCarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [uploadingLabel, setUploadingLabel] = useState(null);
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const MAX_IMAGES = 8;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const combined = [...imageFiles, ...selected].slice(0, MAX_IMAGES);
    setImageFiles(combined);
    setImagePreviews(combined.map((f) => URL.createObjectURL(f)));
    e.target.value = '';
  };

  const removeImage = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
    setImagePreviews(updatedFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('قاعدة البيانات غير مهيأة حالياً. يرجى المحاولة لاحقاً.');
      return;
    }

    setLoading(true);

    let images = [];
    if (imageFiles.length > 0) {
      setUploadingLabel(`جاري رفع الصور (${imageFiles.length})...`);
      images = await uploadCarImages(imageFiles);
      setUploadingLabel(null);
    }

    const result = await addCar({
      title: formData.title,
      description: formData.description,
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year, 10),
      wilaya: formData.wilaya,
      fuel_type: formData.fuel_type,
      gearbox: formData.gearbox,
      mileage: parseInt(formData.mileage, 10) || 0,
      documents: formData.documents,
      price: parseInt(formData.price, 10) || 0,
      phone_number: formData.phone_number,
      images,
      is_featured: false,
      userId: user?.id || null,
    });
    setLoading(false);

    if (!result) {
      setError('تعذر نشر الإعلان، يرجى التحقق من البيانات والمحاولة مجدداً.');
      return;
    }

    alert('تهانينا! تم نشر إعلان سيارتك بنجاح.');
    router.push('/cars');
  };

  const inputClass =
    'w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-orange-200 bg-white text-gray-900';

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Header />
      <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-6 text-primary border-b pb-3">
          ➕ أضف إعلان سيارة جديد
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!user && (
          <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs text-orange-700">
            💡 لست مسجلاً الدخول — يمكنك نشر الإعلان كزائر، لكن لن يظهر في صفحة "حسابي" لاحقاً.{' '}
            <Link href="/login" className="font-bold underline">سجّل الدخول</Link> لإدارة إعلاناتك بسهولة.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">عنوان الإعلان *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="مثال: سيارة رونو كليو 4 للبيع في حالة ممتازة"
              className={inputClass}
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">الماركة *</label>
              <select name="brand" required className={inputClass} value={formData.brand} onChange={handleChange}>
                <option value="">اختر الماركة</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">الموديل *</label>
              <input type="text" name="model" required placeholder="Clio" className={inputClass} value={formData.model} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">سنة الصنع *</label>
              <input type="number" name="year" required value={formData.year} className={inputClass} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">الولاية *</label>
              <select name="wilaya" className={inputClass} value={formData.wilaya} onChange={handleChange}>
                {WILAYAT.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">رقم الهاتف *</label>
              <input type="tel" name="phone_number" required placeholder="0612345678" className={inputClass} value={formData.phone_number} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">نوع الوقود *</label>
              <select name="fuel_type" className={inputClass} value={formData.fuel_type} onChange={handleChange}>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">ناقل الحركة *</label>
              <select name="gearbox" className={inputClass} value={formData.gearbox} onChange={handleChange}>
                {GEARBOX_TYPES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">الوثائق *</label>
              <select name="documents" className={inputClass} value={formData.documents} onChange={handleChange}>
                {DOCUMENTS_STATUS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">المسافة المقطوعة (كم) *</label>
              <input type="number" name="mileage" required placeholder="45000" className={inputClass} value={formData.mileage} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">السعر (دج) *</label>
              <input type="number" name="price" required placeholder="2500000" className={inputClass} value={formData.price} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              صور السيارة (حتى {MAX_IMAGES} صور)
            </label>
            <label
              htmlFor="car-images-input"
              className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-slate-50 p-5 text-center text-sm text-gray-500 hover:border-accent hover:text-accent transition"
            >
              <span className="text-2xl">📷</span>
              <span className="font-semibold">اضغط لإضافة صور</span>
              <span className="text-xs text-gray-400">JPG أو PNG — {imageFiles.length}/{MAX_IMAGES} مضافة</span>
            </label>
            <input
              id="car-images-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImagesChange}
              disabled={imageFiles.length >= MAX_IMAGES}
            />

            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {imagePreviews.map((src, i) => (
                  <div key={src} className="relative group">
                    <img
                      src={src}
                      alt={`صورة ${i + 1}`}
                      className="h-20 w-full rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -left-1.5 h-5 w-5 rounded-full bg-red-600 text-white text-xs font-bold leading-5 shadow"
                      aria-label="حذف الصورة"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">وصف تفصيلي للسيارة</label>
            <textarea
              name="description"
              rows="3"
              placeholder="اكتب هنا تفاصيل الحوادث، حالة الطلاء، أو أي معلومات إضافية..."
              className={inputClass}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-orange-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition duration-300 text-base shadow"
          >
            {loading ? (uploadingLabel || 'جاري النشر...') : '🚀 نشر الإعلان الآن'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
