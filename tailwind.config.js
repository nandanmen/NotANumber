const { gray, blue, green, red, yellow } = require("@radix-ui/colors");

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
      },
      fontFamily: {
        serif: `PP Editorial New, ui-serif, Georgia, serif`,
        mono: `JetBrains Mono, ui-monospace, Menlo, Monaco, "Segoe UI Mono", "Roboto Mono", monospace`,
        sans: `Nunito, system-ui, -apple-system, sans-serif`,
      },
    },
  },
  plugins: [],
};
