/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'manrope': ['Manrope', 'sans-serif']
      },
      colors:{
        'text-gradient-start': '#7527ED',
        'text-gradient-middle': '#FF00FF',
        'text-gradient-end': '#FD8444',
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(90deg, #7527ED, #FF00FF, #FD8444)',
      },
      backgroundClip: {
        'text': 'text',
      },
      textFillColor: {
        'transparent': 'transparent',
      },
    },
  },
  plugins: [],
}