import React from "react";
import { motion } from "framer-motion";
import { darkTheme, styled } from "~/stitches.config";

export const ChangeIndicator = ({ value, children }) => {
  const [state, setState] = React.useState("idle");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true);
    } else {
      setState("active");
      const id = setTimeout(() => setState("idle"), 1000);
      return () => clearTimeout(id);
    }
  }, [value]);

  return (
    <Wrapper
      animate={state}
      variants={{
        active: {
          backgroundColor: "rgba(var(--base-color), 1)",
        },
        idle: {
          backgroundColor: "rgba(var(--base-color), 0)",
        },
      }}
      initial="idle"
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled(motion.span, {
  "--base-color": "255, 255, 255",

  [`.${darkTheme} &`]: {
    "--base-color": "75, 75, 75",
  },
});
