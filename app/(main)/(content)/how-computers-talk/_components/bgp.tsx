"use client";

import { atom, useAtom, useAtomValue } from "jotai";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useActiveIndex } from "~/components/mdx/scroll-group";
import { useGridSize } from "../../grid-context";
import { GridPath, Path } from "./connectors";
import { GridCell } from "./grid-cell";
import { Computer, Router } from "./network-devices";
import { NetworkDiagram } from "./network-diagram";
import { SequenceList } from "./sequence-list";

const pathFindingStepAtom = atom(1);

function BGPThreeRoutersDiagram() {
  const index = useAtomValue(pathFindingStepAtom);
  const { gridSize } = useGridSize();
  return (
    <div className="w-full h-full relative">
      <svg
        width="100%"
        height="100%"
        aria-hidden="true"
        className="text-gray8 absolute inset-0 overflow-visible"
      >
        <Path
          offset={{ x: index > 0 ? 0 : 2 }}
          x1={3}
          y1={5}
          x2={5}
          y2={5}
          direction="direct"
        />
        {index > 0 && <Path x1={7} y1={5} x2={9} y2={5} direction="direct" />}
        {index > 0 && (
          <svg
            width={gridSize * 2}
            height={gridSize * 2}
            x={gridSize * 7}
            y={gridSize * 4}
            aria-hidden="true"
          >
            <motion.ellipse
              cx={gridSize * 2 + 4}
              cy={gridSize * 1}
              animate={{ x: gridSize * -2 - 8 }}
              transition={{
                delay: 0.25,
                type: "tween",
                duration: 0.75,
                ease: "easeInOut",
              }}
              rx={7}
              ry={4}
              fill="currentColor"
            />
          </svg>
        )}
      </svg>
      <GridCell x={index > 0 ? 1 : 3} y={4}>
        <Router label={1} />
      </GridCell>
      <GridCell x={index > 0 ? 5 : 7} y={4}>
        <Router label={2} />
      </GridCell>
      {index > 0 && (
        <GridCell className="relative" x={9} y={4}>
          <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }}>
            <Router label={3} />
          </motion.div>
          <GridCell
            width={3}
            height={1}
            className="absolute top-full text-sm text-center font-handwriting"
            animate={{ scale: 1 }}
            initial={{ scale: 0 }}
            style={{ originY: "top" }}
            transition={{ delay: 0.2 }}
          >
            <Arrow />
            <p>I can process all 3.x addresses!</p>
          </GridCell>
        </GridCell>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      direction="ltr"
      width="40"
      viewBox="55.77696614329409 3198.7935236361122 86.4412841796875 87.80838049753038"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="absolute bottom-1/2 -translate-y-2"
    >
      <g transform="matrix(1, 0, 0, 1, 87.777, 3254.0538)" opacity="1">
        <g transform="scale(0.8)">
          <path
            d="M-2.7699,-1.0727 T-2.3151,-2.2574 -1.2733,-4.7626 1.1081,-9.3037 3.5666,-13.8542 5.2078,-17.2538 6.7593,-20.7454 8.174,-23.6941 9.0141,-25.221 A3.2117,3.2117 0 0 1 14.0803,-21.2722 T13.4157,-20.4526 11.9543,-18.1925 10.0697,-14.7656 8.2848,-11.4188 6.7054,-8.0486 4.7584,-3.6651 3.2316,-0.1093 2.7699,1.0727 A2.9704,2.9704 0 0 1 -2.7699,-1.0727 ZM14.5469,-24.3941 T15.0903,-23.1062 16.5289,-19.7768 18.0468,-16.2915 19.3101,-13.427 20.9149,-10.0777 22.6672,-6.4752 24.4273,-2.8246 25.3993,-0.848 A3.271,3.271 0 0 1 19.4832,1.9442 T19.1224,1.1534 18.2075,-0.9419 16.9744,-3.8509 15.3755,-7.3951 13.7232,-10.7386 12.2377,-13.5862 10.5068,-17.1492 9.0381,-20.6838 8.5475,-22.0991 A3.2117,3.2117 0 0 1 14.5469,-24.3941 Z"
            strokeLinecap="round"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
}

export function BGPPathFindingSequenceList({
  children,
}: { children: ReactNode }) {
  const [step, setStep] = useAtom(pathFindingStepAtom);
  return (
    <SequenceList index={step} onIndexChange={setStep}>
      {children}
    </SequenceList>
  );
}

export function BGPScrollVisual() {
  const activeIndex = useActiveIndex();
  return (
    <div className="aspect-square">
      {activeIndex === 0 && (
        <NetworkDiagram
          nodes={[
            {
              x: 1,
              y: 1,
              content: <Computer label="1.1" labelColor="bg-blue9" />,
            },
            { x: 1, y: 4, content: <Router label={1} /> },
            { x: 5, y: 4, content: <Router label={2} /> },
            { x: 9, y: 4, content: <Router label={3} /> },
            {
              x: 9,
              y: 7,
              content: <Computer label="3.1" labelColor="bg-yellow10" />,
            },
          ]}
          edges={[
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
          ]}
        />
      )}
      {(activeIndex === 1 || activeIndex === 2) && <BGPThreeRoutersDiagram />}
      {activeIndex === 3 && (
        <NetworkDiagram
          nodes={[
            { x: 1, y: 4, content: <Router label={1} /> },
            { x: 5, y: 4, content: <Router label={2} /> },
            { x: 9, y: 4, content: <Router label={3} /> },
          ]}
          edges={[
            [0, 1],
            [1, 2],
          ]}
        >
          <GridPath
            points={[
              [2, 6],
              [2, 7],
              [10, 7],
              [10, 6],
            ]}
          />
        </NetworkDiagram>
      )}
    </div>
  );
}
