/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      salmon: {
        600: "#fa755a",
        400: "#df7c6d",
        100: "#F4EBEA",
      },
      red: "#ff0000",
      black: "#000000",
      white: "#ffffff",
      blue: {
        600: "#2758C2",
        400: "#316DF4",
        100: "#add8e6",
      },
      gray: {
        800: "#3e3e3e",
        600: "#778899",
        500: "#5f5f5f",
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
