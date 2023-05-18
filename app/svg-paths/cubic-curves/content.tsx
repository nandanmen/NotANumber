"use client";

import React from "react";
import { motion, transform } from "framer-motion";
import { MDX } from "../components/mdx";
import {
  Endpoint,
  PathVisualizer,
  Text,
  toPath,
} from "../components/path-visualizer";
import { StateProvider, useStateContext } from "../components/state-context";
import { useSvgContext } from "../components/svg";
import { VisualWrapper } from "../components/visual-wrapper";
import { PathHoverVisual } from "../components/path-hover-visual";
import { parsePath } from "../utils";

const pillCommands = parsePath("M 5 5 h 5 q 5 2.5 0 5 h -5 q -5 -2.5 0 -5 z");
const pillCommandsCorrected = parsePath(
  "M 5 5 h 5 c 4 0 4 5 0 5 h -5 c -4 0 -4 -5 0 -5 z"
);

export function Content({ content, length }) {
  return (
    <StateProvider initial={{}}>
      <MDX content={content} numSections={length}>
        <VisualWrapper
          components={[
            {
              children: <PathHoverVisual id="pill" commands={pillCommands} />,
              svg: 15,
            },
            {
              children: (
                <PathHoverVisual
                  id="pill-corrected"
                  commands={pillCommandsCorrected}
                />
              ),
              svg: 15,
            },
          ]}
        />
      </MDX>
    </StateProvider>
  );
}

function DraggableEndpoint({
  cx,
  cy,
  onPan,
}: {
  cx: number;
  cy: number;
  onPan: (x: number, y: number) => void;
}) {
  const [active, setActive] = React.useState(false);
  const { size, getRelative } = useSvgContext();
  return (
    <motion.g className="cursor-pointer" whileHover="active">
      <motion.circle
        r={getRelative(1)}
        className="fill-blue9"
        cx={cx}
        cy={cy}
        animate={active && "active"}
        variants={{
          active: {
            r: getRelative(2),
          },
        }}
      />
      <Endpoint
        cx={cx}
        cy={cy}
        onPanStart={() => setActive(true)}
        onPan={(_, info) => {
          const { width, x, y } = document
            .querySelector("[data-x-axis-lines]")
            .getBoundingClientRect();
          const relativeX = info.point.x - x;
          const relativeY =
            info.point.y - y - document.documentElement.scrollTop;
          const transformer = transform([0, width], [0, size]);
          const newX = transformer(relativeX);
          const newY = transformer(relativeY);
          onPan(newX, newY);
        }}
        onPanEnd={() => setActive(false)}
      />
    </motion.g>
  );
}
