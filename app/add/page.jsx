'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import { addCar, isSupabaseConfigured, uploadCarImages } from '@/utils/supabase';
import { WILAYAT, BRANDS, FUEL_TYPES, GEARBOX_TYPES, DOCUMENTS_STATUS } from '@/utils/constants';
import { useAuth } from '@/utils/useAuth';

const MAX_IMAGES = 8;

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

const inputClass =
  'w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-accent focus:outline-none';

function Field({ label, required, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-2xs font-medium uppercase tracking-wide text-muted">
        {label}
        {required && <span className="mr-0.5 text-accent">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-2xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-card border border-line bg-white shadow-card">
      <div className="border-b border-line px-5 py-3.5">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
      </div>
      <div className="space-y-4 px-5 py-5">{children}</div>
    </section>
  );
}

export default function AddCarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [uploadingLabel, setUploadingLabel] = useState(null);
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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

    router.push('/cars');
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <PageHeader
        icon="plus"
        title="أضف إعلان سيارة"
        subtitle="النشر مجاني — املأ البيانات التالية لعرض سيارتك"
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3.5 py-3 text-xs text-red-800">
            <Icon name="info" className="mt-px h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!user && (
          <div className="mb-4 flex items-start gap-2 rounded-md border border-line bg-white px-3.5 py-3 text-xs text-slate-600">
            <Icon name="info" className="mt-px h-4 w-4 shrink-0 text-slate-400" />
            <span>
              أنت غير مسجّل الدخول — يمكنك النشر كزائر، لكن الإعلان لن يظهر في صفحة «حسابي».{' '}
              <Link href="/login" className="font-semibold text-accent hover:underline">
                سجّل الدخول
              </Link>{' '}
              لإدارة إعلاناتك.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Section title="معلومات أساسية">
            <Field label="عنوان الإعلان" required>
              <input
                type="text"
                name="title"
                required
                placeholder="مثال: رونو كليو 4 في حالة ممتازة"
                className={inputClass}
                value={formData.title}
                onChange={handleChange}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="الماركة" required>
                <select
                  name="brand"
                  required
                  className={inputClass}
                  value={formData.brand}
                  onChange={handleChange}
                >
                  <option value="">اختر الماركة</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="الموديل" required>
                <input
                  type="text"
                  name="model"
                  required
                  placeholder="Clio"
                  className={inputClass}
                  value={formData.model}
                  onChange={handleChange}
                />
              </Field>

              <Field label="سنة الصنع" required>
                <input
                  type="number"
                  name="year"
                  required
                  value={formData.year}
                  className={`${inputClass} nums`}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </Section>

          <Section title="المواصفات التقنية">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="نوع الوقود" required>
                <select
                  name="fuel_type"
                  className={inputClass}
                  value={formData.fuel_type}
                  onChange={handleChange}
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="ناقل الحركة" required>
                <select
                  name="gearbox"
                  className={inputClass}
                  value={formData.gearbox}
                  onChange={handleChange}
                >
                  {GEARBOX_TYPES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="الوثائق" required>
                <select
                  name="documents"
                  className={inputClass}
                  value={formData.documents}
                  onChange={handleChange}
                >
                  {DOCUMENTS_STATUS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="المسافة المقطوعة (كم)" required>
                <input
                  type="number"
                  name="mileage"
                  required
                  placeholder="45000"
                  className={`${inputClass} nums`}
                  value={formData.mileage}
                  onChange={handleChange}
                />
              </Field>

              <Field label="السعر (دج)" required>
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="2500000"
                  className={`${inputClass} nums`}
                  value={formData.price}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </Section>

          <Section title="الصور">
            <div>
              <label
                htmlFor="car-images-input"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line bg-slate-50/60 px-4 py-8 text-center transition hover:border-accent hover:bg-slate-50"
              >
                <Icon name="camera" className="h-7 w-7 text-slate-300" strokeWidth={1.4} />
                <span className="text-sm font-medium text-ink">اضغط لإضافة صور</span>
                <span className="text-2xs text-muted nums">
                  JPG أو PNG — {imageFiles.length}/{MAX_IMAGES} مضافة
                </span>
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
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {imagePreviews.map((src, i) => (
                    <div key={src} className="group relative">
                      <img
                        src={src}
                        alt={`صورة ${i + 1}`}
                        className="h-20 w-full rounded-md border border-line object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        aria-label="حذف الصورة"
                        className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white shadow transition hover:bg-accent"
                      >
                        <Icon name="close" className="h-3 w-3" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          <Section title="التواصل والوصف">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="الولاية" required>
                <select
                  name="wilaya"
                  className={inputClass}
                  value={formData.wilaya}
                  onChange={handleChange}
                >
                  {WILAYAT.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="رقم الهاتف" required>
                <input
                  type="tel"
                  name="phone_number"
                  required
                  placeholder="0612345678"
                  className={`${inputClass} nums`}
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <Field label="وصف تفصيلي" hint="اذكر حالة السيارة، الصيانة، أو أي تفاصيل تهم المشتري">
              <textarea
                name="description"
                rows="4"
                placeholder="اكتب هنا تفاصيل الحوادث، حالة الطلاء، أو أي معلومات إضافية..."
                className={`${inputClass} resize-y`}
                value={formData.description}
                onChange={handleChange}
              />
            </Field>
          </Section>

          <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-accent px-8 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
            >
              {loading ? uploadingLabel || 'جاري النشر...' : 'نشر الإعلان'}
            </button>
            <p className="text-2xs text-muted">
              بالنشر أنت تؤكد أن المعلومات المقدَّمة صحيحة.
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
