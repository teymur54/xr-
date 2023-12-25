/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkblue: {
          100: '#00406C',
          200: '#003A61',
          300: '#003356',
          400: '#002E4E',
          500: '#002945',
          600: '#00253E',
          700: '#002137',
          800: '#001A2C',
          900: '#001523',
          1000: '#00111C',
        },
      },
    },
  },
  plugins: [],
}
