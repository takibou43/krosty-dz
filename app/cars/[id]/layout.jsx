import { createClient } from '@supabase/supabase-js';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://krosty-dz.vercel.app';

// بيانات وصفية لكل إعلان — مهمة لجوجل وللمشاركة على وسائل التواصل
export async function generateMetadata({ params }) {
  const fallback = {
    title: 'إعلان سيارة - كروستي DZ',
    description: 'تصفّح إعلانات السيارات في الجزائر على كروستي DZ',
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key || !params?.id) return fallback;

  try {
    const client = createClient(url, key, { auth: { persistSession: false } });
    const { data: car } = await client
      .from('cars')
      .select('title, brand, model, year, price, wilaya, description, images')
      .eq('id', params.id)
      .single();

    if (!car) return fallback;

    const price = Number(car.price || 0).toLocaleString('en-US');
    const title = `${car.title} — ${price} دج | كروستي DZ`;
    const description =
      (car.description && String(car.description).trim().slice(0, 155)) ||
      `${car.brand || ''} ${car.model || ''} ${car.year || ''} للبيع في ${car.wilaya || 'الجزائر'} بسعر ${price} دج.`;
    const image = Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : null;

    return {
      title,
      description,
      alternates: { canonical: `${SITE}/cars/${params.id}` },
      openGraph: {
        title,
        description,
        url: `${SITE}/cars/${params.id}`,
        type: 'article',
        locale: 'ar_DZ',
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: image ? 'summary_large_image' : 'summary',
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return fallback;
  }
}

export default function CarLayout({ children }) {
  return children;
}
