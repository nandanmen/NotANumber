import { motion } from "framer-motion";
import { ComponentPropsWithoutRef } from "react";
import { FaPlay, FaUndo, FaPause } from "react-icons/fa";
import { styled } from "~/stitches.config";
import { GridBackground } from "../Grid";

export const Visualizer = styled("div", {
  border: "1px solid $gray8",
  borderRadius: "$base",
  overflow: "hidden",

  "> :not(:first-child)": {
    borderTop: "1px solid $gray8",
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

export const Controls = styled("div", {
  background: "$gray5",
  position: "relative",
  padding: "$2",
  display: "flex",
  justifyContent: "space-between",
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
