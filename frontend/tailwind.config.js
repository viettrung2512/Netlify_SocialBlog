/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
    safelist: [
    'bg-blue-600',
    'text-white',
    'px-4',
    'py-2'
  ]
}