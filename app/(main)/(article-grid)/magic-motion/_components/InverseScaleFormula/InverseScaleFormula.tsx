"use client";

import useInterval from "@use-it/interval";
import { motion } from "framer-motion";
import React from "react";

import { Checkbox } from "~/components/Checkbox";
import {
  Controls,
  PlayButton,
  UndoButton,
  Visualizer,
  Content as VisualizerContent,
} from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { cn } from "~/lib/cn";

type InverseScaleFormulaProps = {
  corrected: boolean;
  scale: number;
};

export const InverseScaleFormula = ({
  corrected,
  scale,
}: InverseScaleFormulaProps) => {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div
        className="relative flex h-[120px] w-[120px] items-center justify-center rounded-md border border-blue8 bg-blue6 shadow-sm"
        style={{ transform: `scaleX(${scale})` }}
      >
        <span
          className="relative border border-yellow7 bg-yellow4 px-2 py-0.5"
          style={{ transform: `scaleX(${corrected ? 1 / scale : 1})` }}
        >
          Hello
          {corrected && (
            <ScaleTooltip
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute -top-px left-full"
              secondary
            >
              scaleX: {(1 / scale).toFixed(2)}
            </ScaleTooltip>
          )}
        </span>
      </div>
      <div
        className="absolute"
        style={{ transform: `translate(${60 * scale}px, -60px)` }}
      >
        <ScaleTooltip className="translate-x-1/2 translate-y-1/2">
          scaleX: {scale.toFixed(2)}
        </ScaleTooltip>
      </div>
    </div>
  );
};

function ScaleTooltip({
  secondary,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div> & {
  secondary?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "relative ml-4 whitespace-nowrap border px-1 py-0 font-mono text-sm leading-none",
        "before:absolute before:-left-6 before:top-[-1px] before:h-px before:w-6 before:content-['']",
        secondary
          ? "border-yellow7 bg-yellow1 text-yellow11 before:bg-yellow7"
          : "border-blue8 bg-blue1 text-blue11 before:bg-blue8",
        className,
      )}
      {...props}
    />
  );
}

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
    playing ? 100 : null,
  );

  return (
    <Wide>
      <Visualizer>
        <VisualizerContent style={{ height: 220 }}>
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
    </Wide>
  );
};
