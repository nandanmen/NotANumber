import * as SliderPrimitive from "@radix-ui/react-slider";
import { darkTheme, styled } from "~/stitches.config";

export const Slider = (props: SliderPrimitive.SliderProps) => {
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
});

const Range = styled(SliderPrimitive.Range, {
  position: "absolute",
  backgroundColor: "$blue6",
  height: "100%",

  [`.${darkTheme} &`]: {
    background: "$blue7",
  },
});

const Thumb = styled(SliderPrimitive.Thumb, {
  display: "block",
  background: "$blue6",
  border: "1px solid black",
  width: "$6",
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

  [`.${darkTheme} &`]: {
    background: "$blue7",
    borderColor: "$blue7",
  },
});
