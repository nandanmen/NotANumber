import type { ComponentPropsWithoutRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { darkTheme, styled } from "~/stitches.config";

export const Slider = (props: ComponentPropsWithoutRef<typeof SliderRoot>) => {
  return (
    <SliderRoot {...props}>
      <Track>
        <Range />
      </Track>
      <Thumb />
    </SliderRoot>
  );
};

const SliderRoot = styled(SliderPrimitive.Root, {
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
});

const Track = styled(SliderPrimitive.Track, {
  position: "relative",
  background: "$gray7",
  flexGrow: 1,
  height: 4,
  borderRadius: 4,

  [`.${darkTheme} &`]: {
    background: "$gray4",
  },
});

const Range = styled(SliderPrimitive.Range, {
  position: "absolute",
  backgroundColor: "$gray8",
  height: "100%",
});

const Thumb = styled(SliderPrimitive.Thumb, {
  display: "block",
  background: "$gray3",
  border: "1px solid $gray8",
  width: "$4",
  height: "$6",
  borderRadius: 4,
  boxShadow: "$sm",
  transition: "transform 0.1s ease-out",
  transform: "scale(1)",
  cursor: "pointer",

  "&:hover": {
    color: "$gray1",
    background: "$blue9",
    borderColor: "$blue11",
    transform: "scale(0.9)",
  },
});
