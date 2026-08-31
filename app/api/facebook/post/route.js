import { createClient } from '@supabase/supabase-js';

// النشر التلقائي على صفحة فيسبوك
// يعمل على الخادم فقط — مفتاح الصفحة لا يصل إلى المتصفح أبداً

const GRAPH = 'https://graph.facebook.com/v21.0';

const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const PAGE_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://krosty-dz.vercel.app';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

/* ───────── نص المنشور ───────── */

function fmt(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v.toLocaleString('en-US') : null;
}

// النص الافتراضي — سريع، مجاني، ولا يفشل أبداً
function buildCaption(car) {
  const lines = [];
  lines.push(`🚗 ${car.title}`);
  lines.push('');

  const price = fmt(car.price);
  if (price) lines.push(`💰 السعر: ${price} دج`);

  const specs = [];
  if (car.brand) specs.push(`الماركة: ${car.brand}`);
  if (car.model) specs.push(`الموديل: ${car.model}`);
  if (car.year) specs.push(`السنة: ${car.year}`);
  const km = fmt(car.mileage);
  if (km) specs.push(`الممشى: ${km} كم`);
  if (car.fuel_type) specs.push(`الوقود: ${car.fuel_type}`);
  if (car.gearbox) specs.push(`ناقل الحركة: ${car.gearbox}`);
  if (car.documents) specs.push(`الوثائق: ${car.documents}`);
  if (specs.length) lines.push(specs.join(' • '));

  if (car.wilaya) lines.push(`📍 ${car.wilaya}`);

  if (car.description) {
    const d = String(car.description).trim().slice(0, 300);
    if (d) {
      lines.push('');
      lines.push(d);
    }
  }

  lines.push('');
  lines.push(`🔗 تفاصيل الإعلان: ${SITE_URL}/cars/${car.id}`);
  lines.push('');
  lines.push('#سيارات #الجزائر #بيع_سيارات #كروستي #CrostyDZ');

  return lines.join('\n');
}

// نص مُحسَّن بالذكاء الاصطناعي — اختياري، ويرجع للنص الافتراضي عند أي خلل
async function buildCaptionAI(car) {
  if (!ANTHROPIC_KEY) return null;
  try {
    const facts = buildCaption(car);
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 400,
        messages: [
          {
            role: 'user',
            content:
              'أعد صياغة إعلان السيارة التالي كمنشور فيسبوك جذّاب بالعربية الجزائرية المفهومة.\n' +
              'قواعد صارمة: لا تخترع أي معلومة غير موجودة، احتفظ بالسعر والرابط والوسوم كما هي حرفياً، ' +
              'اجعله قصيراً (أقل من 100 كلمة)، وأرجع نص المنشور فقط دون أي تعليق.\n\n' +
              facts,
          },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const text = json?.content?.[0]?.text?.trim();
    // تحقّق أن الرابط ما زال موجوداً، وإلا نستخدم النص الافتراضي
    if (!text || !text.includes(`/cars/${car.id}`)) return null;
    return text;
  } catch {
    return null;
  }
}

/* ───────── تحديد رمز الصفحة ───────── */

// المفتاح المحفوظ قد يكون رمز مستخدم أو رمز صفحة.
// النشر على صفحة يتطلب رمز صفحة، لذلك نستخرجه هنا تلقائياً:
// - إن كان المحفوظ رمز مستخدم، نطلب me/accounts ونأخذ رمز الصفحة المطابق للرقم.
// - إن كان رمز صفحة أصلاً، لا يُرجع me/accounts شيئاً مطابقاً فنستعمله كما هو.
// ميزة إضافية: رمز الصفحة المستخرج من رمز مستخدم طويل الأمد لا ينتهي أبداً.
let cachedPageToken = null;

async function resolvePageToken() {
  if (cachedPageToken) return cachedPageToken;

  try {
    const res = await fetch(
      `${GRAPH}/me/accounts?limit=100&fields=id,access_token&access_token=${encodeURIComponent(PAGE_TOKEN)}`
    );
    const json = await res.json();
    const match =
      Array.isArray(json?.data) && json.data.find((p) => String(p?.id) === String(PAGE_ID));

    if (match?.access_token) {
      console.log('[facebook] تم استخراج رمز الصفحة من رمز المستخدم');
      cachedPageToken = match.access_token;
      return cachedPageToken;
    }
  } catch (err) {
    console.error('[facebook] تعذّر استخراج رمز الصفحة:', err?.message);
  }

  // رمز صفحة أصلاً، أو تعذّر الاستخراج — نستعمل المحفوظ كما هو
  cachedPageToken = PAGE_TOKEN;
  return cachedPageToken;
}

/* ───────── النشر على فيسبوك ───────── */

async function uploadUnpublishedPhoto(imageUrl) {
  const token = await resolvePageToken();
  const res = await fetch(`${GRAPH}/${PAGE_ID}/photos`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ url: imageUrl, published: false, access_token: token }),
  });
  const json = await res.json();
  if (!res.ok || !json?.id) throw new Error(json?.error?.message || 'فشل رفع الصورة');
  return json.id;
}

