/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-100': '#4671FF',
        'primary-200': '#081B5B', 
      },
    },
  },
  plugins: [],
}

