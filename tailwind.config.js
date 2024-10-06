/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        originTech:['originTech'],
        techno:['techno'],
        autoTechno:['autoTechno'],
        lemonMilk:['lemonMilk']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.95)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards',
        fadeOut: 'fadeOut 0.4s ease-in forwards',
      },
    },
  },
  plugins: [],
}

