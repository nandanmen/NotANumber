import React from "react";
import { motion } from "framer-motion";

import { styled } from "~/stitches.config";
import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content as BaseContent,
  Controls as BaseControls,
} from "~/components/Visualizer";
import { Slider } from "~/components/Slider";
import { Checkbox } from "~/components/Checkbox";
import { RiCheckboxBlankFill } from "react-icons/ri";

export const InverseScaleFormula = () => {
  const [corrected, setCorrected] = React.useState(true);
  const [scale, setScale] = React.useState(1);

  return (
    <FullWidth>
      <Visualizer>
        <Content>
          <Square style={{ transform: `scaleX(${scale})` }}>
            <Text style={{ transform: `scaleX(${corrected ? 1 / scale : 1})` }}>
              Hello
              {corrected && (
                <ScaleTooltip
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  css={{ position: "absolute", top: -1, left: "100%" }}
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
        <Controls>
          <Checkbox
            checked={corrected}
            onCheckedChange={() => setCorrected(!corrected)}
            label="Corrected"
          />
          <Slider
            min={0.5}
            max={3}
            value={[scale]}
            onValueChange={([scale]) => setScale(scale)}
            step={0.1}
          />
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const TooltipWrapper = styled("div", {
  position: "absolute",
});

const ScaleTooltip = styled(motion.div, {
  color: "$blue11",
  fontSize: "$sm",
  fontFamily: "$mono",
  background: "$blue1",
  border: "1px solid $blue7",
  padding: "$1",
  whiteSpace: "nowrap",
  marginLeft: "$4",
  lineHeight: 1,

  "&:before": {
    content: '""',
    height: "1px",
    width: "$6",
    background: "$blue7",
    position: "absolute",
    left: "-$6",
    top: -1,
  },
});

const Text = styled("span", {
  background: "$blue4",
  border: "1px solid $blue7",
  padding: "$2",
  position: "relative",
});

const Controls = styled(BaseControls, {
  padding: "$4",
  display: "flex",
  alignItems: "center",
  gap: "$4",
});

const Content = styled(BaseContent, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 220,
});

const Square = styled("div", {
  width: 120,
  height: 120,
  background: "$blue5",
  border: "1px solid $blue7",
  borderRadius: "$base",
  boxShadow: "$sm",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});
