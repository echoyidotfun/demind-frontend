/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out forwards",
        "staggered-fade-in": "fadeIn 0.5s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backgroundColor: {
        "background-level1": "var(--background-level1)",
      },
      textColor: {
        "primary-500": "var(--primary-500)",
        "primary-600": "var(--primary-600)",
      },
      borderColor: {
        "border-base": "var(--border-base)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
