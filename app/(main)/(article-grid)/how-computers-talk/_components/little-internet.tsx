"use client";

import type { ComponentProps } from "react";
import { useActiveIndex } from "~/components/mdx/scroll-group";
import { useGridSize } from "../../grid-context";
import { Path } from "./connectors";
import { GridCell } from "./grid-cell";
import { Computer, Router } from "./network-devices";

type ComputerCellProps = Omit<ComponentProps<typeof GridCell>, "children"> & {
  label?: string;
  labelColor?: string;
  labelSide?: "left" | "right";
};

export function ComputerCell({
  label,
  labelColor,
  labelSide = "left",
  ...props
}: ComputerCellProps) {
  return (
    <GridCell {...props}>
      <Computer label={label} labelColor={labelColor} labelSide={labelSide} />
    </GridCell>
  );
}

export function LittleInternetScrollVisual() {
  const index = useActiveIndex();
  const { gridSize } = useGridSize();
  return (
    <div className="aspect-square flex items-center justify-center text-gray8">
      {index === 0 && (
        <div className="relative flex">
          <svg
            width="100%"
            height="100%"
            aria-hidden="true"
            className="text-gray8 absolute inset-0"
          >
            <Path x1={2} y1={1} x2={4} y2={1} />
          </svg>
          <ComputerCell margin={{ right: 2 }} />
          <ComputerCell />
        </div>
      )}
      {index === 1 && (
        <div className="relative">
          <svg
            width="100%"
            height="100%"
            aria-hidden="true"
            className="text-gray8 absolute inset-0"
          >
            <Path x1={2} y1={0.8} x2={4} y2={0.8} />
            <Path x1={2} y1={1.2} x2={2.8} y2={3} />
            <Path x1={4} y1={1.2} x2={3.2} y2={3} />
          </svg>
          <div className="flex items-center">
            <ComputerCell
              label="1"
              labelColor="bg-blue9"
              margin={{ right: 2 }}
            />
            <ComputerCell label="2" labelColor="bg-green9" />
          </div>
          <ComputerCell
            label="3"
            labelColor="bg-yellow10"
            margin={{ left: 2, top: 1 }}
          />
        </div>
      )}
      {index === 2 && (
        <div className="relative">
          <svg
            width="100%"
            height="100%"
            aria-hidden="true"
            className="text-gray8 absolute inset-0"
          >
            <defs>
              <mask id="center-cutout">
                <rect width="100%" height="100%" fill="white" />
                {gridSize != null && (
                  <rect
                    x={2.8 * gridSize}
                    y={2 * gridSize}
                    width={0.4 * gridSize}
                    height={1 * gridSize}
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <g mask="url(#center-cutout)">
              <Path x1={1} y1={1} x2={5} y2={4} offset={1} direction="direct" />
              <Path x1={5} y1={1} x2={1} y2={4} offset={1} direction="direct" />
            </g>

            <Path x1={2} y1={0.8} x2={4} y2={0.8} />
            <Path x1={1} y1={2} x2={1} y2={3} />
            <Path x1={2} y1={1.1} x2={2.9} y2={6} />

            <Path x1={5} y1={2} x2={5} y2={3} />
            <Path x1={4} y1={1.1} x2={3.1} y2={6} />

            <Path x1={2} y1={3.8} x2={4} y2={3.8} />
            <Path x1={2} y1={4.1} x2={2.7} y2={6} />

            <Path x1={4} y1={4.1} x2={3.3} y2={6} />
          </svg>
          <div className="flex items-center">
            <ComputerCell
              label="1"
              labelColor="bg-blue9"
              margin={{ right: 2 }}
            />
            <ComputerCell label="2" labelColor="bg-green9" labelSide="right" />
          </div>
          <div className="flex items-center">
            <ComputerCell
              label="3"
              labelColor="bg-yellow10"
              margin={{ right: 2, top: 1 }}
            />
            <ComputerCell
              label="4"
              labelColor="bg-red9"
              margin={{ top: 1 }}
              labelSide="right"
            />
          </div>
          <ComputerCell
            label="5"
            labelColor="bg-cyan9"
            margin={{ left: 2, top: 1 }}
          />
        </div>
      )}
      {index === 3 && (
        <div className="relative">
          <svg
            width="100%"
            height="100%"
            aria-hidden="true"
            className="text-gray8 absolute inset-0"
          >
            <Path x1={2} y1={2} x2={4} y2={4} direction="direct" />
            <Path x1={2} y1={4} x2={4} y2={4} direction="direct" />
            <Path x1={2} y1={6} x2={4} y2={4} direction="direct" />
            <Path x1={8} y1={2} x2={6} y2={4} direction="direct" />
            <Path x1={8} y1={4} x2={6} y2={4} direction="direct" />
            <Path x1={8} y1={6} x2={6} y2={4} direction="direct" />
          </svg>
          <div className="flex items-center">
            <div>
              <ComputerCell label="1" labelColor="bg-blue9" />
              <ComputerCell
                label="3"
                labelColor="bg-yellow10"
                margin={{ top: 1 }}
              />
              <ComputerCell
                label="5"
                labelColor="bg-cyan9"
                margin={{ top: 1 }}
              />
            </div>
            <GridCell margin={{ x: 2 }}>
              <Router />
            </GridCell>
            <div>
              <ComputerCell
                label="2"
                labelColor="bg-green9"
                labelSide="right"
              />
              <ComputerCell
                label="4"
                labelColor="bg-red9"
                labelSide="right"
                margin={{ top: 1 }}
              />
              <ComputerCell
                label="6"
                labelColor="bg-gray9"
                labelSide="right"
                margin={{ top: 1 }}
              />
            </div>
          </div>
        </div>
      )}
      {index === 4 && (
        <div className="relative">
          <svg
            width="100%"
            height="100%"
            aria-hidden="true"
            className="text-gray8 absolute inset-0"
          >
            <Path x1={2} y1={2} x2={3} y2={4} direction="direct" />
            <Path x1={2} y1={4} x2={3} y2={4} direction="direct" />
            <Path x1={2} y1={6} x2={3} y2={4} direction="direct" />

            <Path x1={10} y1={2} x2={9} y2={4} direction="direct" />
            <Path x1={10} y1={4} x2={9} y2={4} direction="direct" />
            <Path x1={10} y1={6} x2={9} y2={4} direction="direct" />

            <Path x1={5} y1={4} x2={7} y2={4} direction="direct" />
          </svg>
          <div className="flex items-center">
            <div>
              <ComputerCell
                label="1"
                labelColor="bg-blue9"
                margin={{ left: 1 }}
              />
              <ComputerCell
                label="2"
                labelColor="bg-green9"
                margin={{ top: 1, right: 1 }}
              />
              <ComputerCell
                label="3"
                labelColor="bg-yellow10"
                margin={{ top: 1, left: 1 }}
              />
            </div>
            <GridCell margin={{ right: 2 }}>
              <Router />
            </GridCell>
            <GridCell>
              <Router />
            </GridCell>
            <div>
              <ComputerCell label="4" labelColor="bg-red9" labelSide="right" />
              <ComputerCell
                label="5"
                labelColor="bg-cyan9"
                labelSide="right"
                margin={{ top: 1, left: 1 }}
              />
              <ComputerCell
                label="6"
                labelColor="bg-gray9"
                labelSide="right"
                margin={{ top: 1 }}
              />
            </div>
          </div>
        </div>
      )}
      {(index === 5 || index === 6) && (
        <div className="relative">
          <svg
            width="100%"
            height="100%"
            aria-hidden="true"
            className="text-gray8 absolute inset-0"
          >
            <Path x1={2} y1={2} x2={3} y2={4} direction="direct" />
            <Path x1={2} y1={4} x2={3} y2={4} direction="direct" />
            <Path x1={2} y1={6} x2={3} y2={4} direction="direct" />

            <Path x1={10} y1={2} x2={9} y2={4} direction="direct" />
            <Path x1={10} y1={4} x2={9} y2={4} direction="direct" />
            <Path x1={10} y1={6} x2={9} y2={4} direction="direct" />

            <Path x1={5} y1={4} x2={7} y2={4} direction="direct" />
          </svg>
          <div className="flex items-center">
            <div>
              <ComputerCell
                label="1.1"
                labelColor="bg-blue9"
                margin={{ left: 1 }}
              />
              <ComputerCell
                label="1.2"
                labelColor="bg-green9"
                margin={{ top: 1, right: 1 }}
              />
              <ComputerCell
                label="1.3"
                labelColor="bg-yellow10"
                margin={{ top: 1, left: 1 }}
              />
            </div>
            <GridCell margin={{ right: 2 }}>
              <Router />
            </GridCell>
            <GridCell>
              <Router />
            </GridCell>
            <div>
              <ComputerCell
                label="2.1"
                labelColor="bg-red9"
                labelSide="right"
              />
              <ComputerCell
                label="2.2"
                labelColor="bg-cyan9"
                labelSide="right"
                margin={{ top: 1, left: 1 }}
              />
              <ComputerCell
                label="2.3"
                labelColor="bg-gray9"
                labelSide="right"
                margin={{ top: 1 }}
              />
            </div>
          </div>
        </div>
      )}
      {index === 7 && (
        <div className="relative">
          <svg
            width="100%"
            height="100%"
            aria-hidden="true"
            className="text-gray8 absolute inset-0"
          >
            <Path x1={2} y1={2} x2={3} y2={4} direction="direct" />
            <Path x1={2} y1={4} x2={3} y2={4} direction="direct" />
            <Path x1={2} y1={6} x2={3} y2={4} direction="direct" />

            <Path x1={10} y1={2} x2={9} y2={4} direction="direct" />
            <Path x1={10} y1={4} x2={9} y2={4} direction="direct" />
            <Path x1={10} y1={6} x2={9} y2={4} direction="direct" />

            <Path x1={5} y1={4} x2={7} y2={4} direction="direct" />
          </svg>
          <div className="flex items-center">
            <div>
              <ComputerCell
                label="1.1"
                labelColor="bg-blue9"
                margin={{ left: 1 }}
              />
              <ComputerCell
                label="1.2"
                labelColor="bg-green9"
                margin={{ top: 1, right: 1 }}
              />
              <ComputerCell
                label="1.3"
                labelColor="bg-yellow10"
                margin={{ top: 1, left: 1 }}
              />
            </div>
            <GridCell margin={{ right: 2 }}>
              <Router />
            </GridCell>
            <GridCell>
              <Router />
            </GridCell>
            <div>
              <ComputerCell
                label="2.1"
                labelColor="bg-red9"
                labelSide="right"
              />
              <ComputerCell
                label="2.2"
                labelColor="bg-cyan9"
                labelSide="right"
                margin={{ top: 1, left: 1 }}
              />
              <ComputerCell
                label="2.3"
                labelColor="bg-gray9"
                labelSide="right"
                margin={{ top: 1 }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
