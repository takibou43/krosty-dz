'use client';

import { useState } from 'react';
import Icon from './Icon';
import { uploadCarImages } from '@/utils/supabase';
import { WILAYAT, BRANDS, FUEL_TYPES, GEARBOX_TYPES, DOCUMENTS_STATUS } from '@/utils/constants';
import { getModelsForBrand } from '@/utils/carModels';
import { CATEGORIES, DEFAULT_CATEGORY } from '@/utils/categories';

export const MAX_IMAGES = 8;

export const emptyCarForm = {
  category: DEFAULT_CATEGORY,
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

/**
 * نموذج السيارة المشترك بين صفحة الإضافة وصفحة التعديل.
 * onSubmit يستقبل بيانات نظيفة جاهزة للحفظ ويعيد رسالة خطأ نصية عند الفشل.
 */
export default function CarForm({
  initialData = emptyCarForm,
  existingImages = [],
  submitLabel = 'نشر الإعلان',
  pendingLabel = 'جاري النشر...',
  note = null,
  onSubmit,
}) {
  const [formData, setFormData] = useState({ ...emptyCarForm, ...initialData });
  const [keptImages, setKeptImages] = useState(existingImages);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLabel, setStatusLabel] = useState(null);
  const [error, setError] = useState(null);

  const models = getModelsForBrand(formData.brand);
  const totalImages = keptImages.length + imageFiles.length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // تغيير الماركة يُصفّر الموديل لأن القائمة تعتمد عليها
    setFormData((prev) =>
      name === 'brand' ? { ...prev, brand: value, model: '' } : { ...prev, [name]: value }
    );
  };

  const handleImagesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    const room = Math.max(0, MAX_IMAGES - keptImages.length);
    const combined = [...imageFiles, ...selected].slice(0, room);
    setImageFiles(combined);
    setImagePreviews(combined.map((f) => URL.createObjectURL(f)));
    e.target.value = '';
  };

  const removeNewImage = (index) => {
    const updated = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updated);
    setImagePreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const removeExistingImage = (url) => {
    setKeptImages((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let uploaded = [];
    if (imageFiles.length > 0) {
      setStatusLabel(`جاري رفع الصور (${imageFiles.length})...`);
      uploaded = await uploadCarImages(imageFiles);
      setStatusLabel(null);
    }

    const payload = {
      category: formData.category,
      title: formData.title.trim(),
      description: formData.description.trim(),
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year, 10),
      wilaya: formData.wilaya,
      fuel_type: formData.fuel_type,
      gearbox: formData.gearbox,
      mileage: parseInt(formData.mileage, 10) || 0,
      documents: formData.documents,
      price: parseInt(formData.price, 10) || 0,
      phone_number: formData.phone_number.trim(),
      images: [...keptImages, ...uploaded],
    };

    const message = await onSubmit(payload, { setStatusLabel });
    setLoading(false);
    setStatusLabel(null);
    if (message) setError(message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3.5 py-3 text-xs text-red-800">
          <Icon name="info" className="mt-px h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {note}

      <Section title="معلومات أساسية">
        <Field label="القسم" required>
          <select
            name="category"
            required
            className={inputClass}
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="عنوان الإعلان" required>
          <input
            type="text"
            name="title"
            required
            maxLength={120}
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

          <Field label="الموديل" required hint={!formData.brand ? 'اختر الماركة أولاً' : undefined}>
            <select
              name="model"
              required
              disabled={!formData.brand}
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
              value={formData.model}
              onChange={handleChange}
            >
              <option value="">{formData.brand ? 'اختر الموديل' : '—'}</option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <Field label="سنة الصنع" required>
            <input
              type="number"
              name="year"
              required
              min="1950"
              max={new Date().getFullYear() + 1}
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
            <select name="fuel_type" className={inputClass} value={formData.fuel_type} onChange={handleChange}>
              {FUEL_TYPES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>

          <Field label="ناقل الحركة" required>
            <select name="gearbox" className={inputClass} value={formData.gearbox} onChange={handleChange}>
              {GEARBOX_TYPES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>

          <Field label="الوثائق" required>
            <select name="documents" className={inputClass} value={formData.documents} onChange={handleChange}>
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
              min="0"
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
              min="0"
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
              JPG أو PNG — {totalImages}/{MAX_IMAGES} مضافة
            </span>
          </label>
          <input
            id="car-images-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImagesChange}
            disabled={totalImages >= MAX_IMAGES}
          />

          {(keptImages.length > 0 || imagePreviews.length > 0) && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {keptImages.map((url) => (
                <div key={url} className="group relative">
                  <img src={url} alt="" className="h-20 w-full rounded-md border border-line object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    aria-label="حذف الصورة"
                    className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white shadow transition hover:bg-accent"
                  >
                    <Icon name="close" className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                </div>
              ))}

              {imagePreviews.map((src, i) => (
                <div key={src} className="group relative">
                  <img src={src} alt="" className="h-20 w-full rounded-md border border-line object-cover" />
                  <span className="absolute bottom-1 right-1 rounded bg-emerald-600 px-1 text-[9px] font-semibold text-white">
                    جديدة
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
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
            <select name="wilaya" className={inputClass} value={formData.wilaya} onChange={handleChange}>
              {WILAYAT.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </Field>

          <Field label="رقم الهاتف" required hint="مثال: 0612345678">
            <input
              type="tel"
              name="phone_number"
              required
              pattern="0[567][0-9]{8}"
              title="رقم جزائري صحيح يبدأ بـ 05 أو 06 أو 07"
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
            maxLength={2000}
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
          {loading ? statusLabel || pendingLabel : submitLabel}
        </button>
        <p className="text-2xs text-muted">بالنشر أنت تؤكد أن المعلومات المقدَّمة صحيحة.</p>
      </div>
    </form>
  );
}
