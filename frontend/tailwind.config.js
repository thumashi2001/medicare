/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "green-primary": "#2ecc71",
        "green-dark":    "#27ae60",
        "green-light":   "#e8f8f5",
      },
    },
  },
  plugins: [],
};
