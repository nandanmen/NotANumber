"use client";

import { motion } from "framer-motion";
import React from "react";

import {
  Content,
  Controls,
  ToggleButton,
  Visualizer,
} from "~/components/Visualizer";
import { Wide } from "~/components/mdx/Wide";
import { cn } from "~/lib/cn";

export const LayoutChangeExample = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <Wide>
      <Visualizer>
        <Content padding="md" style={{ height: 220 }}>
          <div className="flex h-full items-center justify-center gap-4">
            <Square />
            <Square active toggled={toggled} />
            <Square />
          </div>
        </Content>
        <Controls>
          <ToggleButton onClick={toggle}>Toggle</ToggleButton>
        </Controls>
      </Visualizer>
    </Wide>
  );
};

export const JustifyContentExample = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <Wide>
      <Visualizer>
        <Content padding="md" style={{ height: 280 }}>
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <p className="font-mono text-sm">
              justify-content: {toggled ? "flex-end" : "flex-start"}
            </p>
            <div
              className={cn(
                "flex max-w-[400px] w-full gap-2 rounded-md border border-gray8 bg-gray7 p-4",
                toggled ? "justify-end" : "justify-start",
              )}
            >
              <Square active layout transition={{ duration: 0.5 }} />
              <Square active layout transition={{ duration: 0.5 }} />
            </div>
          </div>
        </Content>
        <Controls>
          <ToggleButton onClick={toggle}>Toggle</ToggleButton>
        </Controls>
      </Visualizer>
    </Wide>
  );
};

export const TransformExample = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <Wide>
      <Visualizer>
        <Content padding="md" style={{ height: 220 }}>
          <div className="flex h-full items-center justify-center gap-4">
            <Square />
            <TransformSquare active toggled={toggled} />
            <Square />
          </div>
        </Content>
        <Controls>
          <ToggleButton onClick={toggle}>Toggle</ToggleButton>
        </Controls>
      </Visualizer>
    </Wide>
  );
};

function baseSquareClass(active?: boolean) {
  return cn(
    "h-[90px] w-[90px] rounded-md border border-gray8 bg-gray7",
    active && "border-blue8 bg-blue6 shadow-md",
  );
}

function Square({
  active,
  toggled,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div> & {
  active?: boolean;
  toggled?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        baseSquareClass(active),
        toggled && "w-[180px]",
        "transition-[width] duration-500 ease-out",
        className,
      )}
      {...props}
    />
  );
}

function TransformSquare({
  active,
  toggled,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div> & {
  active?: boolean;
  toggled?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        baseSquareClass(active),
        toggled && "scale-x-[2]",
        "origin-center transition-transform duration-500 ease-out",
        className,
      )}
      {...props}
    />
  );
}
