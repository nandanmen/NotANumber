const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  dark: 'media',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
        mono: [
          'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        ],
      },
      colors: {
        blacks: {
          900: '#09090b',
          700: '#16171C',
          500: '#262730',
          300: '#373844',
          100: '#474857',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
