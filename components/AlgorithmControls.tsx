import { styled } from "~/stitches.config";
import type { AlgorithmContext } from "~/lib/algorithm/types";

import { Slider } from "./Slider";
import { PlayButton } from "./PlayButton";
import { Row } from "./layout/Row";

type AlgorithmControlsProps = {
  context: AlgorithmContext;
};

export const AlgorithmControls = ({ context }: AlgorithmControlsProps) => {
  return (
    <Controls center="vertical">
      <PlayButton onClick={context.toggle} isPlaying={context.isPlaying} />
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

const Controls = styled(Row, {
  fontFamily: "$mono",
  gap: "$4",
});
