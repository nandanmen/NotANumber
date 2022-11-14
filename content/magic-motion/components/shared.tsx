import { motion } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa";
import { darkTheme, styled } from "~/stitches.config";
import { IconButton } from "~/components/Visualizer";

const SQUARE_WIDTH = 120;

export const Tooltip = styled(motion.div, {
  position: "relative",
  padding: "$4",
  fontFamily: "$mono",
  background: "$gray2",
  borderRadius: "$base",
  border: "1px solid $gray9",
  boxShadow: "$sm",

  "&:after": {
    content: "",
    width: 10,
    aspectRatio: 1,
    background: "inherit",
    position: "absolute",
    border: "inherit",
    top: "calc(50% - 5px)",
    transform: "rotate(45deg)",
  },

  variants: {
    align: {
      left: {
        "&:after": {
          borderBottom: "none",
          borderLeft: "none",
          right: -6,
        },
      },
      right: {
        "&:after": {
          borderTop: "none",
          borderRight: "none",
          left: -6,
        },
      },
    },
  },
});

export const ContentWrapper = styled("div", {
  position: "relative",
  padding: "$8",
  display: "flex",
  alignItems: "center",
  gap: "$4",

  "@md": {
    padding: "$12",
  },

  variants: {
    toggled: {
      true: {
        justifyContent: "flex-end",
      },
    },
  },
});

export const XLine = styled(motion.div, {
  position: "absolute",
  borderBottom: "1px dashed $gray10",
  width: "100%",
  left: 0,
  top: "50%",

  variants: {
    active: {
      true: {
        borderColor: "$blue10",
      },
    },
  },
});

export const YLine = styled(motion.div, {
  position: "absolute",
  borderLeft: "1px dashed $gray10",
  height: "100%",
  top: 0,
  transform: `translateX(-${SQUARE_WIDTH / 2}px)`,

  variants: {
    active: {
      true: {
        borderColor: "$blue10",
      },
    },
    align: {
      left: {
        transform: `translateX(${SQUARE_WIDTH / 2}px)`,
      },
      right: {
        transform: `translateX(-${SQUARE_WIDTH / 2}px)`,
      },
    },
  },
});

export const Square = styled(motion.button, {
  position: "relative",
  width: SQUARE_WIDTH,
  aspectRatio: 1,
  background: "$blue6",
  borderRadius: "$base",
  border: "1px solid $blue8",
  textAlign: "center",
  color: "$blue11",
  boxShadow: "$sm",

  [`.${darkTheme} &`]: {
    background: "$blue8",
    borderColor: "$blue9",
  },

  "&:hover": {
    borderColor: "$blue10",
  },

  variants: {
    active: {
      true: {
        borderColor: "$blue10",
      },
    },
    outline: {
      true: {
        position: "absolute",
        pointerEvents: "none",
        background: "$gray5",
        borderColor: "$gray8",

        [`.${darkTheme} &`]: {
          background: "$gray4",
          borderColor: "$gray7",
        },
      },
    },
  },
});

export const PositionText = styled("p", {
  color: "$gray11",
  fontFamily: "$mono",
});

export const Controls = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "$3",
});

export const AlignmentText = styled("p", {
  fontFamily: "$mono",
  fontSize: "$sm",
});

// --

type CounterProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export const Counter = ({
  value,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
}: CounterProps) => {
  return (
    <CounterWrapper>
      <IconButton
        secondary
        onClick={() => onChange(Math.max(min, value - step))}
      >
        <FaMinus />
      </IconButton>
      <Value>{value}px</Value>
      <IconButton
        secondary
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <FaPlus />
      </IconButton>
    </CounterWrapper>
  );
};

const CounterWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
});

const Value = styled("div", {
  fontFamily: "$mono",
  color: "$gray11",
});
