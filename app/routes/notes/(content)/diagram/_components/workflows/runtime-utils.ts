import { getStepStatus } from "./step";
import type {
  BranchWithRuntime,
  FunctionDef,
  Node,
  RuntimeData,
  RuntimeStatus,
  StepState,
} from "./types";

// Helper function to find runtime state by step name
// Strips numeric suffixes (e.g., "-1", "-2") from runtime step names for matching
function findRuntimeState(
  name: string,
  runtime: StepState[] | undefined,
): StepState | undefined {
  if (!runtime) return undefined;
  return runtime.find((state) => {
    // Strip numeric suffixes like "-1", "-2", etc. from runtime step names
    const normalizedRuntimeName = state.name.replace(/-\d+$/, "");
    return normalizedRuntimeName === name;
  });
}

function getNodeStatus(node: Node): RuntimeStatus {
  return node.runtime?.status ?? "skipped";
}

export function computeBranchState(nodes: Node[]): RuntimeStatus {
  if (nodes.length === 0) return "skipped";
  const nodeStatuses: RuntimeStatus[] = nodes.map((n) => {
    return getNodeStatus(n);
  });
  if (nodeStatuses.every((s) => s === "skipped")) return "skipped";
  if (nodeStatuses.some((s) => s === "failed")) return "failed";
  if (nodeStatuses.every((s) => s === "success")) return "success";
  return "pending";
}

function computeNodeRuntimeState(
  node: Node,
  runtime?: StepState[],
): RuntimeData | undefined {
  if (!runtime || runtime.length === 0) return undefined;

  // Step nodes
  if (
    node.type === "step_do" ||
    node.type === "step_sleep" ||
    node.type === "step_sleep_until" ||
    node.type === "step_wait_for_event"
  ) {
    const state = findRuntimeState(node.name, runtime);
    if (!state) return { status: "skipped" };
    return {
      state,
      status: getStepStatus(state),
    };
  }

  if (node.type === "function_call" || node.type === "sequence") {
    // function call hasn't been populated yet
    if (!node.nodes) return { status: "skipped" };
    return { status: computeBranchState(node.nodes) };
  }

  // If node
  if (node.type === "if" || node.type === "switch") {
    const activeBranch = node.branches.find(
      (b: BranchWithRuntime) =>
        b.runtimeStatus && b.runtimeStatus !== "skipped",
    );
    if (!activeBranch) return { status: "skipped" };
    return {
      status: computeBranchState(activeBranch.nodes),
    };
  }

  // Parallel node
  if (node.type === "parallel") {
    const branchStates = node.nodes.map((n) => getNodeStatus(n));
    const kind = node.kind;

    if (kind === "all_settled") {
      if (branchStates.every((s) => s !== "pending"))
        return { status: "success" };
      return { status: "pending" };
    }

    if (kind === "any") {
      if (branchStates.some((s) => s === "success"))
        return { status: "success" };
      if (branchStates.every((s) => s === "failed"))
        return { status: "failed" };
      return { status: "pending" };
    }

    if (kind === "race") {
      const firstNonPending = branchStates.find((s) => s !== "pending");
      if (firstNonPending) return { status: firstNonPending };
      return { status: "pending" };
    }

    // Default: treat as "all"
    if (branchStates.every((s) => s === "success"))
      return { status: "success" };
    if (branchStates.some((s) => s === "failed")) return { status: "failed" };
    return { status: "pending" };
  }

  return undefined;
}

function populateNodeWithRuntimeState(
  node: Node,
  functions: Record<string, FunctionDef>,
  runtime?: StepState[],
): Node {
  // Step nodes
  if (
    node.type === "step_do" ||
    node.type === "step_sleep" ||
    node.type === "step_sleep_until" ||
    node.type === "step_wait_for_event"
  ) {
    return {
      ...node,
      runtime: computeNodeRuntimeState(node, runtime),
    };
  }

  // Other control flow nodes (loop, switch, try) - skip for now
  if (node.type === "loop" || node.type === "try") {
    return { ...node, runtime: { status: "skipped" } };
  }

  const newNode = populateChildNodes(node, functions, runtime);
  return {
    ...newNode,
    runtime: computeNodeRuntimeState(newNode, runtime) ?? { status: "skipped" },
  };
}

function populateChildNodes(
  node: Node,
  functions: Record<string, FunctionDef>,
  runtime?: StepState[],
): Node {
  if (!runtime) return node;

  if (node.type === "function_call") {
    const functionDef = functions[node.name];
    if (!functionDef) return node;
    // Populate the function's nodes to compute state
    const populatedFunctionNodes = populateRuntimeState(
      functionDef.nodes,
      functions,
      runtime,
    );
    return {
      ...node,
      nodes: populatedFunctionNodes,
    };
  }

  // Sequence node
  if (node.type === "sequence") {
    const populatedNodes = populateRuntimeState(node.nodes, functions, runtime);
    return {
      ...node,
      nodes: populatedNodes,
    };
  }

  // If node
  if (node.type === "if" || node.type === "switch") {
    const populatedBranches = node.branches.map((branch) => {
      const populatedNodes = populateRuntimeState(
        branch.nodes,
        functions,
        runtime,
      );
      return {
        ...branch,
        nodes: populatedNodes,
        runtimeStatus: computeBranchState(populatedNodes),
      };
    });
    return {
      ...node,
      branches: populatedBranches,
    };
  }

  // Parallel node
  if (node.type === "parallel") {
    const populatedNodes = populateRuntimeState(node.nodes, functions, runtime);
    return {
      ...node,
      nodes: populatedNodes,
    };
  }

  return node;
}

export function populateRuntimeState(
  nodes: Node[],
  functions: Record<string, FunctionDef>,
  runtime?: StepState[],
): Node[] {
  return nodes.map((node) =>
    populateNodeWithRuntimeState(node, functions, runtime),
  );
}
