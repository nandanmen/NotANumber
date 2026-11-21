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
      className="[--base-color:255,255,255] dark:[--base-color:75,75,75]"
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
    </motion.span>
  );
};
