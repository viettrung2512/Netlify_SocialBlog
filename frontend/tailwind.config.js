/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
},
  plugins: [],
    safelist: [
    'bg-blue-600',
    'text-white',
    'px-4',
    'py-2'
  ]
}