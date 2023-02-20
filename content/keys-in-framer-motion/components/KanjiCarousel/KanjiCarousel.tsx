import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FullWidth } from "~/components/FullWidth";
import { Content, Visualizer } from "~/components/Visualizer";
import { styled, darkTheme } from "~/stitches.config";
import { FaArrowRight } from "react-icons/fa";

const KANJI = ["中", "学", "校"];

export const KanjiCarousel = () => {
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
            padding: "$16",
          }}
        >
          <Box css={{ display: "flex", alignItems: "center" }}>
            <Box
              css={{
                background: "$gray4",
                border: "1px solid $gray8",
                fontSize: "10rem",
                fontWeight: "bold",
                padding: "$6 $12",
                borderRadius: "$base",
                position: "relative",
                overflow: "hidden",

                [`.${darkTheme} &`]: {
                  background: "$gray1",
                  borderColor: "$gray6",
                },
              }}
            >
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={currentIndex}
                  animate={{ x: 0 }}
                  initial={{ x: -300 }}
                  exit={{ x: 300 }}
                  transition={{ type: "spring", damping: 20 }}
                >
                  {KANJI[currentIndex]}
                </motion.p>
              </AnimatePresence>
            </Box>
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
      </Visualizer>
    </FullWidth>
  );
};

const Box = styled("div", {});
