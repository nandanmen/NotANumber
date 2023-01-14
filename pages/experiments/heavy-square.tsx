import React from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import {
  ExperimentsPage,
  ExperimentWrapper,
} from "~/components/layout/ExperimentsPage";
import {
  SvgBackgroundGradient,
  getFillFromId,
} from "~/components/utils/SvgBackgroundGradient";
import { styled } from "~/stitches.config";
import { ToggleButton } from "~/components/Visualizer";
import { HeavyRectangle } from "~/components/HeavyRectangle";

export default function HeavySquarePage() {
  const id = React.useId();
  const textRef = React.useRef<SVGTextElement>();
  const weight = useMotionValue(0);
  const textOffset = useTransform(weight, (w) => 40 + w);

  React.useEffect(() => {
    weight.onChange((weight) => {
      if (textRef.current) {
        textRef.current.textContent = weight.toFixed(0);
      }
    });
  }, [weight]);

  return (
    <ExperimentsPage page="heavy-square">
      <ExperimentWrapper css={{ background: "none" }}>
        <svg width="100%" viewBox="-10 0 120 80">
          <mask id="mask">
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <HeavyRectangle weight={weight} fill="white" />
          </mask>
          <SvgBackgroundGradient id={id} />
          <HeavyRectangle
            weight={weight}
            fill={getFillFromId(id)}
            stroke="black"
            strokeWidth="0.3"
          />
          <Text
            mask="url('#mask')"
            x="50"
            y={textOffset}
            dominantBaseline="central"
            textAnchor="middle"
            ref={textRef}
          >
            {weight.get()}
          </Text>
        </svg>
        <Controls>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <ToggleButton
              onClick={() =>
                animate(weight, 20, { type: "spring", damping: 50 })
              }
            >
              Heavy
            </ToggleButton>
            <ToggleButton
              onClick={() =>
                animate(weight, 0, { type: "spring", damping: 50 })
              }
            >
              Light
            </ToggleButton>
          </div>
        </Controls>
      </ExperimentWrapper>
    </ExperimentsPage>
  );
}

const Text = styled(motion.text, {
  fontSize: 30,
  fill: "$blue11",
  fontFamily: "$mono",
  fontWeight: "bold",
});

const Controls = styled("div", {
  width: 500,
  margin: "0 auto",
});
