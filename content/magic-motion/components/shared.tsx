import { motion } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa";
import { darkTheme, styled } from "~/stitches.config";

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
  padding: "$12",
  display: "flex",
  alignItems: "center",
  gap: "$4",

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

export const AlignmentText = styled("p", {
  fontFamily: "$mono",
  fontSize: "$sm",
});

export const DynamicIsland = styled(motion.div, {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 10,
  background: "$gray4",
  boxShadow: "$sm",
  padding: "$2",
  borderRadius: "$base",
  border: "1px solid hsla(0, 0%, 0%, 0.2)",
  width: "fit-content",
  margin: "0 auto",
  marginTop: "-$4",
  gap: "$1",
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
