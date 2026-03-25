"use client";

import React from "react";
import useInterval from "@use-it/interval";
import { ArticleBleed } from "../article-bleed";
import { Content, Visualizer } from "~/components/Visualizer";
import { styled } from "~/stitches.config";
import { KanjiViewer } from "../KanjiCarousel";
import { Button } from "../NextButton";

export const AnimationShowcase = ({ speed = 1500 }) => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);
  const [currentIndex, next] = React.useReducer((index) => {
    return index === 2 ? 0 : index + 1;
  }, 0);

  useInterval(() => {
    next();
    toggle();
  }, speed);

  return (
    <ArticleBleed>
      <Wrapper>
        <Box css={{ display: "flex", gap: "$4", width: "100%" }}>
          <VisualWrapper>
            <ContentWrapper>
              <KanjiViewer showOverflow={false} index={currentIndex} />
            </ContentWrapper>
          </VisualWrapper>
          <VisualWrapper>
            <ContentWrapper>
              <Button toggled={toggled} />
            </ContentWrapper>
          </VisualWrapper>
        </Box>
        <Box css={{ height: "100%", width: "$4", "@md": { display: "none" } }} />
      </Wrapper>
    </ArticleBleed>
  );
};

const Wrapper = styled("figure", {
  overflowX: "auto",
  width: "100%",
  display: "flex",
});

const VisualWrapper = styled(Visualizer, {
  minWidth: 300,
  flex: 1,
});

const ContentWrapper = styled(Content, {
  display: "flex",
  padding: "$10 0",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
});

const Box = styled("div", {});
