// utils/seo.js - دوال تحسين SEO

export const generateCarMetaTags = (car) => {
  return {
    title: `${car.brand} ${car.model} ${car.year} | ${car.wilaya} - ${car.price.toLocaleString('ar-DZ')} DA | كروستي DZ`,
    description: `شراء ${car.brand} ${car.model} ${car.year} بحالة ${car.documents} في ${car.wilaya}. السعر: ${car.price.toLocaleString('ar-DZ')} DA، الممشى: ${car.mileage.toLocaleString('ar-DZ')} km، ${car.fuelType}. اعلان موثوق على منصة كروستي DZ الجزائرية.`,
    keywords: [
      `${car.brand} ${car.model}`,
      `سيارة ${car.brand}`,
      `${car.wilaya}`,
      `سيارة مستعملة`,
      `السعر ${car.price}`,
      car.fuelType,
      car.gearbox,
      'كروستي',
    ].join(', '),
    ogTitle: `${car.brand} ${car.model} ${car.year} - ${car.price.toLocaleString('ar-DZ')} DA`,
    ogDescription: car.description || `سيارة ${car.brand} ${car.model} بسعر رائع`,
    ogImage: car.images?.[0] || '/placeholder.jpg',
    twitterCard: 'summary_large_image',
  };
};

export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'كروستي DZ',
    alternateName: 'Carrosti DZ',
    url: 'https://krostydz.com',
    logo: 'https://krostydz.com/logo.png',
    description: 'منصة إعلانات مبوبة متخصصة في بيع وشراء السيارات في الجزائر',
    sameAs: [
      'https://www.facebook.com/krostydz',
      'https://www.instagram.com/krostydz',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@krostydz.com',
    },
    areaServed: 'DZ',
  };
};

export const generateCarSchema = (car) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: car.title || `${car.brand} ${car.model}`,
    image: car.images || ['/placeholder.jpg'],
    description: car.description || `سيارة ${car.brand} ${car.model} ${car.year}`,
    productionDate: `${car.year}`,
    offers: {
      '@type': 'Offer',
      url: `https://krostydz.com/cars/${car.id}`,
      priceCurrency: 'DZD',
      price: car.price.toString(),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'كروستي DZ',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
    },
  };
};

export const generateLocalBusinessSchema = (wilaya) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `كروستي DZ - ${wilaya}`,
    areaServed: wilaya,
    url: `https://krostydz.com/?wilaya=${wilaya}`,
    telephone: '+213',
    contactType: 'Sales',
  };
};
