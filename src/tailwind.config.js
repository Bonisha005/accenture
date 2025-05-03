/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#16a34a",
        warning: "#facc15",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};