import React from "react";
import useInterval from "@use-it/interval";
import { styled } from "~/stitches.config";
import { PathBackground } from "~/components/PathPlayground";
import {
  parse,
  PathProvider,
  PathSections,
  Endpoint,
  getCursorAtIndex,
} from "~/components/PathVisualizer";
import { UndoButton } from "~/components/Visualizer";
import { heart } from "../../templates";

export const CursorPath = () => {
  const [playing, setPlaying] = React.useState(true);
  const [index, setIndex] = React.useState(0);
  const commands = parse(heart);

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
        <PathProvider commands={commands} size={25} activeIndex={index}>
          <PathSections />
          {cursorPositions.map((position, i) => {
            if (i >= index) return null;
            return (
              <Endpoint
                key={`cursor-${i}`}
                cx={position.x}
                cy={position.y}
                css={{ fill: "$gray4" }}
              />
            );
          })}
          <Endpoint
            color="blue"
            animate={{ x: currentPosition.x, y: currentPosition.y }}
            initial={{ cx: 0, cy: 0 }}
          />
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
