/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        customTurquoise:{
          400: '#049985',
        }
      }
    },
  },
  plugins: [
 ],
}

