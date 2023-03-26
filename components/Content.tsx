import { darkTheme, styled } from "~/stitches.config";

export const Content = styled("div", {
  "> *": {
    gridColumn: "1",
  },

  "> figure": {
    marginTop: "$4",
    marginBottom: "$8",
  },

  "> .note": {
    gridColumn: "1 / -1",
  },

  "> .full-width": {
    gridColumn: "1 / -1",
    marginTop: "$4",
    marginBottom: "$8",
    width: "100%",
  },

  "> :where(:not(:last-child))": {
    marginBottom: "$4",
  },

  h2: {
    fontFamily: "$serif",
  },

  "code:not([data-rehype-pretty-code-fragment] code, pre code)": {
    background: "$gray7",
    padding: 2,
    fontSize: "$sm",

    [`.${darkTheme} &`]: {
      background: "$gray4",
    },
  },

  "*": {
    "&[data-theme='dark']": {
      display: "none",
    },

    [`.${darkTheme} &`]: {
      "&[data-theme='light']": {
        display: "none",
      },
      "&[data-theme='dark']": {
        display: "revert",
      },
    },
  },

  "[data-rehype-pretty-code-fragment] pre, > pre": {
    marginTop: "$4",
    marginBottom: "$8",
    whiteSpace: "pre-wrap",
    border: "1px solid $gray8",
    padding: "$4",
    borderRadius: "$base",
    fontSize: "$sm",
    overflowX: "auto",
    background: "$gray4",
    position: "relative",

    [`.${darkTheme} &`]: {
      border: "1px solid $gray6",
      background: "$gray2",
    },
  },

  blockquote: {
    paddingLeft: "$4",
    borderLeft: "2px solid $gray8",
    color: "$gray11",
    fontStyle: "italic",
  },

  hr: {
    marginTop: "$6",
    marginBottom: "$12",
    width: "30%",
    borderTop: "1px solid $gray8",
  },

  "[data-rehype-pretty-code-fragment] > pre": {
    marginBottom: "$4",
  },
});
