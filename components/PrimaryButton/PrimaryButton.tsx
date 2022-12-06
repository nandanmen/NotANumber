import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import { styled } from "~/stitches.config";

export const PrimaryButton = (
  props: ComponentPropsWithoutRef<typeof _Button>
) => {
  return (
    <Wrapper>
      <Shadow />
      <_Button whileTap={{ x: 2, y: 2 }} {...props} />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  position: "relative",
  width: "fit-content",

  "&:hover": {
    span: {
      transform: "translate(2px, 2px)",
    },
    button: {
      background:
        "linear-gradient(-45deg, var(--gradient-end, $colors$blue6), var(--gradient-start, $colors$blue4))",
      color: "$gray12",
    },
  },
});

const Shadow = styled("span", {
  position: "absolute",
  inset: 0,
  background: "$gray12",
  borderRadius: "$base",
  transition: "all 0.2s ease-out",
  zIndex: -1,
});

const _Button = styled(motion.button, {
  background: "$gray12",
  padding: "$2 $4",
  paddingTop: "calc($space$2 + 2px)",
  borderRadius: "$base",
  border: "1px solid $gray12",
  color: "$gray1",
  fontWeight: "bold",
  cursor: "pointer",
  fontFamily: "$serif",
  transition: "all 0.2s ease-out",
  position: "relative",

  variants: {
    small: {
      true: {
        fontSize: "$sm",
        padding: "$1 $2",
        paddingTop: "calc($space$1 + 2px)",
      },
    },
  },
});
