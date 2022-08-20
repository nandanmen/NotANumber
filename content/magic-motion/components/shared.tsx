import { motion } from "framer-motion";
import { darkTheme, styled } from "~/stitches.config";

const SQUARE_WIDTH = 120;

export const Tooltip = styled(motion.div, {
  position: "relative",
  padding: "$4",
  fontFamily: "$mono",
  background: "$gray2",
  borderRadius: "$base",
  border: "1px solid $gray9",
  boxShadow: "$md",

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
  background: "$blue5",
  borderRadius: "$base",
  border: "1px solid $blue7",
  textAlign: "center",
  color: "$blue11",

  [`.${darkTheme} &`]: {
    background: "$blue7",
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
  alignItems: "flex-end",
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
});

export const AlignmentText = styled("p", {
  fontFamily: "$mono",
});
