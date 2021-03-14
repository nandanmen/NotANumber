module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        mono: ['Ligalex Mono', 'ui-monospace'],
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
