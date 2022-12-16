import React from "react";
import { EasingCurveEditor, type CubicBezier } from "./EasingCurveEditor";

export const Default = () => {
  const [easing, setEasing] = React.useState<CubicBezier>([0.25, 0.1, 0.25, 1]);
  return (
    <div style={{ width: 450 }}>
      <EasingCurveEditor easing={easing} onEasingChange={setEasing} />
    </div>
  );
};
