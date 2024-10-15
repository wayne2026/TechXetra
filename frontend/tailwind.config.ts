/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily:{
        originTech:['originTech'],
        techno:['techno'],
        autoTechno:['autoTechno'],
        lemonMilk:['lemonMilk'],
        technoHideo:['technoHideo'],
        technomania:['technomania']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  
};


