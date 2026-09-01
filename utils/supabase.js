import { createClient } from '@supabase/supabase-js';
import { compressImages } from './image';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function getClient() {
  if (!isSupabaseConfigured || !supabase) return null;
  return supabase;
}

// أقصى عدد إعلانات نشطة لكل مستخدم — حماية من الإغراق
export const MAX_ACTIVE_ADS = 20;

// مدة عرض الإعلان قبل أن يُخفى تلقائياً
export const AD_DURATION_DAYS = 7;
// بعد الانتهاء يبقى الإعلان في «حسابي» هذه المدة ثم يُحذف نهائياً
export const AD_GRACE_DAYS = 30;

function expiryFromNow(days = AD_DURATION_DAYS) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

// هل انتهى الإعلان؟
export function isExpired(car) {
  if (!car?.expires_at) return false;
  return new Date(car.expires_at).getTime() <= Date.now();
}

// كم بقي من الوقت (نص عربي مختصر) — يرجع null إن كان منتهياً
export function timeLeft(car) {
  if (!car?.expires_at) return null;
  const ms = new Date(car.expires_at).getTime() - Date.now();
  if (ms <= 0) return null;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 1) return 'أقل من ساعة';
  if (hours < 24) return `${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'يوم' : 'أيام'}`;
}

export async function getCars(filters = {}) {
  const client = getClient();
  if (!client) return [];
  try {
    let query = client.from('cars').select('*');
    // إخفاء الإعلانات المنتهية من كل قوائم التصفح
    query = query.gt('expires_at', new Date().toISOString());
    if (filters.wilaya) query = query.eq('wilaya', filters.wilaya);
    if (filters.brand) query = query.eq('brand', filters.brand);
    if (filters.model) query = query.eq('model', filters.model);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.keyword) {
      const k = String(filters.keyword).replace(/[%,()]/g, ' ').trim();
      if (k) {
        query = query.or(
          `title.ilike.%${k}%,brand.ilike.%${k}%,model.ilike.%${k}%,description.ilike.%${k}%`
        );
      }
    }
    if (filters.fuelType) query = query.eq('fuel_type', filters.fuelType);
    if (filters.gearbox) query = query.eq('gearbox', filters.gearbox);
    if (filters.minPrice) query = query.gte('price', parseInt(filters.minPrice));
    if (filters.maxPrice) query = query.lte('price', parseInt(filters.maxPrice));
    query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) return [];
    return data || [];
  } catch { return []; }
}

export async function getMyCars(userId) {
  const client = getClient();
  if (!client || !userId) return [];
  try {
    const { data, error } = await client
      .from('cars')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

// يستخرج مسار الملف داخل bucket من رابطه العام
function storagePathFromUrl(url) {
  const marker = '/storage/v1/object/public/car-images/';
  const i = String(url).indexOf(marker);
  return i === -1 ? null : decodeURIComponent(String(url).slice(i + marker.length));
}

// يحذف صور الإعلان من التخزين حتى لا تتراكم ملفات يتيمة
export async function deleteCarImages(images) {
  const client = getClient();
  if (!client || !Array.isArray(images) || images.length === 0) return;
  const paths = images.map(storagePathFromUrl).filter(Boolean);
  if (paths.length === 0) return;
  try {
    await client.storage.from('car-images').remove(paths);
  } catch {
    // فشل حذف الصور لا يمنع حذف الإعلان
  }
}

export async function deleteCar(id) {
  const client = getClient();
  if (!client || !id) return false;
  try {
    // اجلب الصور أولاً لحذفها من التخزين
    const { data: car } = await client.from('cars').select('images').eq('id', id).single();
    const { error } = await client.from('cars').delete().eq('id', id);
    if (error) return false;
    await deleteCarImages(car?.images);
    return true;
  } catch { return false; }
}

// تعديل الإعلان — يحذف الصور التي أزالها صاحبه
export async function updateCar(id, carData) {
  const client = getClient();
  if (!client || !id) return null;
  try {
    const { data: before } = await client.from('cars').select('images').eq('id', id).single();

    const { data, error } = await client
      .from('cars')
      .update(carData)
      .eq('id', id)
      .select();
    if (error) return null;

    const kept = new Set(Array.isArray(carData.images) ? carData.images : []);
    const removed = (before?.images || []).filter((u) => !kept.has(u));
    await deleteCarImages(removed);

    return data?.[0] || null;
  } catch { return null; }
}

// عدد الإعلانات النشطة لمستخدم
export async function countActiveCars(userId) {
  const client = getClient();
  if (!client || !userId) return 0;
  try {
    const { count, error } = await client
      .from('cars')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString());
    if (error) return 0;
    return count || 0;
  } catch { return 0; }
}

// تجديد الإعلان: يمدّد تاريخ الانتهاء من الآن
export async function renewCar(id) {
  const client = getClient();
  if (!client || !id) return null;
  try {
    const { data, error } = await client
      .from('cars')
      .update({ expires_at: expiryFromNow() })
      .eq('id', id)
      .select();
    if (error) return null;
    return data?.[0] || null;
  } catch { return null; }
}

export async function getCarsByIds(ids) {
  const client = getClient();
  if (!client || !Array.isArray(ids) || ids.length === 0) return [];
  try {
    const { data, error } = await client.from('cars').select('*').in('id', ids);
    if (error) return [];
    return data || [];
  } catch { return []; }
}

export async function getCarById(id) {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from('cars').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  } catch { return null; }
}

