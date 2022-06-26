import { createStitches } from '@stitches/react'

const BASE_GREY = '220, 14%'

const COLORS = {
  white: 'hsl(60, 100%, 100%)',
  navy: 'hsl(262, 49%, 14%)',
  black: 'hsl(13, 22%, 13%)',
  purple: 'hsl(291, 30%, 48%)',
  red: 'hsl(0, 72%, 62%)',
  orange: 'hsl(32, 100%, 51%)',
  brown: 'hsl(13, 16%, 70%)',
  blue: 'hsl(250, 80%, 60%)',
  teal: 'hsl(187, 55%, 71%)',
  grey100: `hsl(${BASE_GREY}, 95%)`,
  grey200: `hsl(${BASE_GREY}, 90%)`,
  grey300: `hsl(${BASE_GREY}, 75%)`,
  grey400: `hsl(${BASE_GREY}, 65%)`,
  grey600: `hsl(${BASE_GREY}, 45%)`,
  grey800: `hsl(${BASE_GREY}, 25%)`,
} as const

const SPACING = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const

export const { styled, keyframes, css, globalCss } = createStitches({
  media: {
    post: `(min-width: 50rem)`,
    md: `(min-width: 768px)`,
    lg: `(min-width: 62em)`,
    xl: `(min-width: 80em)`,
  },
  theme: {
    colors: {
      ...COLORS,

      background: COLORS.grey100,
      highlight: COLORS.red,
      highlightSecondary: COLORS.blue,
      text: COLORS.black,
      textSecondary: COLORS.grey600,
      border: COLORS.navy,

      /* Code theme */
      codeBackground: COLORS.white,
      codeText: COLORS.black,
      codeBorder: COLORS.navy,
      tokenKeyword: COLORS.purple,
      tokenFunction: COLORS.purple,
      tokenString: COLORS.red,
      tokenComment: COLORS.brown,
    },
    fonts: {
      serif: `Recoleta, ui-serif, Georgia, serif`,
      mono: `Menlo, ui-monosapce, monospace`,
      sans: `Karla, system-ui, -apple-system, sans-serif`,
    },
    fontSizes: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '1.875rem',
    },
    space: SPACING,
    sizes: SPACING,
  },
})
