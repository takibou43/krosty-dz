import { createClient } from '@supabase/supabase-js';
import { CATEGORIES } from '@/utils/categories';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://krosty-dz.vercel.app';

// يُعاد توليدها كل ساعة
export const revalidate = 3600;

export default async function sitemap() {
  const staticPages = ['', '/cars', '/about', '/contact'].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/cars' ? 'hourly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  const categoryPages = CATEGORIES.map((c) => ({
    url: `${SITE}/cars?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // إعلانات سارية فقط
  let carPages = [];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (url && key) {
    try {
      const client = createClient(url, key, { auth: { persistSession: false } });
      const { data } = await client
        .from('cars')
        .select('id, created_at')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(5000);
      carPages = (data || []).map((car) => ({
        url: `${SITE}/cars/${car.id}`,
        lastModified: car.created_at ? new Date(car.created_at) : new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      }));
    } catch {
      // تعذّر جلب الإعلانات — نُرجع الصفحات الثابتة على الأقل
    }
  }

  return [...staticPages, ...categoryPages, ...carPages];
}
