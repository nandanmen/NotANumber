import type { ReactNode } from "react";
import { cn } from "~/lib/cn";
import type { BaseBranch } from "./types";

export type NodePosition = "center" | "left" | "right";

/**
 * Determines the position of a node in a parallel execution group
 * @param index - Zero-based index of the node
 * @param total - Total number of nodes in the parallel group
 * @returns The position type of the node
 */
export function getNodePosition(
  index: number,
  total: number,
): {
  position: NodePosition;
  middle?: boolean;
  center?: boolean;
} {
  let position: NodePosition = "center";
  const centerIndex = Math.floor(total / 2);
  const isOdd = total % 2 === 1;

  if (total !== 1) {
    if (isOdd && index === centerIndex) position = "center";
    else if (index < centerIndex) position = "left";
    else position = "right";
  }

  let middle = false;
  let center = false;
  switch (position) {
    case "left":
      middle = index > 0;
      center = !isOdd && index === centerIndex - 1;
      break;
    case "right":
      middle = index < total - 1;
      center = !isOdd && index === centerIndex;
      break;
    case "center":
      middle = total > 1;
      break;
  }

  return { position, middle, center };
}

// Base Connector Components

function isSideActive(
  side: "left" | "right" | "middle" | true,
  active?: ConnectorActiveState,
) {
  if (!active) return false;
  if (active === true) return true;
  if (side === true) return false;
  if (Array.isArray(active)) return active.includes(side);
  return false;
}

export function getBranchConnectorActiveState(
  index: number,
  branches: BaseBranch[],
): ConnectorActiveState | undefined {
  const branch = branches[index];
  if (!branch) return;

  const state = [] as ConnectorActiveStateArray;
  if (branch.runtime?.status && branch.runtime.status !== "skipped") {
    state.push("middle");
  }

  const { position } = getNodePosition(index, branches.length);
  const left = branches.slice(0, index);
  const right = branches.slice(index + 1);

  const hasActiveAtLeft = left.some(
    (branch) => branch.runtime?.status && branch.runtime.status !== "skipped",
  );
  const hasActiveAtRight = right.some(
    (branch) => branch.runtime?.status && branch.runtime.status !== "skipped",
  );

  if (position === "center") {
    if (hasActiveAtLeft) {
      state.push("left");
    }
    if (hasActiveAtRight) {
      state.push("right");
    }
  } else if (position === "left" && hasActiveAtLeft) {
    state.push("left");
  } else if (position === "right" && hasActiveAtRight) {
    state.push("right");
  }

  return state.length > 0 ? state : undefined;
}

export function SimpleConnector({
  middle,
  isBottom,
  shrink,
  active,
}: {
  middle?: boolean;
  isBottom?: boolean;
  shrink?: boolean;
  active?: ConnectorActiveState;
}) {
  /**
   * A connector is "middle" if it has connections to the left and right
   * branches.
   */
  if (middle) {
    return (
      <div className="flex flex-col items-center h-(--connector-height) relative w-full text-(--color-connector)">
        <div className="flex relative justify-center grow w-full">
          <div
            className={cn(
              "h-[calc(50%+1px)] border-r-2 border-current w-[calc(50%+1px)] absolute left-0",
              isBottom
                ? "bottom-0 border-t-2 rounded-tr-xl"
                : "border-b-2 rounded-br-xl",
              isSideActive("left", active) &&
                "text-(--color-connector-active) z-10",
            )}
          />
          <div
            className={cn(
              "w-0.5 h-full bg-current",
              isSideActive("middle", active) &&
                "text-(--color-connector-active) z-10",
            )}
          />
          <div
            className={cn(
              "h-[calc(50%+1px)] border-l-2 border-current w-[calc(50%+1px)] absolute right-0",
              isBottom
                ? "bottom-0 border-t-2 rounded-tl-xl"
                : "border-b-2 rounded-bl-xl",
              isSideActive("right", active) &&
                "text-(--color-connector-active) z-10",
            )}
          />
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex flex-col items-center grow",
        !shrink && "h-(--connector-height)",
        isSideActive("middle", active)
          ? "text-(--color-connector-active) z-10"
          : "text-(--color-connector)",
      )}
    >
      <div className="w-0.5 bg-current grow" />
    </div>
  );
}

