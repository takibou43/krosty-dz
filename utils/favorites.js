// utils/favorites.js - إدارة السيارات المفضلة عبر localStorage (لا تتطلب تسجيل دخول)

const STORAGE_KEY = 'krosty_favorites';
const EVENT_NAME = 'krosty-favorites-changed';

function readRaw() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(ids) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {
    // تجاهل أخطاء التخزين (مثلاً وضع التصفح الخاص)
  }
}

export function getFavoriteIds() {
  return readRaw();
}

export function isFavorite(carId) {
  if (!carId) return false;
  return readRaw().includes(String(carId));
}

export function toggleFavorite(carId) {
  if (!carId) return false;
  const id = String(carId);
  const current = readRaw();
  const exists = current.includes(id);
  const next = exists ? current.filter((x) => x !== id) : [...current, id];
  writeRaw(next);
  return !exists;
}

export function removeFavorite(carId) {
  if (!carId) return;
  const id = String(carId);
  writeRaw(readRaw().filter((x) => x !== id));
}

export function getFavoritesCount() {
  return readRaw().length;
}

// الاشتراك في تغييرات المفضلة (لتحديث العداد في الهيدر مثلاً)
export function subscribeFavorites(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback(readRaw());
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
