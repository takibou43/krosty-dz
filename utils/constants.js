// utils/constants.js - الثوابت والتكوينات

export const WILAYAT = [
  'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة',
  'بجاية', 'بسكرة', 'بشار', 'البليدة', 'البويرة',
  'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو',
  'الجزائر العاصمة', 'الجلفة', 'جيجل', 'سطيف', 'سعيدة',
  'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة', 'قسنطينة',
  'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة',
  'وهران', 'البيض', 'إليزي', 'برج بوعريريج', 'بومرداس',
  'الطارف', 'تندوف', 'تيسمسيلت', 'الوادي', 'خنشلة',
  'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة',
  'عين تيموشنت', 'غرداية', 'غليزان', 'تيميمون', 'برج باجي مختار',
  'أولاد جلال', 'بني عباس', 'إن صالح', 'إن قزام', 'توقرت',
  'جانت', 'المغير', 'المنيعة',
];

export const BRANDS = [
  'Renault', 'Peugeot', 'Volkswagen', 'Hyundai', 'Dacia',
  'Toyota', 'Honda', 'Kia', 'BMW', 'Mercedes-Benz',
  'Audi', 'Citroën', 'Opel', 'Ford', 'Chevrolet',
  'Nissan', 'Mazda', 'Suzuki', 'Mitsubishi', 'Fiat',
  'Seat', 'Skoda', 'Jeep', 'Land Rover', 'Tesla',
  'Chery', 'Geely', 'Great Wall (GWM)', 'Haval', 'BYD',
  'Changan', 'JAC', 'MG', 'FAW', 'Dongfeng',
  'GAC', 'Wuling', 'Omoda', 'Jaecoo', 'Exeed',
  'Zotye', 'Lifan', 'Baic', 'Foton', 'SsangYong',
  'Genesis', 'Subaru', 'Isuzu', 'Daihatsu', 'Alfa Romeo',
  'Lancia', 'Volvo', 'Saab', 'Mini', 'Porsche',
  'Jaguar', 'Bentley', 'Rolls-Royce', 'Aston Martin', 'Maserati',
  'Ferrari', 'Lamborghini', 'McLaren', 'Dodge', 'Chrysler',
  'Cadillac', 'GMC', 'Lincoln', 'Buick', 'RAM',
  'Lexus', 'Infiniti', 'Acura', 'Lada', 'Proton',
  'Tata', 'Mahindra',
];

export const FUEL_TYPES = ['Essence', 'Diesel', 'GPL'];
export const GEARBOX_TYPES = ['Manuelle', 'Automatique'];
export const DOCUMENTS_STATUS = ['Carte Grise', 'صافية', 'رخصة مجاهدين'];

export const FEATURED_PLANS = {
  STANDARD: {
    id: 'standard',
    name: 'إعلان عادي',
    price: 0,
    duration: 'غير محدود',
    features: ['ظهور عادي', 'حتى 10 صور', 'وصف مفصل'],
  },
  FEATURED_7DAYS: {
    id: 'featured-7days',
    name: 'مميز 7 أيام',
    price: 1500,
    duration: '7 أيام',
    features: ['✨ تثبيت في الأعلى', '⭐ شارة مميز', '📈 زيارات 10x', 'أولوية في البحث'],
    multiplier: 10,
  },
  FEATURED_30DAYS: {
    id: 'featured-30days',
    name: 'مميز شهر',
    price: 4500,
    duration: '30 يوم',
    features: ['✨ تثبيت في الأعلى', '⭐ شارة مميز', '📈 زيارات 20x', 'أولوية عليا'],
    multiplier: 20,
  },
};

export const COLORS = {
  primary: '#1c1c1c',
  accent: '#e95903',
  background: '#f5f5f5',
  white: '#ffffff',
  darkGray: '#333333',
  lightGray: '#d1d5db',
};

export const API_ENDPOINTS = {
  CARS: '/api/cars',
  CAR_DETAIL: (id) => `/api/cars/${id}`,
  FEATURED_ADS: '/api/featured-ads',
  PAYMENTS: '/api/payments',
  SEARCH: '/api/search',
};

// رسائل الأخطاء والنجاح
export const MESSAGES = {
  SUCCESS: {
    LISTING_CREATED: 'تم إنشاء الإعلان بنجاح',
    LISTING_UPDATED: 'تم تحديث الإعلان بنجاح',
    PAYMENT_COMPLETED: 'تم الدفع بنجاح',
  },
  ERROR: {
    INVALID_FORM: 'يرجى ملء جميع الحقول المطلوبة',
    PAYMENT_FAILED: 'فشل الدفع، يرجى المحاولة مجدداً',
    NETWORK_ERROR: 'خطأ في الاتصال، يرجى المحاولة لاحقاً',
  },
};

// إعدادات Google AdSense
export const ADSENSE_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxxxxxxxx',
  SLOT_BANNER: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER || '1234567890',
  SLOT_SIDEBAR: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '0987654321',
};

// إعدادات Supabase
export const SUPABASE_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};