function TopConnector({
  position,
  middle,
  active,
}: {
  position: "left" | "right";
  middle?: boolean;
  active?: ConnectorActiveState;
}) {
  return (
    <div className="flex flex-col h-(--connector-height) text-(--color-connector) w-full">
      <div
        className={cn(
          "grow relative w-full flex items-end",
          position === "left" && "justify-end",
        )}
      >
        {middle && (
          <div
            className={cn(
              "h-0.5 bg-current absolute top-1/2 w-full -translate-y-1/2",
              position === "right" && "right-0",
              position === "left" && "left-0",
              isSideActive(position, active) &&
                "text-(--color-connector-active) z-10",
            )}
          />
        )}
        <div
          className={cn(
            "h-[calc(50%+1px)] w-[calc(50%+1px)] border-t-2 border-current",
            position === "right" && "border-r-2 rounded-tr-xl",
            position === "left" && "border-l-2 rounded-tl-xl",
            isSideActive("middle", active) &&
              "text-(--color-connector-active) z-10",
          )}
        />
      </div>
    </div>
  );
}

function BottomConnector({
  position,
  middle,
  active,
}: {
  position: "left" | "right";
  middle?: boolean;
  active?: ConnectorActiveState;
}) {
  return (
    <div className="flex flex-col h-(--connector-height) text-(--color-connector) w-full">
      <div
        className={cn(
          "grow relative w-full flex",
          position === "left" && "justify-end",
        )}
      >
        {middle && (
          <div
            className={cn(
              "h-0.5 bg-current absolute top-1/2 w-2/3 -translate-y-1/2",
              position === "right" && "right-0",
              position === "left" && "left-0",
              isSideActive(position, active) &&
                "text-(--color-connector-active) z-10",
            )}
          />
        )}
        <div
          className={cn(
            "h-[calc(50%+1px)] w-[calc(50%+1px)] border-b-2 border-current",
            position === "right" && "border-r-2 rounded-br-xl",
            position === "left" && "border-l-2 rounded-bl-xl",
            isSideActive("middle", active) &&
              "text-(--color-connector-active) z-10",
          )}
        />
      </div>
    </div>
  );
}

// Parallel Node Wrapper Component

type ConnectorActiveStateArray = ("left" | "middle" | "right")[];
type ConnectorActiveState = boolean | ConnectorActiveStateArray;

interface ParallelNodeWrapperProps {
  index: number;
  total: number;
  children: ReactNode;
  active?: {
    top: ConnectorActiveState;
    bottom?: ConnectorActiveState;
  };
  label?: ReactNode;
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs whitespace-nowrap text-muted w-fit mx-auto bg-surface px-1.5 py-0.5 ring ring-black/15 shadow-xs rounded-full">
      {children}
    </div>
  );
}

export function ParallelNodeWrapper({
  label,
  index,
  total,
  children,
  active,
}: ParallelNodeWrapperProps) {
  const { position, middle } = getNodePosition(index, total);
  return (
    <li className="flex flex-col relative min-w-16" key={index}>
      {position === "center" ? (
        <SimpleConnector middle={middle} active={active?.top} />
      ) : (
        <TopConnector
          position={position}
          active={active?.top}
          middle={middle}
        />
      )}
      <div
      /* className={cn(
          label === "try" &&
            "bg-neutral-200/30 border border-black/20 border-dashed rounded-2xl pb-3 mt-3 -mb-3",
        )} */
      >
        {label && (
          <div>
            <Pill>{label}</Pill>
            <div style={{ height: "12px" }}>
              <SimpleConnector active={active?.top} isBottom />
            </div>
          </div>
        )}
        <div className="px-4 flex justify-center">{children}</div>
      </div>
      <SimpleConnector active={active?.bottom} isBottom shrink />
      {position === "center" ? (
        <SimpleConnector isBottom middle={middle} active={active?.bottom} />
      ) : (
        <BottomConnector
          position={position}
          middle={middle}
          active={active?.bottom}
        />
      )}
    </li>
  );
}
