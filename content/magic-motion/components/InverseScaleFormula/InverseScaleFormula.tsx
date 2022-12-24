import React from "react";
import { motion } from "framer-motion";

import { darkTheme, styled } from "~/stitches.config";
import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content as VisualizerContent,
  Controls,
  PlayButton,
  UndoButton,
} from "~/components/Visualizer";
import { Checkbox } from "~/components/Checkbox";
import useInterval from "@use-it/interval";

type InverseScaleFormulaProps = {
  corrected: boolean;
  scale: number;
};

export const InverseScaleFormula = ({
  corrected,
  scale,
}: InverseScaleFormulaProps) => {
  return (
    <Content>
      <Square style={{ transform: `scaleX(${scale})` }}>
        <Text style={{ transform: `scaleX(${corrected ? 1 / scale : 1})` }}>
          Hello
          {corrected && (
            <ScaleTooltip
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              css={{ position: "absolute", top: -1, left: "100%" }}
              secondary
            >
              scaleX: {(1 / scale).toFixed(2)}
            </ScaleTooltip>
          )}
        </Text>
      </Square>
      <TooltipWrapper
        style={{ transform: `translate(${60 * scale}px, -60px)` }}
      >
        <ScaleTooltip css={{ transform: `translate(50%, 50%)` }}>
          scaleX: {scale.toFixed(2)}
        </ScaleTooltip>
      </TooltipWrapper>
    </Content>
  );
};

const Content = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
});

const TooltipWrapper = styled("div", {
  position: "absolute",
});

const ScaleTooltip = styled(motion.div, {
  $$borderColor: "$colors$blue8",

  color: "$blue11",
  fontSize: "$sm",
  fontFamily: "$mono",
  background: "$blue1",
  border: "1px solid $$borderColor",
  padding: "$1",
  whiteSpace: "nowrap",
  marginLeft: "$4",
  lineHeight: 1,

  [`.${darkTheme} &`]: {
    background: "$blueDark3",
    color: "$blueDark11",
    $$borderColor: "$colors$blueDark10",
  },

  "&:before": {
    content: '""',
    height: "1px",
    width: "$6",
    background: "$$borderColor",
    position: "absolute",
    left: "-$6",
    top: -1,
  },

  variants: {
    secondary: {
      true: {
        color: "$yellow11",
        background: "$yellow1",
        $$borderColor: "$colors$yellow7",

        [`.${darkTheme} &`]: {
          background: "$yellowDark3",
          color: "$yellowDark11",
          $$borderColor: "$colors$yellowDark10",
        },
      },
    },
  },
});

const Text = styled("span", {
  background: "$yellow4",
  border: "1px solid $yellow7",
  padding: "$2",
  position: "relative",

  [`.${darkTheme} &`]: {
    background: "$yellowDark8",
    color: "$yellowDark12",
    border: "1px solid $yellowDark10",
  },
});

const Square = styled("div", {
  width: 120,
  height: 120,
  background: "$blue6",
  border: "1px solid $blue8",
  borderRadius: "$base",
  boxShadow: "$sm",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",

  [`.${darkTheme} &`]: {
    background: "$blueDark8",
    border: "1px solid $blueDark10",
  },
});

// --

export const InverseScaleFormulaSandbox = () => {
  const [corrected, setCorrected] = React.useState(true);
  const [scale, setScale] = React.useState(1);
  const [playing, setPlaying] = React.useState(false);

  useInterval(
    () => {
      if (scale < 3) {
        setScale(scale + 0.1);
      } else {
        setPlaying(false);
      }
    },
    playing ? 100 : null
  );

  return (
    <FullWidth>
      <Visualizer>
        <VisualizerContent css={{ height: 220 }}>
          <InverseScaleFormula corrected={corrected} scale={scale} />
        </VisualizerContent>
        <Controls>
          <PlayButton onClick={() => setPlaying(true)} />
          <Checkbox
            checked={corrected}
            onCheckedChange={() => setCorrected(!corrected)}
            label="Corrected"
          />
          <UndoButton
            onClick={() => {
              setPlaying(false);
              setScale(1);
            }}
          />
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};
