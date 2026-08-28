# كروستي DZ 🚗
منصة إعلانات مبوبة متخصصة في بيع وشراء السيارات في الجزائر

## النشر على Vercel

### 1. ارفع الكود على GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/krosty-dz.git
git push -u origin main
```

### 2. انشر على Vercel
1. افتح [vercel.com](https://vercel.com) وسجل دخول بـ GitHub
2. اضغط "Add New Project" واختر المستودع
3. أضف متغيرات البيئة (اختياري - مطلوب لقاعدة البيانات):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. اضغط Deploy ✅

### 3. إعداد Supabase (اختياري)
1. افتح [supabase.com](https://supabase.com) وأنشئ مشروعاً مجانياً
2. شغّل SQL من ملف `supabase_cars_table.sql`
3. أضف الـ URL والـ Key في إعدادات Vercel

## التشغيل المحلي
```bash
npm install
npm run dev
```
ثم افتح http://localhost:3000

## التقنيات المستخدمة
- **Next.js 14** - إطار عمل React
- **Tailwind CSS** - تنسيق
- **Supabase** - قاعدة البيانات (اختياري)
