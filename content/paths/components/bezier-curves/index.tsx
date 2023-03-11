import React from "react";
import {
  parse,
  PathProvider,
  PathSections,
  Endpoint,
  getCursorAtIndex,
  Lines,
  Endpoints,
  Path,
  PathVisualizer,
} from "~/components/PathVisualizer";
import { PathBackground } from "~/components/PathPlayground";
import { usePageContext } from "../PageProvider";
import { InteractivePathPlayground } from "~/components/InteractivePathPlayground";
import { Exercise } from "./exercise";

export const BezierCurvesVisual = () => {
  const { activeIndex } = usePageContext();
  if (activeIndex === 3) {
    return (
      <InteractivePathPlayground
        size={20}
        step={5}
        commands="M 5 5 v 5 Q 5 15 10 15 h 5"
        autoplay
      />
    );
  }
  if (activeIndex === 4) {
    return (
      <PathBackground size={30} step={5}>
        <PathVisualizer commands={parse("M 5 15 q 5 -10 10 0 q 5 10 10 0")} />
      </PathBackground>
    );
  }
  if (activeIndex === 5) {
    return (
      <PathBackground size={30} step={5}>
        <path d="M 5 15 q 5 -10 10 0 t 10 0" fill="none" stroke="white" />
      </PathBackground>
    );
  }
  return (
    <PathBackground size={35} step={5}>
      <Exercise />
    </PathBackground>
  );
};
