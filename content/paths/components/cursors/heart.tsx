import React from "react";
import useInterval from "@use-it/interval";
import {
  parse,
  PathProvider,
  PathSections,
  Endpoint,
  getCursorAtIndex,
} from "~/components/PathVisualizer";
import { heart } from "~/components/paths/templates";

export const HeartAnimation = () => {
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
  );
};
