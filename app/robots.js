const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://krosty-dz.vercel.app';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // صفحات خاصة بالمستخدم لا فائدة من أرشفتها
        disallow: ['/account', '/add', '/login', '/signup', '/reset-password', '/update-password', '/api/'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
