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
          backgroundColor: "rgba(255, 255, 255, 1)",
        },
        idle: {
          backgroundColor: "rgba(255, 255, 255, 0)",
        },
      }}
      initial="idle"
    >
      {children}
    </motion.span>
  );
};
