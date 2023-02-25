import React from "react";
import { styled } from "~/stitches.config";
import { PageProvider } from "./PageProvider";

export const PageWrapper = ({ children }) => {
  return (
    <Wrapper>
      <ContentWrapper>
        <PageProvider>{children}</PageProvider>
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  minHeight: "100vh",
});

const ContentWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "60ch 1fr",
  height: "100%",
});

// --

export const ArticleWrapper = styled("article", {
  position: "relative",
  height: "100%",
  padding: "$12",
  borderRight: "1px solid $gray8",
  lineHeight: "$body",

  "> *": {
    marginBottom: "1em",
  },

  h1: {
    fontSize: "$2xl",
    fontWeight: 800,
  },

  hr: {
    margin: "$8 -$12",
    marginTop: "$10",
    borderStyle: "dashed",
    borderColor: "$gray8",
  },

  "pre, textarea": {
    background: "$gray2",
    padding: "$4 $8",
    lineHeight: 1.4,
  },

  textarea: {
    display: "block",
    width: "100%",
    resize: "none",
    border: "1px solid $gray8",
    borderRadius: "$base",
    padding: "$4",
    minHeight: 300,
    fontFamily: "$mono",
    fontSize: "inherit",
  },

  "code:not(pre code)": {
    background: "$gray6",
    padding: "0 $1",
    borderRadius: 4,
  },
});

// --

export const GraphWrapper = ({ children }) => {
  return (
    <Main>
      <VisualWrapper>{children}</VisualWrapper>
    </Main>
  );
};

const VisualWrapper = styled("figure", {
  width: "100vh",
  height: "100%",
  margin: "0 auto",
  padding: "$10",
});

const Main = styled("main", {
  overflowX: "auto",
  height: "100vh",
  position: "sticky",
  top: 0,
});
