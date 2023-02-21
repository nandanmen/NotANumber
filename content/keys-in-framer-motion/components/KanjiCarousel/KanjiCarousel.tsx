import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FullWidth } from "~/components/FullWidth";
import {
  Content,
  Controls,
  ToggleButton,
  Visualizer,
} from "~/components/Visualizer";
import { styled, darkTheme } from "~/stitches.config";
import { FaArrowRight } from "react-icons/fa";

const KANJI = ["中", "学", "校"];

export const KanjiViewer = ({ showOverflow, index }) => {
  return (
    <Box
      css={{
        background: "$gray4",
        border: "1px solid $gray8",
        fontSize: "8rem",
        fontWeight: "bold",
        padding: "$4 0",
        borderRadius: "$base",
        position: "relative",
        overflow: showOverflow ? undefined : "hidden",
        width: 200,
        textAlign: "center",

        [`.${darkTheme} &`]: {
          background: "$gray1",
          borderColor: "$gray6",
        },
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.p
          key={index}
          animate={{ x: 0 }}
          initial={{ x: -200 }}
          exit={{ x: 200 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {KANJI[index]}
        </motion.p>
      </AnimatePresence>
    </Box>
  );
};

export const KanjiCarousel = () => {
  const [hasOverflow, toggle] = React.useReducer((state) => !state, false);
  const [currentIndex, next] = React.useReducer((index) => {
    return index === KANJI.length - 1 ? 0 : index + 1;
  }, 0);

  return (
    <FullWidth>
      <Visualizer>
        <Content
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "$16 0",
          }}
        >
          <Box css={{ display: "flex", alignItems: "center" }}>
            <KanjiViewer showOverflow={hasOverflow} index={currentIndex} />
            <Box
              as="button"
              onClick={next}
              css={{
                aspectRatio: 1,
                background: "$gray2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "$3",
                borderRadius: "50%",
                border: "1px solid $gray8",
                boxShadow: "$md",
                transform: "translateX(-14px)",

                "&:focus-visible, &:hover": {
                  outline: "3px solid $gray8",
                },

                [`.${darkTheme} &`]: {
                  background: "$gray2",
                },
              }}
            >
              <FaArrowRight size="1.5rem" />
            </Box>
          </Box>
        </Content>
        <Controls css={{ justifyContent: "center" }}>
          <ToggleButton onClick={toggle}>
            {hasOverflow ? "Hide" : "Show"} Overflow
          </ToggleButton>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const Box = styled("div", {});
