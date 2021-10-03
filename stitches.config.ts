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

export const { styled } = createStitches({
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
      mono: `DM Mono, Menlo, ui-monosapce, monospace`,
      sans: `Karla, system-ui, -apple-system, sans-serif`,
    },
    fontSizes: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '1.875rem',
    },
  },
})
