import React from "react";
import { motion } from "framer-motion";
import { darkTheme, styled } from "~/stitches.config";

const _caption = `When MyComponent mounts for the first time, its effect will run, printing "mounted" to the console. When we click on "Change Key", MyComponent will rerender, but since the effect has no dependencies, it won't run again!`;

export const CodeQuiz = ({ children, useKey = false, caption = _caption }) => {
  const [showAnswer, setShowAnswer] = React.useState(false);
  return (
    <figure>
      <Wrapper css={{ position: "relative", zIndex: 10 }}>
        <Box
          css={{
            flexGrow: 1,
            padding: "$4",
            display: "flex",
            flexDirection: "column",
            gap: "$4",
            borderTop: "1px solid",
            borderColor: "inherit",
          }}
        >
          <Box as="p" css={{ fontFamily: "$sans", fontWeight: "bold" }}>
            What does the console look like after "Change Key" is pressed?{" "}
          </Box>
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              borderColor: "inherit",
              height: "100%",
              gap: "$4",
            }}
          >
            <AnswerButton
              incorrect={showAnswer && useKey}
              onClick={() => setShowAnswer(true)}
            >
              <Hole>
                <Box
                  as={motion.svg}
                  css={{ flexShrink: 0 }}
                  viewBox="0 0 15 15"
                  width="26"
                  height="26"
                  style={{ x: 2, y: -3 }}
                >
                  {showAnswer && !useKey && (
                    <motion.path
                      d="M 4 8 L 7 10.8 L 12 4"
                      fill="none"
                      stroke="var(--colors-gray12)"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      animate={{ pathLength: 1 }}
                      initial={{ pathLength: 0 }}
                      transition={{ type: "spring", damping: 20 }}
                    />
                  )}
                </Box>
              </Hole>
              <span>mounted</span>
            </AnswerButton>
            <AnswerButton
              incorrect={showAnswer && !useKey}
              onClick={() => setShowAnswer(true)}
            >
              <Hole>
                <Box
                  as={motion.svg}
                  css={{ flexShrink: 0 }}
                  viewBox="0 0 15 15"
                  width="26"
                  height="26"
                  style={{ x: 2, y: -3 }}
                >
                  {showAnswer && useKey && (
                    <motion.path
                      d="M 4 8 L 7 10.8 L 12 4"
                      fill="none"
                      stroke="var(--colors-gray12)"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      animate={{ pathLength: 1 }}
                      initial={{ pathLength: 0 }}
                      transition={{ type: "spring", damping: 20 }}
                    />
                  )}
                </Box>
              </Hole>
              <span>mounted</span>
              <span>unmounted</span>
              <span>mounted</span>
            </AnswerButton>
          </Box>
        </Box>
        {children}
      </Wrapper>
      {showAnswer && (
        <Caption
          animate={{ opacity: 1, y: -8 }}
          initial={{ opacity: 0, y: -24 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {caption}
        </Caption>
      )}
    </figure>
  );
};

const Caption = styled(motion.figcaption, {
  padding: "$4",
  background: "$gray5",
  borderRadius: "$base",
  border: "1px solid $gray8",
  display: "block",

  [`.${darkTheme} &`]: {
    background: "$gray1",
    borderColor: "$gray6",
  },
});

const AnswerButton = styled("button", {
  padding: "$4",
  border: "1px solid",
  borderColor: "inherit",
  background: "$gray3",
  borderRadius: "$base",
  boxShadow: "$md",
  fontFamily: "$mono",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  position: "relative",
  transition: "all 0.3s ease",

  "&:hover": {
    background: "$gray4",
  },

  variants: {
    incorrect: {
      true: {
        opacity: 0.5,
        scale: 0.95,
        boxShadow: "none",
        pointerEvents: "none",
      },
    },
  },
});

const Wrapper = styled("div", {
  display: "flex",
  flexWrap: "wrap-reverse",
  border: "1px solid $gray8",
  borderRadius: "$base",
  position: "relative",
  background: "$gray4",

  [`.${darkTheme} &`]: {
    background: "$gray2",
    borderColor: "$gray6",
  },

  pre: {
    margin: "0 !important",
    padding: "$4 !important",
    border: "none !important",
  },
});

const Hole = styled("div", {
  width: "$6",
  height: "$6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: "$gray2",
  position: "absolute",
  top: "$4",
  right: "$4",
  border: "1px solid",
  borderColor: "inherit",
});

const Box = styled("div", {});
