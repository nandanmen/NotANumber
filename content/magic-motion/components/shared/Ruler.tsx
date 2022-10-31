import React from "react";
import { motion } from "framer-motion";

import { styled, keyframes } from "~/stitches.config";

export const Ruler = () => {
  const [toggled, setToggled] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setToggled(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Measurement toggled={toggled}>
      <Bar layout transition={{ duration: 0.5 }} />
      <Bar layout transition={{ duration: 0.5 }} />
      <Line
        animate={{ scaleX: toggled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        initial={{ scaleX: 0 }}
      />
    </Measurement>
  );
};

export const RulerWrapper = styled("div", {
  width: 120,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "absolute",

  variants: {
    full: {
      true: {
        width: "calc(100% - $space$8 * 2)",
      },
    },
  },
});

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const RulerText = styled(motion.p, {
  fontFamily: "$mono",
  color: "$gray11",
  fontSize: "$sm",
  opacity: 0,
  animationName: `${fadeIn}`,
  animationDuration: "500ms",
  animationFillMode: "forwards",
  animationTimingFunction: "ease-out",
});

const Line = styled(motion.div, {
  height: 2,
  width: "100%",
  background: "$gray9",
  position: "absolute",
  top: 4,
});

const Bar = styled(motion.div, {
  height: 10,
  width: 2,
  background: "$gray9",
});

const Measurement = styled("div", {
  display: "flex",
  justifyContent: "center",
  position: "relative",
  width: "100%",

  variants: {
    toggled: {
      true: {
        justifyContent: "space-between",
      },
    },
  },
});
