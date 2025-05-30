/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dmsans': ['DM Sans', 'sans-serif'], // 'DM Sans' 폰트 추가. 실제 폰트 이름에 따라 조정 필요.
        'plusjakartasans': ['Plus Jakarta Sans', 'sans-serif'], // 'Plus Jakarta Sans' 폰트 추가.
        'sourcecodepro': ['Source Code Pro', 'monospace'], // 'Source Code Pro' 폰트 추가.
      },
    },
  },
  plugins: [],
}