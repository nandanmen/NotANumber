import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import {
  FaPlay,
  FaUndo,
  FaPause,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import type { AlgorithmContext } from "~/lib/algorithm/types";
import { FullWidth } from "../FullWidth";
import { Slider } from "../Slider";
import { styled, darkTheme } from "~/stitches.config";
import { GridBackground } from "../Grid";

export const Visualizer = ({ fullWidth = false, ...props }) => {
  const Wrapper = fullWidth ? FullWidth : "figure";
  return (
    <Wrapper>
      <_Visualizer {...props} />
    </Wrapper>
  );
};

export const _Visualizer = styled("div", {
  $$border: "1px solid $colors$gray8",

  border: "$$border",
  borderRadius: "$base",
  overflow: "hidden",

  "> :not(:first-child)": {
    borderTop: "$$border",
  },

  [`.${darkTheme} &`]: {
    $$border: "1px solid $colors$gray6",
  },

  variants: {
    row: {
      true: {
        display: "flex",

        "> :not(:first-child)": {
          borderTop: "none",
          borderLeft: "1px solid $gray8",
        },
      },
    },
    childBorders: {
      false: {
        "> :not(:first-child)": {
          border: "initial",
        },
      },
    },
  },
});

type AlgorithmControlsProps = {
  context: AlgorithmContext;
} & ComponentPropsWithoutRef<typeof AlgorithmControlsWrapper>;

export const AlgorithmControls = ({
  context,
  ...props
}: AlgorithmControlsProps) => {
  return (
    <AlgorithmControlsWrapper {...props}>
      <PlayButton onClick={context.toggle} isPlaying={context.isPlaying} />
      <Slider
        min={0}
        max={context.totalSteps - 1}
        value={[context.currentStep]}
        onValueChange={([step]) => context.goTo(step)}
      />
      <IconButton secondary onClick={context.prev}>
        <FaArrowLeft />
      </IconButton>
      <StepCounter>
        <span>{context.currentStep + 1}</span>
        <span>/</span>
        <span>{context.totalSteps}</span>
      </StepCounter>
      <IconButton secondary onClick={context.next}>
        <FaArrowRight />
      </IconButton>
    </AlgorithmControlsWrapper>
  );
};

const StepCounter = styled("p", {
  fontFamily: "$mono",
  display: "flex",
  gap: "$1",
  fontSize: "$sm",
});

export const Controls = styled("div", {
  background: "$gray5",
  position: "relative",
  padding: "$2",
  display: "flex",
  justifyContent: "space-between",

  [`.${darkTheme} &`]: {
    background: "$gray2",
  },
});

const AlgorithmControlsWrapper = styled(Controls, {
  display: "flex",
  alignItems: "center",
  padding: "$2",
  gap: "$2",
});

export const Content = styled(GridBackground, {
  border: "none",
  borderRadius: 0,

  variants: {
    padding: {
      sm: {
        padding: "$4",
      },
      md: {
        padding: "$6",
      },
      lg: {
        padding: "$8",
      },
    },
  },
});

export const ToggleButton = styled(motion.button, {
  border: "1px solid $gray8",
  background: "$gray1",
  padding: "$1 $2",
  borderRadius: 4,
  fontSize: "$sm",

  "&:hover": {
    borderColor: "$gray12",
  },

  "&:disabled": {
    borderColor: "$gray7",
    background: "$gray5",
    color: "$gray11",
    cursor: "not-allowed",
  },

  variants: {
    secondary: {
      true: {
        background: "none",
        border: "none",

        "&:hover": {
          background: "$gray7",
        },

        "&:disabled": {
          color: "$gray8",
          cursor: "not-allowed",
          pointerEvents: "none",
        },
      },
    },
  },
});

export const IconButton = styled(ToggleButton, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$gray10",
  height: 22,
});

export const PlayButton = ({
  isPlaying = false,
  ...props
}: ComponentPropsWithoutRef<typeof IconButton> & { isPlaying?: boolean }) => {
  return (
    <IconButton secondary {...props}>
      {isPlaying ? <FaPause /> : <FaPlay />}
    </IconButton>
  );
};

export const UndoButton = (
  props: ComponentPropsWithoutRef<typeof IconButton>
) => {
  return (
    <IconButton secondary {...props}>
      <FaUndo />
    </IconButton>
  );
};
