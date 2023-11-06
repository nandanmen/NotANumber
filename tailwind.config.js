const { gray, blue, green, red, yellow, cyan } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ...gray,
        ...blue,
        ...green,
        ...red,
        ...yellow,
        ...cyan,
        background: "#f9f6e7",
        highlight: "#2628c1",
      },
      fontFamily: {
        serif: "var(--font-serif)",
        sans: "Geist",
        title: "PP Pangaia",
      },
      screens: {
        coffee: "1370px",
      },
    },
  },
  plugins: [],
};
