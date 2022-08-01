import { FaPlay, FaPause } from "react-icons/fa";
import { styled } from "~/stitches.config";
import type { AlgorithmContext } from "~/lib/algorithm/types";

import { Slider } from "./Slider";
import { Row } from "./layout/Row";

type AlgorithmControlsProps = {
  context: AlgorithmContext;
};

export const AlgorithmControls = ({ context }: AlgorithmControlsProps) => {
  return (
    <Controls center="vertical">
      <PlayButton
        as="button"
        center="all"
        onClick={context.toggle}
        title={context.isPlaying ? "Pause" : "Play"}
      >
        {context.isPlaying ? <FaPause /> : <FaPlay />}
      </PlayButton>
      <Slider
        min={0}
        max={context.totalSteps - 1}
        value={[context.currentStep]}
        onValueChange={([step]) => context.goTo(step)}
      />
      <Row>
        <p>{context.currentStep + 1}</p>
        <p>/</p>
        <p>{context.totalSteps}</p>
      </Row>
    </Controls>
  );
};

const PlayButton = styled(Row, {
  background: "$blue6",
  border: "1px solid black",
  width: "$8",
  height: "$8",
  borderRadius: 4,
  boxShadow: "$md",
  flexShrink: 0,
  fontSize: "$sm",

  "&:hover": {
    color: "$gray1",
    background: "$blue9",
    border: "2px solid $blue11",
  },
});

const Controls = styled(Row, {
  fontFamily: "$mono",
  gap: "$4",
});
