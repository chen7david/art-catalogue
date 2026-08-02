/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c1917",
        paper: "#fafaf9",
      },
    },
  },
  plugins: [],
};
