const { gray, blue, green, red, yellow, cyan } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./mdx-components.tsx",
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
        borderStrong: gray.gray8,
        borderSoft: gray.gray7,
      },
      fontFamily: {
        serif: "var(--font-serif)",
        sans: "var(--font-sans)",
        mono: "SF Mono, monospace",
        handwriting: "var(--font-handwriting)",
      },
      screens: {
        coffee: "1370px",
      },
    },
  },
  plugins: [],
};
