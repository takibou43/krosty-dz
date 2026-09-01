// ضغط الصور في المتصفح قبل رفعها
// صورة هاتف حديثة تصل إلى 4 ميغابايت؛ بعد الضغط تنزل إلى بضع مئات من الكيلوبايت
// دون فرق مرئي في إعلان سيارة. هذا يوفّر بيانات المشتري ومساحة التخزين معاً.

const MAX_DIMENSION = 1600; // الضلع الأطول
const QUALITY = 0.8;
const SKIP_UNDER_BYTES = 300 * 1024; // أصغر من هذا لا يستحق العناء

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('تعذّر قراءة الصورة'));
    };
    img.src = url;
  });
}

// يُرجع ملفاً مضغوطاً، أو الملف الأصلي إن تعذّر الضغط لأي سبب.
// لا يرمي استثناءً أبداً: فشل الضغط يجب ألا يمنع نشر الإعلان.
export async function compressImage(file) {
  try {
    if (!file || !file.type?.startsWith('image/')) return file;
    // الصيغ المتحركة أو المتجهة تفقد معناها بالتحويل
    if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;
    if (file.size <= SKIP_UNDER_BYTES) return file;

    const img = await loadImage(file);
    const { width, height } = img;
    if (!width || !height) return file;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALITY)
    );
    if (!blob) return file;

    // إن كان الناتج أكبر من الأصل (يحدث مع صور صغيرة أصلاً) نُبقي الأصل
    if (blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  }
}

export async function compressImages(files) {
  const list = Array.from(files || []);
  const out = [];
  for (const f of list) {
    out.push(await compressImage(f));
  }
  return out;
}
