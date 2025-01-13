/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#33b8ff",
      },
      boxShadow: {
        // shadow-[0_0_30px_2px_rgb(0,0,0,0.2)]
        "3xl": "0 0 30px 2px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
