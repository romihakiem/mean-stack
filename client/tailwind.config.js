/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7f5',
          100: '#dceae4',
          400: '#3f9c80',
          500: '#2d7f68',
          600: '#226354',
          900: '#173a32',
        },
      },
    },
  },
  plugins: [],
};
