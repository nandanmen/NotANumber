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
} from "~/components/PathVisualizer";
import { PathBackground } from "~/components/PathPlayground";
import { usePageContext } from "../PageProvider";
import { InteractivePathPlayground } from "~/components/InteractivePathPlayground";
import { Exercise } from "./exercise";

export const BezierCurvesVisual = () => {
  const { activeIndex } = usePageContext();
  if (activeIndex < 3) {
    return (
      <InteractivePathPlayground
        size={20}
        step={5}
        commands="M 5 5 v 5 Q 5 15 10 15 h 5"
        autoplay
      />
    );
  }
  return (
    <PathBackground size={35} step={5}>
      <Exercise />
    </PathBackground>
  );
};
