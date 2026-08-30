import './globals.css';

export const metadata = {
  title: 'كروستي DZ - موقع بيع السيارات في الجزائر',
  description: 'منصة إعلانات مبوبة متخصصة في بيع وشراء السيارات الجديدة والمستعملة في الجزائر',
  metadataBase: new URL('https://krostydz.com'),
};

export const viewport = {
  themeColor: '#1c1c1c',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-canvas text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
