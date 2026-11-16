"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  type CSSProperties,
  type ComponentPropsWithoutRef,
  Fragment,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "~/lib/cn";
import {
  ParallelNodeWrapper,
  SimpleConnector,
  getBranchConnectorActiveState,
} from "./connectors";
import { populateRuntimeState } from "./runtime-utils";
import { Step as RuntimeStep, StepWrapper } from "./step";
import { transitions } from "./transitions";
import type {
  BaseBranch,
  FunctionCall,
  FunctionDef,
  IfNode,
  LoopNode,
  Node,
  ParallelNode,
  RuntimeStatus,
  StepNode,
  StepState,
  TryNode,
  WorkflowEntrypoint,
} from "./types";

function CaretDownIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17.2929 8.79289C17.6834 8.40237 18.3164 8.40237 18.707 8.79289C19.0975 9.18342 19.0975 9.81643 18.707 10.207L12.707 16.207C12.3164 16.5975 11.6834 16.5975 11.2929 16.207L5.29289 10.207C4.90237 9.81643 4.90237 9.18342 5.29289 8.79289C5.68342 8.40237 6.31643 8.40237 6.70696 8.79289L11.9999 14.0859L17.2929 8.79289Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Button({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(
        "bg-gray1 flex items-center gap-2 rounded-md px-2 py-1",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Context to pass functions map down the tree
const FunctionsContext = createContext<Record<string, FunctionDef>>({});

function ExpandableStep({
  trigger,
  children,
  open,
  showFooter = false,
}: {
  trigger: ReactNode;
  children: ReactNode;
  open: boolean;
  showFooter?: boolean;
}) {
  const expanded = open;

  const [containerBox, setContainerBox] = useState<
    { width: number; height: number } | undefined
  >();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const containerBox = containerRef.current?.getBoundingClientRect();
    // we need this in a useEffect because we have to wait for the element to mount
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-initialize-state
    setContainerBox({ width: containerBox.width, height: containerBox.height });
  }, []);

  return (
    <div>
      <div className="relative flex flex-col-reverse items-center">
        <motion.div
          ref={containerRef}
          className={cn(
            "overflow-hidden border border-neutral-300 dark:border-neutral-600 border-dashed rounded-2xl bg-neutral-200/30 dark:bg-neutral-800/30 flex items-start justify-center",
            containerBox
              ? "relative"
              : "absolute -inset-[9px] -bottom-[3px] -top-1",
          )}
          animate={
            containerBox
              ? expanded
                ? {
                    height: "auto",
                    width: "auto",
                    marginTop: -16,
                  }
                : {
                    ...containerBox,
                    marginTop: -containerBox.height + 3,
                  }
              : false
          }
          transition={transitions.swift}
          aria-hidden={!expanded}
        >
          <AnimatePresence>
            {expanded && (
              <motion.div
                ref={contentRef}
                className="flex flex-col items-center w-max pb-4 px-5"
                style={{ "--connector-height": "40px" } as CSSProperties}
                exit={{ opacity: 0 }}
                transition={transitions.swift}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {trigger}
      </div>
      {showFooter && (
        <motion.div
          animate={{
            marginTop: expanded ? -29 : containerBox ? -15 : -6,
          }}
          initial={{ marginTop: -6 }}
          transition={transitions.swift}
          className="size-3 border border-neutral-300 bg-surface rounded relative z-10 mx-auto"
        />
      )}
    </div>
  );
}

function WorkflowFunctionNode({
  node,
  functionDef,
  status,
}: {
  node: FunctionCall;
  functionDef: FunctionDef;
  status?: RuntimeStatus;
}) {
  const isSkipped = !status || status === "skipped";
  const [expanded, setExpanded] = useState(false);
  return (
    <ExpandableStep
      trigger={
        <StepWrapper
          type="function call"
          variant={status ? (isSkipped ? "skipped" : "default") : "static"}
        >
          <Button
            className="w-full h-[35px] rounded-t-none gap-2.5"
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="grow flex items-center gap-2">
              <span className="font-mono">{node.name}()</span>
              <span className="text-xs rounded bg-neutral-500 text-white w-4 h-4 shrink-0">
                {functionDef.nodes.length}
              </span>
            </span>
            <span className="flex items-center justify-center border-l border-color -mr-3 w-8 h-full">
              <motion.span
                className="flex items-center justify-center"
                animate={{
                  rotate: expanded ? 180 : 0,
                }}
                transition={transitions.swift}
              >
                <CaretDownIcon size={16} />
              </motion.span>
            </span>
          </Button>
        </StepWrapper>
      }
      open={expanded}
      showFooter
    >
      <WorkflowNodeList showFirst nodes={node.nodes || functionDef.nodes} />
    </ExpandableStep>
  );
}

const isNodeParallel = (node?: Node): boolean => {
  if (!node) return false;
  if (isStepNode(node)) return false;
  if (node.type === "loop") return false;
  if (["parallel", "if", "switch"].includes(node.type)) return true;
  if (node.type === "try") {
    return !node.finally_block;
  }
  if ("nodes" in node) {
    const lastNode = node.nodes?.at(-1);
    return isNodeParallel(lastNode);
  }
  return false;
};

function WorkflowNodeList({
  showFirst = false,
  nodes,
}: {
  showFirst?: boolean;
  nodes: Node[];
}) {
  if (!nodes.length) return null;
  return (
    <ul className="list-none ml-0 flex flex-col items-center">
      {nodes.map((node, index) => {
        const before = nodes[index - 1];

        const isParallel = isNodeParallel(node);
        const isBeforeParallel = isNodeParallel(before);
        const showConnector =
          showFirst || (before && !isParallel && !isBeforeParallel);

        return (
          <Fragment key={index}>
            {showConnector && (
              <SimpleConnector
                active={
                  node.runtime?.status && node.runtime.status !== "skipped"
                }
              />
            )}
            <li>
              <WorkflowNode node={node} />
            </li>
          </Fragment>
        );
      })}
    </ul>
  );
}

function ParallelBranches({
  branches,
}: {
  branches: (BaseBranch & { label?: ReactNode })[];
}) {
  const len = branches.length;

  if (len % 2 === 0) {
    return (
      <ul className="flex relative">
        <div className="absolute left-1/2 -translate-x-1/2 h-(--connector-height) flex z-10">
          <div className="absolute h-0.5 bottom-[calc(50%-1px)] w-full bg-neutral-100" />
          <div className="relative w-4 h-[calc(50%+1px)] border-r-2 border-b-2 border-(--color-connector) rounded-br-xl" />
          <div className="relative w-4 h-[calc(50%+1px)] border-l-2 border-b-2 border-(--color-connector) rounded-bl-xl -ml-0.5" />
        </div>
        {branches.map((branchNode, i) => {
          return (
            <ParallelNodeWrapper
              label={branchNode.label}
              index={i}
              total={len}
              key={i}
            >
              <WorkflowNodeList nodes={branchNode.nodes} />
            </ParallelNodeWrapper>
          );
        })}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-(--connector-height) flex items-end z-10">
          <div className="absolute h-0.5 top-[calc(50%-1px)] w-full bg-neutral-100" />
          <div className="relative w-4 h-[calc(50%+1px)] border-r-2 border-t-2 border-(--color-connector) rounded-tr-xl" />
          <div className="relative w-4 h-[calc(50%+1px)] border-l-2 border-t-2 border-(--color-connector) rounded-tl-xl -ml-0.5" />
        </div>
      </ul>
    );
  }

  const center = Math.floor(len / 2);
  const left = branches.slice(0, center);
  const middle = branches[center];
  const right = branches.slice(center + 1);
  const centerActiveState = getBranchConnectorActiveState(center, branches);

  return (
    <ul className="list-none ml-0 grid grid-cols-[1fr_auto_1fr] w-max">
      <div className="flex justify-end">
        {left.map((branchNode, i) => {
          const activeState = getBranchConnectorActiveState(i, branches);
          return (
            <ParallelNodeWrapper
              label={branchNode.label}
              index={i}
              total={len}
              key={i}
              active={activeState ? { top: activeState } : undefined}
            >
              <WorkflowNodeList nodes={branchNode.nodes} />
            </ParallelNodeWrapper>
          );
        })}
      </div>
      <ParallelNodeWrapper
        label={middle.label}
        index={center}
        total={len}
        active={centerActiveState ? { top: centerActiveState } : undefined}
      >
        <WorkflowNodeList nodes={middle.nodes} />
      </ParallelNodeWrapper>
      <div className="flex">
        {right.map((branchNode, i) => {
          const activeState = getBranchConnectorActiveState(
            i + center + 1,
            branches,
          );
          return (
            <ParallelNodeWrapper
              label={branchNode.label}
              index={i + center + 1}
              total={len}
              key={i}
              active={activeState ? { top: activeState } : undefined}
            >
              <WorkflowNodeList nodes={branchNode.nodes} />
            </ParallelNodeWrapper>
          );
        })}
      </div>
    </ul>
  );
}

function WorkflowParallelNode({ node }: { node: ParallelNode }) {
  const branches = node.nodes.map((n) => ({
    nodes: [n],
    runtimeStatus: n.runtime?.status,
  }));
  return <ParallelBranches branches={branches} />;
}

function WorkflowIfNode({ node }: { node: IfNode }) {
  return (
    <div>
      <ParallelBranches
        branches={node.branches.map((b) => ({
          ...b,
          label: b.condition ?? "else",
        }))}
      />
    </div>
  );
}

function WorkflowTryCatchNode({ node }: { node: TryNode }) {
  const tryBranch = node.try_block?.nodes;
  const catchBranch = node.catch_block?.nodes;
  const finallyBranch = node.finally_block?.nodes;

  if (!tryBranch || !catchBranch) {
    return null;
  }

  return (
    <div>
      <ParallelBranches
        branches={[
          { nodes: tryBranch, label: "try" },
          { nodes: catchBranch, label: "catch" },
        ]}
      />
      {finallyBranch && <WorkflowNodeList nodes={finallyBranch} />}
    </div>
  );
}

function WorkflowLoopNode({ node }: { node: LoopNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="relative">
      {expanded && (
        <div
          className={cn(
            "absolute top-[15px] bottom-[5px] right-0 border border-black/20 border-dashed rounded-2xl  dark:bg-neutral-800/30",
            expanded ? "-left-4 -right-4" : "-left-3 -right-3",
          )}
        />
      )}
      <div
        className={cn(
          "absolute top-[15px] bottom-[5px] right-1/2 border-2 border-(--color-connector) border-r-0 rounded-l-2xl",
          expanded ? "-left-4" : "-left-3",
        )}
      />
      <Button
        className={cn(
          "w-fit mx-auto h-8 gap-2.5 relative z-10 ring ring-black/20",
          expanded && "-mb-6",
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="absolute w-[5px] h-2.5 rounded-l-xs right-full bg-(--color-connector)" />
        <span className="grow flex items-center gap-2">
          <span className="font-mono">loop</span>
          <span className="text-xs rounded bg-neutral-500 text-white w-4 h-4 shrink-0">
            {node.nodes.length}
          </span>
        </span>
        <span className="flex items-center justify-center border-l border-color -mr-3 w-8 h-full">
          <motion.span
            className="flex items-center justify-center"
            animate={{
              rotate: expanded ? 180 : 0,
            }}
            transition={transitions.swift}
          >
            <CaretDownIcon size={16} />
          </motion.span>
        </span>
      </Button>
      {expanded && (
        <div
          className="relative"
          style={{ "--connector-height": "40px" } as CSSProperties}
        >
          <WorkflowNodeList showFirst nodes={node.nodes} />
          <div className="w-0.5 h-3 bg-(--color-connector) mx-auto" />
          <div className="size-3 border border-neutral-300 bg-surface rounded relative z-10 mx-auto" />
        </div>
      )}
    </div>
  );
}

function isStepNode(node: Node): node is StepNode {
  return (
    node.type === "step_do" ||
    node.type === "step_sleep" ||
    node.type === "step_sleep_until" ||
    node.type === "step_wait_for_event"
  );
}

function getStepType(node: StepNode): "do" | "sleep" | "waitForEvent" {
  if (node.type === "step_do") return "do";
  if (node.type === "step_sleep") return "sleep";
  if (node.type === "step_sleep_until") return "sleep";
  if (node.type === "step_wait_for_event") return "waitForEvent";
  return "do";
}

function WorkflowNode({ node }: { node: Node }) {
  const functions = useContext(FunctionsContext);

  if (isStepNode(node)) {
    return (
      <RuntimeStep
        node={{
          name: node.name,
          type: getStepType(node),
        }}
        state={node.runtime?.state}
        isStatic={!node.runtime}
      />
    );
  }

  // Function call - lookup function definition from context
  if (node.type === "function_call") {
    const functionDef = functions[node.name];
    if (!functionDef) {
      return <div>Unknown function: {node.name}</div>;
    }
    return (
      <WorkflowFunctionNode
        node={node}
        functionDef={functionDef}
        status={node.runtime?.status}
      />
    );
  }

  if (node.type === "parallel") {
    return <WorkflowParallelNode node={node} />;
  }

  if (node.type === "if") {
    return <WorkflowIfNode node={node} />;
  }

  if (node.type === "sequence") {
    return <WorkflowNodeList nodes={node.nodes} />;
  }

  if (node.type === "try") {
    return <WorkflowTryCatchNode node={node} />;
  }

  if (node.type === "loop") {
    return <WorkflowLoopNode node={node} />;
  }

  return null;
}

export function WorkflowDiagram({
  workflow,
  runtime,
}: {
  workflow: WorkflowEntrypoint;
  runtime?: StepState[];
}) {
  // Populate runtime state for all nodes before rendering
  const populatedNodes = populateRuntimeState(
    workflow.nodes,
    workflow.functions,
    runtime,
  );
  return (
    <FunctionsContext.Provider value={workflow.functions}>
      <div
        className="mx-auto w-fit relative"
        style={
          {
            "--connector-height": "50px",
            "--color-connector": runtime
              ? "light-dark(var(--color-neutral-300), var(--color-neutral-700))"
              : "light-dark(var(--color-neutral-400), var(--color-neutral-600))",
            "--color-connector-active":
              "light-dark(var(--color-neutral-500), var(--color-neutral-300))",
          } as CSSProperties
        }
      >
        <div>
          <div className="size-3 border border-neutral-300 bg-surface rounded relative z-10 mx-auto" />
          <div className="w-0.5 h-3 bg-(--color-connector) mx-auto" />
        </div>
        <WorkflowNodeList nodes={populatedNodes} />
        <div>
          <div className="w-0.5 h-3 bg-(--color-connector) mx-auto" />
          <div className="size-2.5 border border-current bg-current text-(--color-connector) rounded relative z-10 mx-auto" />
        </div>
      </div>
    </FunctionsContext.Provider>
  );
}
