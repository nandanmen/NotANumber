const { gray, blue, green, red, yellow, cyan } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
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
        mono: "var(--font-mono)",
        sans: "var(--font-sans)",
      },
    },
  },
  plugins: [],
};
