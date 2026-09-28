/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FDF9FB',
          100: '#FAF3F8', // blush mist background
          150: '#F7EDF5',
          200: '#F2E4EF',
          300: '#EABEDC',
          400: '#E286BC',
          500: '#DE5B9B', // primary brand rose
          600: '#C94685', // primary button hover
          700: '#A43168',
          800: '#752048',
          900: '#4D122E',
        },
        plum: {
          50: '#FAF8FC',
          100: '#F3EEF7',
          200: '#E4DBEC',
          300: '#C9BCD4',
          400: '#A091AD',
          500: '#786886',
          600: '#655773', // secondary muted text
          700: '#4B3E57',
          800: '#32283C',
          900: '#1D1722', // primary heading text
        }
      },
      fontFamily: {
        cursive: [
          'Caveat',
          'Pacifico',
          'cursive'
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}
