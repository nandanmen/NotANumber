import { motion } from "framer-motion";
import React from "react";
import {
  ExperimentsPage,
  ExperimentWrapper,
  Controls,
  DebugField,
  DebugFieldButton,
} from "~/components/layout/ExperimentsPage";
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
    <ExperimentsPage page="scrambled-text">
      <ExperimentWrapper>
        <AnimationWrapper>
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
      </ExperimentWrapper>
      <Controls
        debug={debug}
        onDebugChange={setDebug}
        onReset={() => setKey(key + 1)}
      >
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
      </Controls>
    </ExperimentsPage>
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

const AnimationWrapper = styled(motion.div, {
  border: "1px solid $gray8",
  background: "$gray4",
  padding: "$6",
  borderRadius: "$base",
  width: "100%",
  position: "relative",
});
