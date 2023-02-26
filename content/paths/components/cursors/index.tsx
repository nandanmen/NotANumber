import React from "react";
import { styled } from "~/stitches.config";
import { PathBackground } from "~/components/PathPlayground";
import { HeartAnimation } from "./heart";
import { MoveCommand } from "./move";
import { usePageContext } from "../PageProvider";
import { Exercise } from "./exercise";

export const CursorVisual = () => {
  const { activeIndex } = usePageContext();
  return (
    <Wrapper>
      <PathBackground size={25} step={5}>
        {activeIndex === 0 && <HeartAnimation />}
        {[1, 2].includes(activeIndex) && (
          <MoveCommand index={activeIndex - 1} />
        )}
        {activeIndex > 2 && <Exercise />}
      </PathBackground>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  height: "100%",
  position: "relative",
});
