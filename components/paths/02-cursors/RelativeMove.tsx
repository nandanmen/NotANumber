import React from "react";
import useInterval from "@use-it/interval";
import { styled } from "~/stitches.config";
import { PathBackground } from "~/components/PathPlayground";
import {
  parse,
  PathProvider,
  PathSections,
  Lines,
  Line,
  Endpoint,
  Endpoints,
  getCursorAtIndex,
} from "~/components/PathVisualizer";
import { UndoButton } from "~/components/Visualizer";

export const RelativeMove = () => {
  const [playing, setPlaying] = React.useState(true);
  const [index, setIndex] = React.useState(0);
  const commands = parse("M 10 20 m 5 5");

  useInterval(
    () => {
      if (index < commands.length - 1) {
        setIndex(index + 1);
      } else {
        setPlaying(false);
      }
    },
    playing ? 1000 : null
  );

  const cursorPositions = commands.map((_, index) =>
    getCursorAtIndex(commands, index)
  );
  const currentPosition = cursorPositions[index];
  return (
    <Wrapper>
      <PathBackground size={25} step={5}>
        <PathProvider commands={[]} size={25} activeIndex={index}>
          <Line x1="0" y1="0" x2="10" y2="20" dashed />
          <Line x1="10" y1="20" x2="20" y2="12.5" dashed />
          <Line
            x1="10"
            y1="12.5"
            x2="20"
            y2="12.5"
            css={{ stroke: "$gray8" }}
          />
          <Line x1="10" y1="12.5" x2="10" y2="20" css={{ stroke: "$gray8" }} />
          <Endpoint />
          <Endpoint cx="10" cy="20" />
          <Endpoint cx="20" cy="12.5" />
          <Endpoint small cx="10" cy="12.5" css={{ stroke: "none" }} />
        </PathProvider>
      </PathBackground>
      <Controls>
        <UndoButton
          secondary={false}
          onClick={() => {
            setIndex(0);
            setPlaying(true);
          }}
        />
      </Controls>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  height: "100%",
  position: "relative",
});

const Controls = styled("div", {
  position: "absolute",
  bottom: "$8",
  right: "$8",
});