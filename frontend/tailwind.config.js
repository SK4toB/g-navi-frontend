/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dmsans': ['DM Sans', 'sans-serif'],
        'plusjakartasans': ['Plus Jakarta Sans', 'sans-serif'],
        'sourcecodepro': ['Source Code Pro', 'monospace'],
        'pretendard': ['Pretendard', 'sans-serif'],
        'notosanskr': ['Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}