// منشور نصي مع رابط الإعلان — يعمل دائماً ولا يحتاج صوراً
async function postTextWithLink(car, message) {
  const token = await resolvePageToken();
  const res = await fetch(`${GRAPH}/${PAGE_ID}/feed`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      message,
      link: `${SITE_URL}/cars/${car.id}`,
      access_token: token,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || 'فشل النشر');
  return json.id;
}

async function publish(car, message) {
  const images = Array.isArray(car.images) ? car.images.filter(Boolean).slice(0, 10) : [];

  // بلا صور: منشور نصي مع رابط الإعلان
  if (images.length === 0) return postTextWithLink(car, message);

  // صورة واحدة: منشور صورة مباشر — وعند الفشل نكتفي بمنشور نصي
  if (images.length === 1) {
    try {
      const token = await resolvePageToken();
      const res = await fetch(`${GRAPH}/${PAGE_ID}/photos`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: images[0], caption: message, access_token: token }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || 'فشل نشر الصورة');
      return json.post_id || json.id;
    } catch (err) {
      console.error('[facebook] تعذّر نشر الصورة، سنكتفي بمنشور نصي:', err?.message);
      return postTextWithLink(car, message);
    }
  }

  // عدة صور: ارفعها غير منشورة ثم اجمعها في منشور واحد
  const mediaIds = [];
  const failures = [];
  for (const url of images) {
    try {
      mediaIds.push(await uploadUnpublishedPhoto(url));
    } catch (err) {
      // تجاهل الصورة التي فشلت وواصل بالبقية — مع تسجيل السبب الحقيقي
      failures.push(err?.message || 'سبب غير معروف');
    }
  }

  if (failures.length) {
    console.error('[facebook] صور فشل رفعها:', failures.join(' | '));
  }

  // لم تُرفع أي صورة: لا نُسقط المنشور، ننشره نصاً مع الرابط
  if (mediaIds.length === 0) {
    console.error('[facebook] تعذّر رفع كل الصور — سنكتفي بمنشور نصي مع الرابط');
    return postTextWithLink(car, message);
  }

  const token = await resolvePageToken();
  const res = await fetch(`${GRAPH}/${PAGE_ID}/feed`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      message,
      attached_media: mediaIds.map((id) => ({ media_fbid: id })),
      access_token: token,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || 'فشل النشر');
  return json.id;
}

/* ───────── المعالج ───────── */

export async function POST(request) {
  // الربط غير مُفعَّل بعد — ليس خطأ، الإعلان نُشر على الموقع بنجاح
  if (!PAGE_ID || !PAGE_TOKEN) {
    return Response.json({ ok: false, skipped: 'facebook_not_configured' }, { status: 200 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 });
  }

  let carId, accessToken;
  try {
    const body = await request.json();
    carId = body?.carId;
    accessToken = body?.accessToken;
  } catch {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  if (!carId || !accessToken) {
    return Response.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }

  // تحقّق من هوية المستخدم عبر رمز الجلسة — يمنع أي شخص من إساءة استخدام الصفحة
  const client = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser(accessToken);

  if (authError || !user) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const { data: car, error: carError } = await client
    .from('cars')
    .select('*')
    .eq('id', carId)
    .single();

  if (carError || !car) {
    return Response.json({ ok: false, error: 'car_not_found' }, { status: 404 });
  }

  // لا يُنشر إلا إعلان يملكه صاحب الطلب
  if (car.user_id !== user.id) {
    return Response.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  try {
    const message = (await buildCaptionAI(car)) || buildCaption(car);
    const postId = await publish(car, message);
    return Response.json({ ok: true, postId }, { status: 200 });
  } catch (err) {
    // فشل فيسبوك لا يعني فشل الإعلان — نسجّله ونرجع بهدوء
    console.error('[facebook] فشل النشر:', err?.message);
    return Response.json(
      { ok: false, error: 'facebook_post_failed', detail: err?.message || null },
      { status: 200 }
    );
  }
}
