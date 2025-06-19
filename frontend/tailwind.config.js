// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-color': '#122250',
        'text-color': '#1E293B',
        
        'brand-indigo': '#6366f1',     // 인디고 메인 컬러
        'brand-purple': '#a855f7',     // 퍼플 메인 컬러
        'brand-blue': '#3b82f6',       // 블루 보조 컬러
        'brand-pink': '#ec4899',       // 핑크 보조 컬러
      },
      fontFamily: {
        'pretendard': ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}