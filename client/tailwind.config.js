/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      salmon: {
        400: "#df7c6d",
        100: "#F4EBEA",
      },
      red: "#ff0000",
      black: "#000000",
      white: "#ffffff",
      gray: {
        800: "#3e3e3e",
        400: "#B2B2B2",
        300: "#ccc",
        200: "#E0E0E0",
        100: "#F7F7F7",
      },
    },
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
};
