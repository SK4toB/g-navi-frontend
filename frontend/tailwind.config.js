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
      },
      fontFamily: {
        'pretendard': ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}