/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // 啟用 class 策略的深色模式
  theme: {
    extend: {
      screens: {
        'sm': '421px',
      },
    },
  },
  plugins: [],
}
