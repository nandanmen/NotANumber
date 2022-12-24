import React from "react";
import { motion } from "framer-motion";

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
    <motion.span
      animate={state}
      variants={{
        active: {
          backgroundColor: "var(--colors-gray4)",
        },
        idle: {
          backgroundColor: "transparent",
        },
      }}
      initial="idle"
    >
      {children}
    </motion.span>
  );
};
