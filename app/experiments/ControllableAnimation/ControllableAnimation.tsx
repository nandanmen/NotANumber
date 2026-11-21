import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Slider } from "~/components/Slider";
import {
  Visualizer,
  Content,
  Controls,
  ToggleButton,
  PlayButton,
} from "~/components/Visualizer";
import { cn } from "~/lib/cn";
import { styled } from "~/stitches.config";

export const ControllableAnimation = () => {
  const progress = useMotionValue(0);
  const y = useTransform(progress, [0, 1], [400, 0], {
    ease: (x) => Math.sin((x * Math.PI) / 2),
  });

  const animateProgress = (duration = 0.5) => {
    progress.set(0);
    animate(progress, 1, { duration, ease: "linear" });
  };

  return (
    <Visualizer>
      <Content
        className="overflow-hidden pt-10"
        style={{ height: 400 }}
      >
        <File>
          <Item style={{ y }}>Hello world!</Item>
        </File>
      </Content>
      <Controls className="p-2">
        <PlayButton
          className="mr-2"
          onClick={() => animateProgress()}
        />
        <Slider
          min={0}
          max={100}
          onValueChange={([value]) => progress.set(value / 100)}
        />
        <ToggleButton
          secondary
          className={cn("ml-2 font-bold text-gray11")}
        >
          0.1x
        </ToggleButton>
        <ToggleButton secondary className="font-bold text-gray11">
          0.5x
        </ToggleButton>
        <ToggleButton secondary className="font-bold text-gray11">
          1x
        </ToggleButton>
        <ToggleButton secondary className="font-bold text-gray11">
          2x
        </ToggleButton>
      </Controls>
    </Visualizer>
  );
};

const File = styled("ul", {
  border: "1px solid $gray8",
  boxShadow: "$md",
  borderRadius: "$base",
  height: 400,
  width: 300,
  margin: "0 auto",
  background: "linear-gradient(45deg, $gray5, $gray4)",
  listStyle: "none",
  padding: "$6 0",
});

const Item = styled(motion.li, {
  margin: "0 -$4",
  padding: "$4",
  background: "linear-gradient(45deg, $gray3, $gray2)",
  borderRadius: 8,
  border: "1px solid $gray8",
  boxShadow: "$sm",
  textAlign: "center",
  fontFamily: "$mono",
});
