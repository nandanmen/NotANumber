/* eslint-disable react/jsx-key */

import React from "react";
import { styled } from "~/stitches.config";
import { PathBackground } from "~/components/PathPlayground";
import { HeartAnimation } from "./heart";
import { MoveCommand } from "./move";
import { usePageContext } from "../PageProvider";
import { Exercise } from "./exercise";

const components = [
  <HeartAnimation />,
  <MoveCommand index={0} />,
  <MoveCommand index={1} />,
  <Exercise />,
];

export const CursorVisual = () => {
  const { activeIndex } = usePageContext();
  return (
    <Wrapper>
      <PathBackground size={25} step={5}>
        {components.slice(0, activeIndex + 1).map((component, index) => {
          const isActive = index === activeIndex;
          return <g style={{ opacity: isActive ? 1 : 0 }}>{component}</g>;
        })}
      </PathBackground>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  height: "100%",
  position: "relative",
});
