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

const path = `M 20 10
v 20
m 30 0
v -20
M 10 40
Q 35 60 60 40`;

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
    <PathBackground size={70} step={10}>
      <PathProvider
        commands={commands}
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
