import React from "react";
import { PathPlayground } from "~/components/PathPlayground";
import { parse } from "~/components/PathVisualizer";
import { styled } from "~/stitches.config";
import useInterval from "@use-it/interval";

export const InteractivePathPlayground = ({
  commands,
  size = 24,
  step = 4,
}) => {
  const [playing, setPlaying] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const _commands = parse(commands);

  useInterval(
    () => {
      if (activeIndex < _commands.length - 1) {
        setActiveIndex(activeIndex + 1);
      } else {
        setPlaying(false);
      }
    },
    playing ? 1000 : null
  );

  return (
    <Wrapper>
      <PathPlayground
        commands={_commands}
        size={size}
        step={step}
        activeIndex={activeIndex}
      />
      <Controls>
        <button onClick={() => setPlaying(true)}>Play</button>
        <button onClick={() => setActiveIndex(-1)}>Reset</button>
      </Controls>
    </Wrapper>
  );
};

const Controls = styled("div", {
  position: "absolute",
  bottom: 0,
});

const Wrapper = styled("div", {
  width: "100%",
  height: "100%",
  position: "relative",
});
