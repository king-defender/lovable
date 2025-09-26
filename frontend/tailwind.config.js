/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f4ff',
          100: '#e8eaff',
          200: '#d4d8ff',
          300: '#b3bbff',
          400: '#8b94ff',
          500: '#667eea',
          600: '#5a5fcf',
          700: '#4c51bf',
          800: '#434190',
          900: '#3730a3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}