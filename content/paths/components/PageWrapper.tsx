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
  gridTemplateColumns: "68ch 100vh",
  height: "100%",
  margin: "0 auto",
  width: "fit-content",
});

// --

export const ArticleWrapper = styled("article", {
  position: "relative",
  height: "100%",
  paddingBottom: "$32",
  borderRight: "1px solid $gray8",
  fontSize: 18,
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
