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
        <motion.div className="relative w-full rounded-md border border-gray8 bg-gray4 p-6">
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
          {debug && (
            <div className="absolute top-2 right-2 text-[0.875rem] font-bold text-gray11">
              {speed}x
            </div>
          )}
        </motion.div>
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
