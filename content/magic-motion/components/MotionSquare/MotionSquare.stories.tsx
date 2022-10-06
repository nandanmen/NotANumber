import React from "react";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { FullWidth } from "~/components/FullWidth";
import { SvgGridWrapper } from "~/components/SvgGridWrapper";
import { Slider } from "~/components/Slider";

import { MotionSquare } from "./MotionSquare";

const Wrapper = ({
  width,
  children,
}: {
  width: MotionValue<number>;
  children: React.ReactNode;
}) => {
  const radius = useTransform(width, (width) => width / 2);
  const transform = useMotionTemplate`translate(calc(50% - ${radius}px), calc(50% - ${radius}px))`;
  return (
    <SvgGridWrapper>
      <motion.g style={{ transform }}>{children}</motion.g>
    </SvgGridWrapper>
  );
};

export const Default = () => {
  const width = useMotionValue(120);
  return (
    <FullWidth>
      <Wrapper width={width}>
        <MotionSquare width={width} />
      </Wrapper>
    </FullWidth>
  );
};

export const WithChangingWidth = () => {
  const width = useMotionValue(120);
  return (
    <FullWidth>
      <Slider
        css={{ marginBottom: "$8" }}
        defaultValue={[width.get()]}
        min={90}
        max={150}
        onValueChange={([newWidth]) => {
          width.set(newWidth);
        }}
      />
      <Wrapper width={width}>
        <MotionSquare width={width} showScaleRulers />
      </Wrapper>
    </FullWidth>
  );
};
