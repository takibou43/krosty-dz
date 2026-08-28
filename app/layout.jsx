import './globals.css';

export const metadata = {
  title: 'كروستي DZ - موقع بيع السيارات في الجزائر',
  description: 'منصة إعلانات مبوبة متخصصة في بيع وشراء السيارات الجديدة والمستعملة في الجزائر',
  metadataBase: new URL('https://krostydz.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
