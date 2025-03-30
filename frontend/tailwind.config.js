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
        'light-font': '#262626',
        'back-gray':'#EBEBEB',
        'back-image': '#222222'
      },

      height: {
        'half': '50vh',
        'half-full': '60vh',
        'sidebar': '20vh',
        'dash': '90vh',
        'header': '10%', 
        'content': '90%', 
      },

      fontSize:{
        '7xl':'4.2rem',
      }
    },
  },
  plugins: [],
}

