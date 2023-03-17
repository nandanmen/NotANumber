"use client";

import { useIndexContext } from "../components/page-section";
import { PathVisualizer } from "../components/path-visualizer";
import { Svg } from "../components/svg";

const phone =
  "M 22 17 v 3 a 2 2 0 0 1 -2 2 a 20 20 0 0 1 -18 -18 A 2 2 0 0 1 4 2 h 3 a 2 2 0 0 1 2 2 a 13 13 0 0 0 1 3 a 2 2 0 0 1 -1 2 L 8 10 a 16 16 0 0 0 6 6 l 1 -1 a 2 2 0 0 1 2 -1 a 13 13 0 0 0 3 1 A 2 2 0 0 1 22 17 Z";

const heart = `M11.995 7.23319
C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972
C4.4959 8.14609 4.2403 10.6312 5.66654 12.3892
L11.995 18.25
L18.3235 12.3892
C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972
C15.8305 5.18899 13.4446 5.60999 11.995 7.23319
Z`;

const mapIndexToType = {
  2: "cursor",
  3: "line",
  4: "curve",
};

export function Index() {
  const { index } = useIndexContext();
  return (
    <Svg size={25}>
      <PathVisualizer path={heart} type={mapIndexToType[index]} />
    </Svg>
  );
}
