import React from "react";
import { animate, useMotionValue } from "framer-motion";
import { FullWidth } from "~/components/FullWidth";
import { HeavyRectangle } from "~/components/HeavyRectangle";
import {
  SvgBackgroundGradient,
  getFillFromId,
} from "~/components/utils/SvgBackgroundGradient";
import {
  Visualizer,
  Content,
  Controls,
  ToggleButton,
} from "~/components/Visualizer";

export const HeavyRectangleVisualizer = () => {
  const id = React.useId();
  const weight = useMotionValue(0);
  return (
    <FullWidth>
      <Visualizer>
        <Content>
          <svg viewBox="-20 0 140 80">
            <SvgBackgroundGradient id={id} />
            <HeavyRectangle
              weight={weight}
              fill={getFillFromId(id)}
              stroke="var(--colors-blue6)"
              strokeWidth="0.3"
            />
          </svg>
        </Content>
        <Controls css={{ justifyContent: "center", gap: "$2" }}>
          <ToggleButton
            onClick={() => animate(weight, 20, { type: "spring", damping: 20 })}
          >
            Heavy
          </ToggleButton>
          <ToggleButton
            onClick={() => animate(weight, 0, { type: "spring", damping: 20 })}
          >
            Light
          </ToggleButton>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};
