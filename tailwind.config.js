/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1c1c1c', // أسود داكن يطابق خلفية اللوغو
        accent: '#e8141c',  // أحمر مطابق للوغو Crosty
        'accent-dark': '#c40f16',
        canvas: '#f4f5f7',  // خلفية الصفحات
        ink: '#16181d',     // لون النص الأساسي
        muted: '#6b7280',   // نص ثانوي
        line: '#e3e6ea',    // لون الحدود الموحّد
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        card: '0.625rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(16 24 40 / 0.04)',
        pop: '0 6px 20px -6px rgb(16 24 40 / 0.14)',
      },
    },
  },
  plugins: [],
};
