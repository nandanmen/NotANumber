export type BackoffMode = "constant" | "linear" | "exponential";

export type WorkflowDuration = number | string;

export type RetryPolicy = {
  limit: number;
  delay: WorkflowDuration;
  backoff: BackoffMode;
};

export type StepDOConfig = {
  retries: RetryPolicy;
  timeout: WorkflowDuration;
};

export type WaitForEventOptions = {
  event_type: string;
  timeout: WorkflowDuration;
};

interface BaseNode {
  runtime?: RuntimeData;
}

// Step Nodes
export interface StepDO extends BaseNode {
  type: "step_do";
  name: string;
  config: StepDOConfig;
  nodes: Node[];
}

export interface StepSleep extends BaseNode {
  type: "step_sleep";
  name: string;
  duration: WorkflowDuration;
}

export interface StepSleepUntil extends BaseNode {
  type: "step_sleep_until";
  name: string;
  timestamp: string;
}

export interface StepWaitForEvent extends BaseNode {
  type: "step_wait_for_event";
  name: string;
  options: WaitForEventOptions | null;
}

export interface BaseBranch extends BaseNode {
  nodes: Node[];
}

export interface ConditionalBranch extends BaseBranch {
  condition: string | null;
}

// Control Flow Nodes
export interface IfNode extends BaseNode {
  type: "if";
  branches: ConditionalBranch[];
}

export interface SwitchNode extends BaseNode {
  type: "switch";
  discriminant: string;
  branches: ConditionalBranch[];
}

export interface LoopNode extends BaseNode {
  type: "loop";
  nodes: Node[];
}

export interface ParallelNode extends BaseNode {
  type: "parallel";
  kind: "all_settled" | "any" | "all" | "race";
  nodes: Node[];
}

export interface SequenceNode extends BaseNode {
  type: "sequence";
  nodes: Node[];
}

export interface TryNode extends BaseNode {
  type: "try";
  try_block: { nodes: Node[] } | null;
  catch_block: { nodes: Node[] } | null;
  finally_block: { nodes: Node[] } | null;
}

// Function Types
export interface FunctionCall extends BaseNode {
  type: "function_call";
  name: string;
  // `nodes` is populated client-side
  nodes?: Node[];
}

export type FunctionDef = {
  name: string;
  nodes: Node[];
};

export type StepNode = StepDO | StepSleep | StepSleepUntil | StepWaitForEvent;
export type ControlFlowNode =
  | IfNode
  | SwitchNode
  | LoopNode
  | ParallelNode
  | SequenceNode
  | TryNode
  | FunctionCall;

// Node Union
export type Node = StepNode | ControlFlowNode;

// Top-Level Types
export type WorkflowEntrypoint = {
  class_name: string;
  params: string[];
  functions: Record<string, FunctionDef>;
  nodes: Node[];
};

export type ParserResult = {
  v: number;
  workflows: WorkflowEntrypoint[];
};

export type StepAttempt = {
  start: string;
  end: string;
  success: boolean;
  error: { name: string; message: string } | null;
};

export type StepState = {
  name: string;
  start: string;
  end?: string;
  type: "step" | "waitForEvent" | "sleep";
  success?: boolean;
  finished?: boolean;
  error?: { name: string; message: string } | null;
  attempts?: StepAttempt[];
  config?: {
    retries: {
      limit: number;
      delay: number;
      backoff: string;
    };
    timeout: string;
  };
  output?: string | null;
};

// Client-side runtime types
export type RuntimeStatus = "skipped" | "pending" | "success" | "failed";

export type RuntimeData = {
  state?: StepState;
  status: RuntimeStatus;
};
