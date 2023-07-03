"use client";

import { PathVisualizer } from "../components/path-visualizer";
import type { Page } from "../components/visual-wrapper";

export const heart = `M11.995 7.23319
C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972
C4.4959 8.14609 4.2403 10.6312 5.66654 12.3892
L11.995 18.25
L18.3235 12.3892
C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972
C15.8305 5.18899 13.4446 5.60999 11.995 7.23319
Z`;

type HeartType = "cursor" | "line" | "curve";

export function Heart({ type }: { type?: HeartType }) {
  return <PathVisualizer path={heart} type={type} />;
}

export const page = (type?: HeartType): Page => {
  return {
    svg: 25,
    children: <Heart type={type} />,
  };
};
