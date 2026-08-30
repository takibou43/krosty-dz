// utils/categories.js — أقسام الإعلانات

export const CATEGORIES = [
  { slug: 'cars', label: 'سيارات', icon: 'car' },
  { slug: 'utility', label: 'السيارات النفعية', icon: 'van' },
  { slug: 'motorcycles', label: 'دراجات نارية وسكوترات', icon: 'motorcycle' },
  { slug: 'quad', label: 'دراجة نارية رباعية - كواد', icon: 'quad' },
  { slug: 'van', label: 'عربة نقل', icon: 'van' },
  { slug: 'truck', label: 'شاحنة', icon: 'truck' },
  { slug: 'bus', label: 'حافلة', icon: 'bus' },
  { slug: 'machinery', label: 'آلة', icon: 'machinery' },
  { slug: 'tractor', label: 'جرار', icon: 'tractor' },
  { slug: 'trailer', label: 'مقطورة', icon: 'trailer' },
];

export const DEFAULT_CATEGORY = 'cars';

export function categoryLabel(slug) {
  return CATEGORIES.find((c) => c.slug === slug)?.label || 'سيارات';
}
