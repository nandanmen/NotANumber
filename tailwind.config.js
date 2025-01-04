const { gray, blue, green, red, yellow, cyan } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...gray,
        ...blue,
        ...green,
        ...red,
        ...yellow,
        ...cyan,
      },
      fontFamily: {
        serif: "var(--font-serif)",
        sans: "var(--font-sans)",
        mono: "Input",
      },
      screens: {
        coffee: "1370px",
      },
    },
  },
  plugins: [],
};
