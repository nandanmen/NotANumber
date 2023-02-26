import React from "react";
import useInterval from "@use-it/interval";
import {
  parse,
  PathProvider,
  PathSections,
  Endpoint,
  getCursorAtIndex,
  Lines,
  Endpoints,
} from "~/components/PathVisualizer";
import { PathBackground } from "~/components/PathPlayground";
import { usePageContext } from "../PageProvider";

const path = `M 20 20
v 20
m 30 0
v -20
M 10 50
Q 40 70 65 50`;

export const CommandsVisual = () => {
  const { activeIndex } = usePageContext();
  const [playing, setPlaying] = React.useState(true);
  const [index, setIndex] = React.useState(0);
  const commands = parse(path);

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

  const highlightMap = {
    2: "move",
    3: "line",
    4: "curve",
  };

  return (
    <PathBackground size={80} step={10}>
      <PathProvider
        commands={commands}
        size={80}
        activeIndex={index}
        highlight={highlightMap[activeIndex] ? [highlightMap[activeIndex]] : []}
      >
        <Lines />
        <PathSections />
        <Endpoints />
      </PathProvider>
    </PathBackground>
  );
};
