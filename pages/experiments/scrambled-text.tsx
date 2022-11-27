import { motion } from "framer-motion";
import React from "react";
import { Content, ToggleButton, UndoButton } from "~/components/Visualizer";
import {
  TextScrambleWindow,
  ClientOnly,
} from "~/experiments/TextLoadAnimation";
import { styled } from "~/stitches.config";

const speeds = [0.1, 0.25, 0.5, 1];

export default function ScrambledTextPage() {
  const [key, setKey] = React.useState(0);
  const [debug, setDebug] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [mono, setMono] = React.useState(false);

  React.useEffect(() => {
    if (!debug) {
      setSpeed(1);
    }
  }, [debug]);

  return (
    <Wrapper>
      <ContentWrapper>
        <AnimationWrapper layout>
          <ClientOnly>
            <TextScrambleWindow
              key={key}
              debug={debug}
              speed={speed}
              mono={mono}
            >
              Fast, unstyled, composable command menu for React
            </TextScrambleWindow>
          </ClientOnly>
          {debug && <CurrentSpeed>{speed}x</CurrentSpeed>}
        </AnimationWrapper>
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
                <span>Speed</span>
                {speeds.map((currSpeed) => (
                  <DebugFieldButton
                    key={currSpeed}
                    onClick={() => setSpeed(currSpeed)}
                    active={speed === currSpeed}
                  >
                    {currSpeed}x
                  </DebugFieldButton>
                ))}
              </DebugField>
              <DebugField>
                <span>Font</span>
                <DebugFieldButton onClick={() => setMono(false)} active={!mono}>
                  Sans
                </DebugFieldButton>
                <DebugFieldButton onClick={() => setMono(true)} active={mono}>
                  Mono
                </DebugFieldButton>
              </DebugField>
            </DebugControls>
          )}
        </Controls>
      </ContentWrapper>
    </Wrapper>
  );
}

const CurrentSpeed = styled("div", {
  position: "absolute",
  top: "$2",
  right: "$2",
  fontSize: "$sm",
  color: "$gray11",
  fontWeight: "bold",
});

const DebugField = styled("div", {
  display: "flex",
  fontFamily: "$mono",

  "&:not(:last-child)": {
    marginBottom: "$2",
  },

  span: {
    marginRight: "auto",
    fontWeight: "bold",
    color: "$gray10",
  },
});

const DebugFieldButton = styled("button", {
  padding: "$1",
  borderRadius: 2,

  "&:hover": {
    background: "$gray8",
  },

  variants: {
    active: {
      true: {
        background: "$gray8",
      },
    },
  },
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

const AnimationWrapper = styled(motion.div, {
  border: "1px solid $gray8",
  background: "$gray4",
  padding: "$6",
  borderRadius: "$base",
  width: "100%",
  position: "relative",
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
