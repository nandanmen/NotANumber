"use client";

import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import {
  Content,
  Controls,
  IconButton,
  Visualizer,
} from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { useStepPlayer } from "~/lib/algorithm";
import { cn } from "~/lib/cn";

import { Ruler, RulerText, RulerWrapper } from "../shared/Ruler";
import { SizeExample } from "../size";

export const SizeMeasurements = () => {
  const boxRef = React.useRef<HTMLButtonElement>(null);

  const [step, player] = useStepPlayer(["first", "last"]);
  const [box, setBox] = React.useState<DOMRect | null>(null);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    if (step === "last") {
      const box = boxRef.current?.getBoundingClientRect();
      setBox(box ?? null);
    }
  }, [step]);

  React.useEffect(() => {
    if (step === "first") {
      setKey((key) => key + 1);
    }
  }, [step]);

  return (
    <Wide>
      <Visualizer>
        <Content className="flex h-[300px] items-center" padding="lg">
          <RulerWrapper key={key} style={{ transform: "translateY(-90px)" }}>
            <RulerText>120px</RulerText>
            <Ruler />
          </RulerWrapper>
          <SizeExample toggled={step === "last"} ref={boxRef} layout={false} />
          {step === "last" && (
            <>
              <div
                className={cn(
                  "absolute h-[120px] w-[120px] rounded-md border border-blue8",
                  "bg-[repeating-linear-gradient(-45deg,theme(colors.blue8),theme(colors.blue8)_5px,transparent_5px,transparent_10px)]",
                )}
              />
              <RulerWrapper full style={{ transform: "translateY(90px)" }}>
                <Ruler />
                <RulerText>{box?.width}px</RulerText>
              </RulerWrapper>
            </>
          )}
        </Content>
        <Controls className="items-center">
          <ol className="flex list-none gap-1">
            <li className={cn(step === "first" ? "opacity-100" : "opacity-20")}>
              First
            </li>
            <li className={cn(step === "last" ? "opacity-100" : "opacity-20")}>
              Last
            </li>
          </ol>
          <div className="flex gap-1">
            <IconButton
              onClick={player.prev}
              disabled={player.currentStep === 0}
              secondary
              label="Previous step"
            >
              <FaArrowLeft />
            </IconButton>
            <IconButton
              onClick={player.next}
              disabled={player.currentStep === player.totalSteps - 1}
              secondary
              label="Next step"
            >
              <FaArrowRight />
            </IconButton>
          </div>
        </Controls>
      </Visualizer>
    </Wide>
  );
};
