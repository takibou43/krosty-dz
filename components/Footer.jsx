export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* عن الموقع */}
          <div>
            <h3 className="text-xl font-bold mb-4">كروستي DZ</h3>
            <p className="text-gray-300 text-sm">
              منصة إعلانات مبوبة موثوقة متخصصة في بيع وشراء السيارات في الجزائر
            </p>
          </div>

          {/* الروابط السريعة */}
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="/" className="hover:text-accent transition">الرئيسية</a></li>
              <li><a href="/add" className="hover:text-accent transition">أضف إعلانك</a></li>
              <li><a href="/cars" className="hover:text-accent transition">البحث</a></li>
              <li><a href="/contact" className="hover:text-accent transition">اتصل بنا</a></li>
            </ul>
          </div>

          {/* الدعم */}
          <div>
            <h3 className="text-lg font-bold mb-4">الدعم</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="/about" className="hover:text-accent transition">من نحن</a></li>
              <li><a href="/contact" className="hover:text-accent transition">التواصل معنا</a></li>
            </ul>
          </div>

          {/* وسائل التواصل */}
          <div>
            <h3 className="text-lg font-bold mb-4">تابعنا</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-accent rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                f
              </a>
              <a href="#" className="w-10 h-10 bg-accent rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                📱
              </a>
              <a href="#" className="w-10 h-10 bg-accent rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                🔔
              </a>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mb-8" />

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>© 2026 كروستي DZ - جميع الحقوق محفوظة</p>
          <p className="mt-2">منصة آمنة وموثوقة لبيع وشراء السيارات في الجزائر 🇩🇿</p>
        </div>
      </div>
    </footer>
  );
}
