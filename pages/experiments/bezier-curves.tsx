import { motion } from "framer-motion";
import React from "react";
import produce from "immer";
import { Content, ToggleButton, UndoButton } from "~/components/Visualizer";
import { BezierCurveQuiz } from "~/experiments/BezierCurveQuiz";
import { ButtonSlider } from "~/experiments/EasingFunctionSandbox";
import { styled } from "~/stitches.config";

export default function ScrambledTextPage() {
  const [key, setKey] = React.useState(0);
  const [easing, setEasing] = React.useState([0.62, 0, 0.18, 1]);
  const [debug, setDebug] = React.useState(false);

  const handleEasingPan = (index: number) => (value: number) => {
    if (!(index % 2)) {
      value = Math.max(0, Math.min(1, value));
    }
    if (value === easing[index]) return;
    setEasing((_easing) =>
      produce(_easing, (draft) => {
        draft[index] = value;
      })
    );
  };

  return (
    <Wrapper>
      <ContentWrapper>
        <QuizWrapper layout>
          <BezierCurveQuiz exampleEasing={easing} debug={debug} />
        </QuizWrapper>
        <Controls layout style={{ borderRadius: "12px" }}>
          <ControlHeader layout>
            <DebugButton
              layout
              onClick={() => setDebug(!debug)}
              secondary
              active={debug}
              css={{
                fontWeight: "bold",
                fontFamily: "$mono",
                color: "$gray10",
              }}
            >
              Debug
            </DebugButton>
            <UndoButton layout onClick={() => setKey(key + 1)} />
          </ControlHeader>
          {debug && (
            <DebugControls>
              <DebugField>
                <span>Easing</span>
                <Stack css={{ gap: "$1" }}>
                  {easing.map((value, index) => {
                    return (
                      <ButtonSlider
                        key={index}
                        onValueChange={handleEasingPan(index)}
                        value={value}
                        css={{
                          "--text-color": "var(--colors-gray11)",
                          "--active-color": "var(--colors-gray8)",
                          padding: "$1",
                          background: "$gray3",
                          borderRadius: 4,
                        }}
                      />
                    );
                  })}
                </Stack>
              </DebugField>
            </DebugControls>
          )}
        </Controls>
      </ContentWrapper>
    </Wrapper>
  );
}

const Stack = styled("div", {
  display: "flex",
});

const QuizWrapper = styled(motion.div, {
  background: "$gray4",
});

const DebugField = styled("div", {
  display: "flex",
  fontFamily: "$mono",
  color: "$gray11",
  fontWeight: "bold",
  alignItems: "center",
  justifyContent: "space-between",
});

const ControlHeader = styled(motion.div, {
  display: "flex",
  justifyContent: "space-between",
  gap: "$8",
});

const Wrapper = styled("div", {
  margin: "-$16 0",
  height: "100vh",
});

const ContentWrapper = styled(Content, {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "$16",
});

const Controls = styled(motion.div, {
  border: "1px solid $gray8",
  boxShadow: "$md",
  background: "$gray3",
  margin: "$8 auto",
  padding: "$4",
});

const DebugControls = styled(motion.div, {
  minWidth: 300,
  background: "$gray5",
  padding: "$4",
  borderRadius: 4,
  borderTopLeftRadius: 0,
});

const DebugButton = styled(ToggleButton, {
  variants: {
    active: {
      true: {
        background: "$gray5",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
  },
});
