import { supabase, isSupabaseConfigured } from './supabase';

// يطلب من الخادم نشر الإعلان على صفحة فيسبوك.
// لا يرمي أي استثناء أبداً: فشل فيسبوك يجب ألا يمنع نشر الإعلان على الموقع.
export async function publishCarToFacebook(carId) {
  if (!carId || !isSupabaseConfigured || !supabase) return { ok: false };

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const accessToken = session?.access_token;
    if (!accessToken) return { ok: false };

    const res = await fetch('/api/facebook/post', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ carId, accessToken }),
    });

    return await res.json();
  } catch {
    return { ok: false };
  }
}