// زيادة عدّاد المشاهدات — عبر دالة في قاعدة البيانات
// لأن سياسات RLS تسمح للمالك وحده بالتعديل، والزائر ليس المالك.
// لا يفشل أبداً بصورة مرئية: عدّاد لا يستحق تعطيل الصفحة.
export async function incrementCarViews(id) {
  const client = getClient();
  if (!client || !id) return;
  try {
    await client.rpc('increment_car_views', { car_id: id });
  } catch {
    // تجاهل
  }
}

// البلاغات المفتوحة — للمشرف وحده.
// سياسات RLS هي التي تفرض الصلاحية: غير المشرف يحصل على خطأ،
// ونُرجع null لتمييز «ممنوع» عن «لا توجد بلاغات».
export async function getOpenReports() {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('reports')
      .select('*')
      .eq('resolved', false)
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) return null;
    return data || [];
  } catch { return null; }
}

export async function resolveReport(id) {
  const client = getClient();
  if (!client || !id) return false;
  try {
    const { error } = await client.from('reports').update({ resolved: true }).eq('id', id);
    return !error;
  } catch { return false; }
}

// تسجيل بلاغ عن إعلان مخالف
export async function reportCar({ carId, reason, details, reporterId }) {
  const client = getClient();
  if (!client || !carId || !reason) return false;
  try {
    const { error } = await client.from('reports').insert([
      {
        car_id: carId,
        reason,
        details: details || null,
        reporter_id: reporterId || null,
      },
    ]);
    return !error;
  } catch { return false; }
}

export async function uploadCarImages(files) {
  const client = getClient();
  if (!client || !files || files.length === 0) return [];
  // الضغط قبل الرفع — يقلّل حجم الإعلان إلى عُشره تقريباً
  const prepared = await compressImages(files);
  const urls = [];
  for (const file of prepared) {
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await client.storage.from('car-images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) continue;
      const { data } = client.storage.from('car-images').getPublicUrl(path);
      if (data?.publicUrl) urls.push(data.publicUrl);
    } catch {
      // تجاهل الصورة التي فشل رفعها والمتابعة مع البقية
    }
  }
  return urls;
}

export async function addCar(carData) {
  const client = getClient();
  if (!client) return null;
  try {
    const { userId, ...rest } = carData;
    const { data, error } = await client
      .from('cars')
      .insert([{ ...rest, user_id: userId, expires_at: expiryFromNow() }])
      .select();
    if (error) return null;
    return data?.[0] || null;
  } catch { return null; }
}

export async function getSimilarCars(car, limit = 4) {
  const client = getClient();
  if (!client || !car) return [];
  try {
    const nowIso = new Date().toISOString();
    let query = client.from('cars').select('*').neq('id', car.id).gt('expires_at', nowIso).limit(limit);
    if (car.brand) query = query.eq('brand', car.brand);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      // إن لم توجد سيارات من نفس الماركة، جرّب نفس الولاية
      if (car.wilaya) {
        const fallback = await client
          .from('cars')
          .select('*')
          .neq('id', car.id)
          .gt('expires_at', nowIso)
          .eq('wilaya', car.wilaya)
          .order('created_at', { ascending: false })
          .limit(limit);
        return fallback.data || [];
      }
      return [];
    }
    return data;
  } catch { return []; }
}

export async function searchCars(keyword) {
  const client = getClient();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('cars').select('*')
      .gt('expires_at', new Date().toISOString())
      .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,brand.ilike.%${keyword}%,model.ilike.%${keyword}%`)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

export async function getFeaturedCars() {
  const client = getClient();
  if (!client) return [];
  try {
    const { data, error } = await client.from('cars').select('*').eq('is_featured', true).order('featured_until', { ascending: false });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

export async function signIn(email, password) {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return null;
    return data.user;
  } catch { return null; }
}

export async function signUp(email, password, userData = {}) {
  const client = getClient();
  if (!client) return null;
  try {
    const { data, error } = await client.auth.signUp({ email, password, options: { data: userData } });
    if (error) return null;
    return data.user;
  } catch { return null; }
}

// إرسال رابط استرجاع كلمة المرور إلى البريد
export async function requestPasswordReset(email) {
  const client = getClient();
  if (!client || !email) return false;
  try {
    const redirectTo =
      typeof window !== 'undefined' ? `${window.location.origin}/update-password` : undefined;
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
    return !error;
  } catch { return false; }
}

// تعيين كلمة مرور جديدة (بعد فتح الرابط من البريد)
export async function updatePassword(newPassword) {
  const client = getClient();
  if (!client || !newPassword) return false;
  try {
    const { error } = await client.auth.updateUser({ password: newPassword });
    return !error;
  } catch { return false; }
}

export async function signOut() {
  const client = getClient();
  if (!client) return false;
  try {
    const { error } = await client.auth.signOut();
    return !error;
  } catch { return false; }
}

export async function getCurrentUser() {
  const client = getClient();
  if (!client) return null;
  try {
    const { data: { user } } = await client.auth.getUser();
    return user || null;
  } catch { return null; }
}
