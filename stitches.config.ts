import { createStitches } from "@stitches/react";
import {
  gray,
  blue,
  green,
  red,
  grayDark,
  blueDark,
  greenDark,
  redDark,
} from "@radix-ui/colors";

const SPACING = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  11: "2.75rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
} as const;

export const baseTheme = {
  colors: {
    ...gray,
    ...blue,
    ...green,
    ...red,
  },
  fonts: {
    serif: `Recoleta, ui-serif, Georgia, serif`,
    mono: `Source Code Pro, ui-monospace, monospace`,
    sans: `Karla, system-ui, -apple-system, sans-serif`,
  },
  fontSizes: {
    sm: "0.875rem",
    base: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.875rem",
  },
  space: SPACING,
  sizes: SPACING,
  lineHeights: {
    body: 1.7,
    title: 1,
  },
  shadows: {
    sm: "1px 1px 0 0 rgba(0, 0, 0, 0.2)",
    md: "2px 2px 0 0 rgba(0, 0, 0, 0.2)",
  },
  radii: {
    base: "6px",
  },
};

export const { styled, getCssText, globalCss, createTheme } = createStitches({
  media: {
    post: `(min-width: 50rem)`,
    md: `(min-width: 768px)`,
    lg: `(min-width: 62em)`,
    xl: `(min-width: 80em)`,
  },
  theme: baseTheme,
});

export const darkTheme = createTheme({
  colors: {
    ...grayDark,
    ...blueDark,
    ...greenDark,
    ...redDark,
  },
});

export const globalStyles = globalCss({
  "*": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },
  "input, button": {
    all: "unset",
  },
  button: {
    cursor: "pointer",
  },
  body: {
    fontFamily: "$sans",
  },
  "h1, h2": {
    fontWeight: "normal",
  },
  /* as recommended in https://rehype-pretty-code.netlify.app/ */
  "pre > code": {
    display: "grid",
  },
  code: {
    fontFamily: "$mono",
  },
});
