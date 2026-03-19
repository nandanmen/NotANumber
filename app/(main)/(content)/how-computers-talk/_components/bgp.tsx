"use client";

import { transitions } from "app/notes/(content)/diagram/_components/workflows/transitions";
import { atom, useAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import { useActiveIndex } from "~/components/mdx/scroll-group";
import { cn } from "~/lib/cn";
import { ToggleButton } from "../../database/_components/toggle-button";
import { useGridSize } from "../../grid-context";
import { GridPath, Path } from "./connectors";
import { GridCell } from "./grid-cell";
import { Computer, Router } from "./network-devices";
import { NetworkDiagram } from "./network-diagram";
import { SequenceList } from "./sequence-list";

const pathFindingStepAtom = atom(-1);

function BGPThreeRoutersDiagram() {
  const scrollIndex = useActiveIndex();
  const [atomIndex, setIndex] = useAtom(pathFindingStepAtom);
  const index = scrollIndex === 1 ? atomIndex : 3;
  const { gridSize } = useGridSize();

  const handleReplay = () => {
    const current = atomIndex;
    flushSync(() => setIndex(current - 1));
    requestAnimationFrame(() => setIndex(current));
  };

  return (
    <div className="w-full h-full relative">
      <div
        className="absolute right-0 z-10 flex items-center justify-center"
        style={{ width: gridSize, height: gridSize, top: gridSize * 2 }}
      >
        <button
          className="size-8 bg-gray4 rounded-full ring-1 ring-black/10 shadow overflow-hidden text-gray10 group"
          type="button"
          onClick={handleReplay}
        >
          <span className="sr-only">Reset</span>
          <span className="bg-gray1 h-full w-full rounded-full -translate-y-0.5 flex items-center justify-center group-hover:bg-gray2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="14"
              aria-hidden="true"
              className="translate-y-0.5"
            >
              <path
                d="M21 12a9 9 0 1 1-2.636-6.364"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 3v6h-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
      <svg
          width="100%"
          height="100%"
          aria-hidden="true"
          className="text-gray8 absolute inset-0 overflow-visible"
        >
          <motion.g
            animate={{ x: index >= 0 ? -2 * gridSize : 0 }}
            transition={transitions.swift}
          >
            <Path
              id="path-1-2"
              x1={5}
              y1={5}
              x2={7}
              y2={5}
              direction="direct"
            />
          </motion.g>
          {index >= 0 && (
            <Path
              id="path-2-3"
              x1={7}
              y1={5}
              x2={9}
              y2={5}
              direction="direct"
            />
          )}
          {index === 1 && (
            <svg
              width={gridSize * 2}
              height={gridSize * 2}
              x={gridSize * 7}
              y={gridSize * 4}
              aria-hidden="true"
            >
              <motion.ellipse
                cx={gridSize * 2 + 14}
                cy={gridSize * 1}
                rx={7}
                ry={4}
                animate={{ x: -2 * gridSize - 16 }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.5,
                  delay: 0.3,
                }}
                fill="currentColor"
              />
            </svg>
          )}
          {index === 2 && (
            <svg
              width={gridSize * 2}
              height={gridSize * 2}
              x={gridSize * 3}
              y={gridSize * 4}
              aria-hidden="true"
            >
              <motion.ellipse
                cx={gridSize * 2 + 14}
                cy={gridSize * 1}
                rx={7}
                ry={4}
                animate={{ x: -2 * gridSize - 16 }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.5,
                  delay: 0.3,
                }}
                fill="currentColor"
              />
            </svg>
          )}
        </svg>
        <motion.div
          animate={{ x: index >= 0 ? -2 * gridSize : 0 }}
          transition={transitions.swift}
        >
          <GridCell id="router-1" x={3} y={4}>
            <Router label={1} />
            {index >= 2 && (
              <GridCell
                width={3.5}
                className="absolute block top-full text-sm"
                id="table-2"
                animate={{ y: -7 }}
                initial={{ y: -40 }}
              >
                <div className="absolute bottom-full z-10 -mb-2 h-[calc(var(--grid-size)/1.5)] text-gray8 flex flex-col items-center left-1/2 -translate-x-1/2">
                  <div className="w-[3px] bg-current grow -mb-1" />
                  <div className="size-2 bg-current rounded-full" />
                </div>
                <motion.div
                  className="ring-1 bg-gray3 p-1 ring-black/10 rounded-md"
                  animate={{ scale: 1, height: 81 }}
                  initial={{ scale: 0, height: 57 }}
                  style={{ originY: "top" }}
                  transition={{
                    scale: transitions.swift,
                    height: { delay: 0.8, ...transitions.swift },
                  }}
                >
                  <ul className="bg-gray1 ring-1 ring-black/10 rounded h-full relative shadow overflow-hidden">
                    <div className="absolute border-r border-borderSoft h-full left-1/2" />
                    <li className="grid grid-cols-2 place-items-center py-0.5 border-b border-borderSoft text-gray10">
                      <p>Address</p>
                      <p>Router</p>
                    </li>
                    <li className="grid grid-cols-2 place-items-center font-mono py-0.5">
                      <p>2.x</p>
                      <p>2</p>
                    </li>
                    <li className="grid grid-cols-2 place-items-center bg-gray3 font-mono py-0.5">
                      <p>3.x</p>
                      <p>2</p>
                    </li>
                  </ul>
                </motion.div>
              </GridCell>
            )}
          </GridCell>
          <GridCell id="router-2" x={7} y={4}>
            <Router label={2} />
            {index >= 1 && (
              <GridCell
                width={3.5}
                className="absolute block top-full text-sm"
                id="table-2"
                animate={{ y: -7 }}
                initial={{ y: -40 }}
              >
                <div className="absolute bottom-full z-10 -mb-2 h-[calc(var(--grid-size)/1.5)] text-gray8 flex flex-col items-center left-1/2 -translate-x-1/2">
                  <div className="w-[3px] bg-current grow -mb-1" />
                  <div className="size-2 bg-current rounded-full" />
                </div>
                <motion.div
                  className="ring-1 bg-gray3 p-1 ring-black/10 rounded-md"
                  animate={{ scale: 1, height: 81 }}
                  initial={{ scale: 0, height: 57 }}
                  style={{ originY: "top" }}
                  transition={{
                    scale: { delay: 0.2, ...transitions.swift },
                    height: { delay: 0.8, ...transitions.swift },
                  }}
                >
                  <ul className="bg-gray1 ring-1 ring-black/10 rounded h-full relative shadow overflow-hidden">
                    <div className="absolute border-r border-borderSoft h-full left-1/2" />
                    <li className="grid grid-cols-2 place-items-center py-0.5 border-b border-borderSoft text-gray10">
                      <p>Address</p>
                      <p>Router</p>
                    </li>
                    <li className="grid grid-cols-2 place-items-center font-mono py-0.5">
                      <p>1.x</p>
                      <p>1</p>
                    </li>
                    <li className="grid grid-cols-2 place-items-center bg-gray3 font-mono py-0.5">
                      <p>3.x</p>
                      <p>3</p>
                    </li>
                  </ul>
                </motion.div>
              </GridCell>
            )}
            <AnimatePresence>
              {index === 2 && (
                <GridCell
                  width={3}
                  height={1}
                  className="absolute bottom-full text-sm text-center font-handwriting"
                  animate={{ scale: 1 }}
                  initial={{ scale: 0 }}
                  exit={{ scale: 0 }}
                  style={{ originY: "bottom" }}
                >
                  <Arrow className="rotate-180 top-full -translate-y-3" />
                  <p>I can process all 3.x addresses!</p>
                </GridCell>
              )}
            </AnimatePresence>
          </GridCell>
        </motion.div>
        {index >= 0 && (
          <GridCell className="relative" x={9} y={4}>
            <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }}>
              <Router label={3} />
            </motion.div>
            <AnimatePresence>
              {index < 2 && (
                <GridCell
                  width={3}
                  height={1}
                  className="absolute top-full text-sm text-center font-handwriting"
                  animate={{ scale: 1 }}
                  initial={{ scale: 0 }}
                  exit={{ scale: 0 }}
                  style={{ originY: "top" }}
                  transition={{ delay: index < 2 ? 0.2 : 0 }}
                >
                  <Arrow />
                  <p>I can process all 3.x addresses!</p>
                </GridCell>
              )}
            </AnimatePresence>
          </GridCell>
        )}
        <div className="fixed bottom-8 flex gap-4">
          {[-1, 0, 1, 2, 3].map((i) => {
            return (
              <ToggleButton
                className="w-8 justify-center bg-gray1"
                type="button"
                onClick={() => setIndex(i)}
                key={i}
              >
                {i}
              </ToggleButton>
            );
          })}
        </div>
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      direction="ltr"
      width="40"
      viewBox="55.77696614329409 3198.7935236361122 86.4412841796875 87.80838049753038"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("absolute bottom-1/2 -translate-y-2", className)}
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
