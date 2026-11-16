import type { StepState, WorkflowEntrypoint } from "./types";

export type WorkflowExample = {
  name: string;
  width?: number;
  workflow: WorkflowEntrypoint;
};

export const exampleRuntime: StepState[] = [
  {
    name: "my first step-1",
    start: "2026-01-09T22:01:37.937Z",
    end: "2026-01-09T22:01:37.959Z",
    attempts: [
      {
        start: "2026-01-09T22:01:37.937Z",
        end: "2026-01-09T22:01:37.959Z",
        success: true,
        error: null,
      },
    ],
    config: {
      retries: {
        limit: 5,
        delay: 10000,
        backoff: "exponential",
      },
      timeout: "10 minutes",
    },
    output:
      '{"inputParams":{"payload":{},"timestamp":"2026-01-09T22:01:34.588Z","instanceId":"c112c6b3-4407-406e-a2f3-8d3d39bd1d61","workflowName":"workflows-starter-nanda"},"files":["doc_7392_rev3.pdf","report_x29_final.pdf","memo_2024_05_12.pdf","file_089_update.pdf","proj_alpha_v2.pdf","data_analysis_q2.pdf","notes_meeting_52.pdf","summary_fy24_draft.pdf"]}',
    success: true,
    type: "step",
  },
  {
    name: "request-approval-1",
    start: "2026-01-09T22:01:37.983Z",
    finished: true,
    type: "waitForEvent",
    error: {
      name: "WorkflowTimeoutError",
      message: "Execution timed out after 60000ms",
    },
    end: "2026-01-09T22:02:38.244Z",
    attempts: [
      {
        start: "2026-01-09T22:01:37.983Z",
        end: "2026-01-09T22:02:38.244Z",
        success: false,
        error: {
          name: "WorkflowTimeoutError",
          message: "Execution timed out after 60000ms",
        },
      },
    ],
  },
  {
    name: "fetch from api-1",
    start: "2026-01-09T22:01:38.244Z",
    // end: "2026-01-09T22:01:38.353Z",
    attempts: [
      {
        start: "2026-01-09T22:01:38.244Z",
        end: "2026-01-09T22:01:38.353Z",
        success: true,
        error: null,
      },
    ],
    config: {
      retries: {
        limit: 5,
        delay: 10000,
        backoff: "exponential",
      },
      timeout: "10 minutes",
    },
    output:
      '{"result":{"ipv4_cidrs":["173.245.48.0/20","103.21.244.0/22","103.22.200.0/22","103.31.4.0/22","141.101.64.0/18","108.162.192.0/18","190.93.240.0/20","188.114.96.0/20","197.234.240.0/22","198.41.128.0/17","162.158.0.0/15","104.16.0.0/13","104.24.0.0/14","172.64.0.0/13","131.0.72.0/22"],"ipv6_cidrs":["2400:cb00::/32","2606:4700::/32","2803:f800::/32","2405:b500::/32","2405:8100::/32","2a06:98c0::/29","2c0f:f248::/32"],"etag":"38f79d050aa027e3be3865e495dcc9bc"},"success":true,"errors":[],"messages":[]}',
    success: true,
    type: "step",
  },
  {
    name: "wait on something-1",
    start: "2026-01-09T22:01:38.244Z",
    end: "2026-01-09T22:02:38.244Z",
    finished: true,
    type: "sleep",
    error: null,
  },
  {
    name: "parse api results-1",
    start: "2026-01-09T22:01:38.381Z",
    end: "2026-01-09T22:01:38.603Z",
    attempts: [
      {
        start: "2026-01-09T22:01:38.381Z",
        end: "2026-01-09T22:01:38.603Z",
        success: true,
        error: null,
      },
    ],
    config: {
      retries: {
        limit: 5,
        delay: 10000,
        backoff: "exponential",
      },
      timeout: "10 minutes",
    },
    output:
      '{"result":{"ipv4_cidrs":["173.245.48.0/20","103.21.244.0/22","103.22.200.0/22","103.31.4.0/22","141.101.64.0/18","108.162.192.0/18","190.93.240.0/20","188.114.96.0/20","197.234.240.0/22","198.41.128.0/17","162.158.0.0/15","104.16.0.0/13","104.24.0.0/14","172.64.0.0/13","131.0.72.0/22"],"ipv6_cidrs":["2400:cb00::/32","2606:4700::/32","2803:f800::/32","2405:b500::/32","2405:8100::/32","2a06:98c0::/29","2c0f:f248::/32"],"etag":"38f79d050aa027e3be3865e495dcc9bc"},"success":true,"errors":[],"messages":[]}',
    success: true,
    type: "step",
  },
  /* {
    name: 'make a call to write that could maybe, just might, fail-1',
    start: '2026-01-09T22:01:38.381Z',
    end: '2026-01-09T22:01:38.603Z',
    attempts: [
      {
        start: '2026-01-09T22:01:38.381Z',
        end: '2026-01-09T22:01:38.603Z',
        success: false,
        error: {
          message: 'WorkflowTimeoutError: Execution timed out after 60000ms',
          name: 'WorkflowTimeoutError'
        }
      }
    ],
    config: {
      retries: {
        limit: 5,
        delay: 10000,
        backoff: 'exponential'
      },
      timeout: '10 minutes'
    },
    output: null,
    success: false,
    type: 'step'
  } */
];

// If/ElseIf/Else block (three branches)
export const workflowIfElseIfElse: WorkflowEntrypoint = {
  class_name: "ConditionalWorkflow",
  params: ["status"],
  functions: {},
  nodes: [
    {
      type: "step_do",
      name: "check status",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
    {
      type: "if",
      branches: [
        {
          condition: 'status === "active"',
          nodes: [
            {
              type: "step_do",
              name: "handle active status",
              config: {
                retries: { limit: 3, delay: 1000, backoff: "exponential" },
                timeout: 5000,
              },
              nodes: [],
            },
          ],
        },
        {
          condition: 'status === "pending"',
          nodes: [
            {
              type: "step_do",
              name: "handle pending status",
              config: {
                retries: { limit: 3, delay: 1000, backoff: "exponential" },
                timeout: 5000,
              },
              nodes: [],
            },
          ],
        },
        {
          condition: null,
          nodes: [
            {
              type: "step_do",
              name: "handle unknown status",
              config: {
                retries: { limit: 3, delay: 1000, backoff: "exponential" },
                timeout: 5000,
              },
              nodes: [],
            },
          ],
        },
      ],
    },
    {
      type: "step_do",
      name: "finalize",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
  ],
};

// Loop with one step
export const workflowLoopOneStep: WorkflowEntrypoint = {
  class_name: "SingleLoopWorkflow",
  params: ["items"],
  functions: {},
  nodes: [
    {
      type: "step_do",
      name: "initialize",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
    {
      type: "loop",
      nodes: [
        {
          type: "step_do",
          name: "process item",
          config: {
            retries: { limit: 5, delay: 2000, backoff: "exponential" },
            timeout: 30000,
          },
          nodes: [],
        },
      ],
    },
    {
      type: "step_do",
      name: "complete",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
  ],
};

// Loop with three steps
export const workflowLoopThreeSteps: WorkflowEntrypoint = {
  class_name: "MultiStepLoopWorkflow",
  params: ["records"],
  functions: {},
  nodes: [
    {
      type: "step_do",
      name: "fetch records",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 10000,
      },
      nodes: [],
    },
    {
      type: "loop",
      nodes: [
        {
          type: "step_do",
          name: "validate record",
          config: {
            retries: { limit: 3, delay: 1000, backoff: "exponential" },
            timeout: 5000,
          },
          nodes: [],
        },
        {
          type: "step_do",
          name: "transform record",
          config: {
            retries: { limit: 3, delay: 1000, backoff: "exponential" },
            timeout: 10000,
          },
          nodes: [],
        },
        {
          type: "step_do",
          name: "save record",
          config: {
            retries: { limit: 5, delay: 2000, backoff: "exponential" },
            timeout: 15000,
          },
          nodes: [],
        },
      ],
    },
    {
      type: "step_do",
      name: "generate report",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 10000,
      },
      nodes: [],
    },
  ],
};

// Function call with nested parallel (three steps)
export const workflowFunctionWithParallel: WorkflowEntrypoint = {
  class_name: "ParallelFunctionWorkflow",
  params: ["userId"],
  functions: {
    fetchUserData: {
      name: "fetchUserData",
      nodes: [
        {
          type: "step_do",
          name: "authenticate",
          config: {
            retries: { limit: 3, delay: 1000, backoff: "exponential" },
            timeout: 5000,
          },
          nodes: [],
        },
        {
          type: "parallel",
          kind: "all",
          nodes: [
            {
              type: "step_do",
              name: "fetch profile",
              config: {
                retries: { limit: 3, delay: 1000, backoff: "exponential" },
                timeout: 10000,
              },
              nodes: [],
            },
            {
              type: "step_do",
              name: "fetch preferences",
              config: {
                retries: { limit: 3, delay: 1000, backoff: "exponential" },
                timeout: 10000,
              },
              nodes: [],
            },
            {
              type: "step_do",
              name: "fetch activity",
              config: {
                retries: { limit: 3, delay: 1000, backoff: "exponential" },
                timeout: 10000,
              },
              nodes: [],
            },
          ],
        },
        {
          type: "step_do",
          name: "merge results",
          config: {
            retries: { limit: 3, delay: 1000, backoff: "exponential" },
            timeout: 5000,
          },
          nodes: [],
        },
      ],
    },
  },
  nodes: [
    {
      type: "step_do",
      name: "validate request",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
    { type: "function_call", name: "fetchUserData" },
    {
      type: "step_do",
      name: "return response",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
  ],
};

// Try/Catch block
export const workflowTryCatch: WorkflowEntrypoint = {
  class_name: "TryCatchWorkflow",
  params: ["data"],
  functions: {},
  nodes: [
    {
      type: "step_do",
      name: "prepare data",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
    {
      type: "try",
      try_block: {
        nodes: [
          {
            type: "step_do",
            name: "risky operation",
            config: {
              retries: { limit: 5, delay: 2000, backoff: "exponential" },
              timeout: 30000,
            },
            nodes: [],
          },
          {
            type: "step_do",
            name: "commit changes",
            config: {
              retries: { limit: 3, delay: 1000, backoff: "exponential" },
              timeout: 10000,
            },
            nodes: [],
          },
        ],
      },
      catch_block: {
        nodes: [
          {
            type: "step_do",
            name: "log error",
            config: {
              retries: { limit: 3, delay: 1000, backoff: "exponential" },
              timeout: 5000,
            },
            nodes: [],
          },
          {
            type: "step_do",
            name: "rollback",
            config: {
              retries: { limit: 5, delay: 2000, backoff: "exponential" },
              timeout: 15000,
            },
            nodes: [],
          },
        ],
      },
      finally_block: null,
    },
    {
      type: "step_do",
      name: "send notification",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
  ],
};

// Try/Catch/Finally block
export const workflowTryCatchFinally: WorkflowEntrypoint = {
  class_name: "TryCatchFinallyWorkflow",
  params: ["resourceId"],
  functions: {},
  nodes: [
    {
      type: "step_do",
      name: "acquire lock",
      config: {
        retries: { limit: 5, delay: 2000, backoff: "exponential" },
        timeout: 10000,
      },
      nodes: [],
    },
    {
      type: "try",
      try_block: {
        nodes: [
          {
            type: "step_do",
            name: "read resource",
            config: {
              retries: { limit: 3, delay: 1000, backoff: "exponential" },
              timeout: 10000,
            },
            nodes: [],
          },
          {
            type: "step_do",
            name: "modify resource",
            config: {
              retries: { limit: 3, delay: 1000, backoff: "exponential" },
              timeout: 15000,
            },
            nodes: [],
          },
          {
            type: "step_do",
            name: "write resource",
            config: {
              retries: { limit: 5, delay: 2000, backoff: "exponential" },
              timeout: 20000,
            },
            nodes: [],
          },
        ],
      },
      catch_block: {
        nodes: [
          {
            type: "step_do",
            name: "handle error",
            config: {
              retries: { limit: 3, delay: 1000, backoff: "exponential" },
              timeout: 5000,
            },
            nodes: [],
          },
          {
            type: "step_do",
            name: "notify admin",
            config: {
              retries: { limit: 3, delay: 1000, backoff: "exponential" },
              timeout: 5000,
            },
            nodes: [],
          },
        ],
      },
      finally_block: {
        nodes: [
          {
            type: "step_do",
            name: "release lock",
            config: {
              retries: { limit: 5, delay: 1000, backoff: "constant" },
              timeout: 10000,
            },
            nodes: [],
          },
          {
            type: "step_do",
            name: "cleanup temp files",
            config: {
              retries: { limit: 3, delay: 1000, backoff: "exponential" },
              timeout: 5000,
            },
            nodes: [],
          },
        ],
      },
    },
    {
      type: "step_do",
      name: "log completion",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
  ],
};

// Step containing other steps (using sequence)
export const workflowNestedSteps: WorkflowEntrypoint = {
  class_name: "NestedStepsWorkflow",
  params: ["order"],
  functions: {},
  nodes: [
    {
      type: "step_do",
      name: "receive order",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
    {
      type: "step_do",
      name: "process order",
      config: {
        retries: { limit: 5, delay: 2000, backoff: "exponential" },
        timeout: 60000,
      },
      nodes: [
        {
          type: "step_do",
          name: "validate inventory",
          config: {
            retries: { limit: 3, delay: 1000, backoff: "exponential" },
            timeout: 10000,
          },
          nodes: [],
        },
        {
          type: "step_do",
          name: "calculate pricing",
          config: {
            retries: { limit: 3, delay: 1000, backoff: "exponential" },
            timeout: 5000,
          },
          nodes: [],
        },
        {
          type: "step_do",
          name: "apply discounts",
          config: {
            retries: { limit: 3, delay: 1000, backoff: "exponential" },
            timeout: 5000,
          },
          nodes: [],
        },
        {
          type: "step_do",
          name: "reserve stock",
          config: {
            retries: { limit: 5, delay: 2000, backoff: "exponential" },
            timeout: 15000,
          },
          nodes: [],
        },
      ],
    },
    {
      type: "step_do",
      name: "confirm order",
      config: {
        retries: { limit: 3, delay: 1000, backoff: "exponential" },
        timeout: 5000,
      },
      nodes: [],
    },
  ],
};

export const workflowManyOdd: WorkflowEntrypoint = {
  class_name: "MyWorkflow",
  params: [],
  functions: {
    parseApi: {
      name: "parseApi",
      nodes: [
        {
          type: "step_do",
          name: "fetch from api",
          config: {
            retries: { limit: 5, delay: 1000, backoff: "exponential" },
            timeout: 10000,
          },
          nodes: [],
        },
        {
          type: "step_do",
          name: "parse api results",
          config: {
            retries: { limit: 5, delay: 1000, backoff: "exponential" },
            timeout: 10000,
          },
          nodes: [],
        },
      ],
    },
  },
  nodes: [
    {
      type: "step_do",
      name: "my first step",
      config: {
        retries: { limit: 5, delay: 1000, backoff: "exponential" },
        timeout: 10000,
      },
      nodes: [],
    },
    {
      type: "parallel",
      kind: "all_settled",
      nodes: [
        {
          type: "step_wait_for_event",
          name: "request-approval",
          options: { event_type: "unknown", timeout: "1 minute" },
        },
        { type: "function_call", name: "parseApi" },
        {
          type: "step_do",
          name: "do something",
          config: {
            retries: { limit: 5, delay: "5 second", backoff: "exponential" },
            timeout: "15 minutes",
          },
          nodes: [],
        },
      ],
    },
    {
      type: "step_do",
      name: "make a call to write",
      config: {
        retries: { limit: 5, delay: "5 second", backoff: "exponential" },
        timeout: "15 minutes",
      },
      nodes: [],
    },
  ],
};

export const workflowExamples: WorkflowExample[] = [
  { name: "Parallel with Function Call", workflow: workflowManyOdd },
  { name: "If/ElseIf/Else", workflow: workflowIfElseIfElse },
  { name: "Loop (One Step)", workflow: workflowLoopOneStep },
  { name: "Loop (Three Steps)", workflow: workflowLoopThreeSteps },
  {
    name: "Function with Nested Parallel",
    workflow: workflowFunctionWithParallel,
  },
  { name: "Try/Catch", workflow: workflowTryCatch },
  { name: "Try/Catch/Finally", workflow: workflowTryCatchFinally },
  { name: "Nested Steps", workflow: workflowNestedSteps },
  {
    name: "Phillip Agents",
    width: 2,
    workflow: {
      class_name: "AgentWorkflow",
      params: ["headers", "body", "parts", "action", "feedback", "dataJson"],
      functions: {
        executeRemoteMcpTool: {
          name: "executeRemoteMcpTool",
          nodes: [
            {
              type: "try",
              try_block: null,
              catch_block: { nodes: [] },
              finally_block: null,
            },
          ],
        },
      },
      nodes: [
        {
          type: "try",
          try_block: {
            nodes: [
              {
                type: "step_do",
                name: "load-mcp-config",
                config: {
                  retries: {
                    limit: 5,
                    delay: 1000,
                    backoff: "exponential",
                  },
                  timeout: 10000,
                },
                nodes: [],
              },
              {
                type: "loop",
                nodes: [
                  {
                    type: "step_do",
                    name: "turn-${...}",
                    config: {
                      retries: {
                        limit: 5,
                        delay: 1000,
                        backoff: "exponential",
                      },
                      timeout: 10000,
                    },
                    nodes: [],
                  },
                  {
                    type: "if",
                    branches: [
                      {
                        condition: "toolUses.length > 0",
                        nodes: [
                          {
                            type: "loop",
                            nodes: [
                              {
                                type: "if",
                                branches: [
                                  {
                                    condition:
                                      'toolUse.name === "request_approval"',
                                    nodes: [
                                      {
                                        type: "step_do",
                                        name: "checkpoint-setup-${...}",
                                        config: {
                                          retries: {
                                            limit: 5,
                                            delay: 1000,
                                            backoff: "exponential",
                                          },
                                          timeout: 10000,
                                        },
                                        nodes: [],
                                      },
                                      {
                                        type: "step_wait_for_event",
                                        name: "Wait for approval: ${...}",
                                        options: {
                                          event_type: "checkpoint-approval",
                                          timeout: "7 days",
                                        },
                                      },
                                      {
                                        type: "if",
                                        branches: [
                                          {
                                            condition:
                                              'approvalAction === "request_changes"',
                                            nodes: [],
                                          },
                                          {
                                            condition: null,
                                            nodes: [
                                              {
                                                type: "step_do",
                                                name: "checkpoint-resolve-${...}",
                                                config: {
                                                  retries: {
                                                    limit: 5,
                                                    delay: 1000,
                                                    backoff: "exponential",
                                                  },
                                                  timeout: 10000,
                                                },
                                                nodes: [],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    condition:
                                      'toolUse.name === "weft_create_task"',
                                    nodes: [
                                      {
                                        type: "step_do",
                                        name: "create-child-task-${...}",
                                        config: {
                                          retries: {
                                            limit: 5,
                                            delay: 1000,
                                            backoff: "exponential",
                                          },
                                          timeout: 10000,
                                        },
                                        nodes: [],
                                      },
                                    ],
                                  },
                                  {
                                    condition: null,
                                    nodes: [
                                      {
                                        type: "step_do",
                                        name: "tool-${...}",
                                        config: {
                                          retries: {
                                            limit: 5,
                                            delay: 1000,
                                            backoff: "exponential",
                                          },
                                          timeout: 10000,
                                        },
                                        nodes: [],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        condition: null,
                        nodes: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: "step_do",
                name: "complete",
                config: {
                  retries: {
                    limit: 5,
                    delay: 1000,
                    backoff: "exponential",
                  },
                  timeout: 10000,
                },
                nodes: [],
              },
            ],
          },
          catch_block: {
            nodes: [
              {
                type: "step_do",
                name: "handle-error",
                config: {
                  retries: {
                    limit: 5,
                    delay: 1000,
                    backoff: "exponential",
                  },
                  timeout: 10000,
                },
                nodes: [
                  { type: "function_call", name: "updatePlan" },
                  { type: "function_call", name: "addLog" },
                ],
              },
            ],
          },
          finally_block: null,
        },
      ],
    },
  },
  {
    name: "Phillip Tools",
    width: 2,
    workflow: {
      class_name: "DynamicToolWorkflow",
      params: [
        "authType",
        "integration",
        "credentials",
        "scopes",
        "oauthConfig",
        "approved",
        "feedback",
        "modifiedData",
      ],
      functions: {
        anonymous: {
          name: "anonymous",
          nodes: [{ type: "loop", nodes: [] }],
        },
      },
      nodes: [
        {
          type: "if",
          branches: [
            {
              condition: "isLoggedIn",
              nodes: [],
            },
            {
              condition: null,
              nodes: [
                {
                  type: "step_do",
                  name: "load-auth",
                  config: {
                    retries: {
                      limit: 5,
                      delay: 1000,
                      backoff: "exponential",
                    },
                    timeout: 10000,
                  },
                  nodes: [],
                },
              ],
            },
          ],
        },
        {
          type: "try",
          try_block: {
            nodes: [
              {
                type: "loop",
                nodes: [
                  {
                    type: "step_do",
                    name: "agent-turn-${...}",
                    config: {
                      retries: {
                        limit: 5,
                        delay: 1000,
                        backoff: "exponential",
                      },
                      timeout: 10000,
                    },
                    nodes: [],
                  },
                  {
                    type: "if",
                    branches: [
                      {
                        condition: "toolUses.length > 0",
                        nodes: [
                          {
                            type: "loop",
                            nodes: [
                              {
                                type: "if",
                                branches: [
                                  {
                                    condition:
                                      'toolUse.name === "request_tool"',
                                    nodes: [
                                      {
                                        type: "step_do",
                                        name: "request-tool-state-${...}",
                                        config: {
                                          retries: {
                                            limit: 5,
                                            delay: 1000,
                                            backoff: "exponential",
                                          },
                                          timeout: 10000,
                                        },
                                        nodes: [],
                                      },
                                      {
                                        type: "step_do",
                                        name: "infer-auth-${...}",
                                        config: {
                                          retries: {
                                            limit: 5,
                                            delay: 1000,
                                            backoff: "exponential",
                                          },
                                          timeout: 10000,
                                        },
                                        nodes: [],
                                      },
                                      {
                                        type: "if",
                                        branches: [
                                          {
                                            condition: "needsAuth",
                                            nodes: [
                                              {
                                                type: "step_do",
                                                name: "auth-request-${...}",
                                                config: {
                                                  retries: {
                                                    limit: 5,
                                                    delay: 1000,
                                                    backoff: "exponential",
                                                  },
                                                  timeout: 10000,
                                                },
                                                nodes: [],
                                              },
                                              {
                                                type: "step_wait_for_event",
                                                name: "Wait for ${...} credentials",
                                                options: {
                                                  event_type:
                                                    "auth-credentials",
                                                  timeout: "30 minutes",
                                                },
                                              },
                                              {
                                                type: "step_do",
                                                name: "auth-save-${...}",
                                                config: {
                                                  retries: {
                                                    limit: 5,
                                                    delay: 1000,
                                                    backoff: "exponential",
                                                  },
                                                  timeout: 10000,
                                                },
                                                nodes: [],
                                              },
                                            ],
                                          },
                                          {
                                            condition: null,
                                            nodes: [],
                                          },
                                        ],
                                      },
                                      {
                                        type: "step_do",
                                        name: "writing-code-${...}",
                                        config: {
                                          retries: {
                                            limit: 5,
                                            delay: 1000,
                                            backoff: "exponential",
                                          },
                                          timeout: 10000,
                                        },
                                        nodes: [],
                                      },
                                      {
                                        type: "step_do",
                                        name: "codegen-${...}",
                                        config: {
                                          retries: {
                                            limit: 5,
                                            delay: 1000,
                                            backoff: "exponential",
                                          },
                                          timeout: 10000,
                                        },
                                        nodes: [],
                                      },
                                      {
                                        type: "step_do",
                                        name: "tool-ready-${...}",
                                        config: {
                                          retries: {
                                            limit: 5,
                                            delay: 1000,
                                            backoff: "exponential",
                                          },
                                          timeout: 10000,
                                        },
                                        nodes: [],
                                      },
                                    ],
                                  },
                                  {
                                    condition: null,
                                    nodes: [],
                                  },
                                ],
                              },
                              {
                                type: "if",
                                branches: [
                                  {
                                    condition: "isMutation",
                                    nodes: [
                                      {
                                        type: "step_do",
                                        name: "approval-setup-${...}",
                                        config: {
                                          retries: {
                                            limit: 5,
                                            delay: 1000,
                                            backoff: "exponential",
                                          },
                                          timeout: 10000,
                                        },
                                        nodes: [],
                                      },
                                      {
                                        type: "step_wait_for_event",
                                        name: "Wait for approval: ${...}",
                                        options: {
                                          event_type: "approval-response",
                                          timeout: "30 minutes",
                                        },
                                      },
                                      {
                                        type: "if",
                                        branches: [
                                          {
                                            condition: "rejected",
                                            nodes: [],
                                          },
                                          {
                                            condition: null,
                                            nodes: [
                                              {
                                                type: "step_do",
                                                name: "approval-resolve-${...}",
                                                config: {
                                                  retries: {
                                                    limit: 5,
                                                    delay: 1000,
                                                    backoff: "exponential",
                                                  },
                                                  timeout: 10000,
                                                },
                                                nodes: [],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    condition: null,
                                    nodes: [],
                                  },
                                ],
                              },
                              {
                                type: "loop",
                                nodes: [
                                  {
                                    type: "step_do",
                                    name: "<dynamic>",
                                    config: {
                                      retries: {
                                        limit: 5,
                                        delay: 1000,
                                        backoff: "exponential",
                                      },
                                      timeout: 10000,
                                    },
                                    nodes: [],
                                  },
                                  {
                                    type: "step_do",
                                    name: "fix-${...}-${...}",
                                    config: {
                                      retries: {
                                        limit: 5,
                                        delay: 1000,
                                        backoff: "exponential",
                                      },
                                      timeout: 10000,
                                    },
                                    nodes: [],
                                  },
                                ],
                              },
                              {
                                type: "step_do",
                                name: "history-${...}",
                                config: {
                                  retries: {
                                    limit: 5,
                                    delay: 1000,
                                    backoff: "exponential",
                                  },
                                  timeout: 10000,
                                },
                                nodes: [],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        condition: null,
                        nodes: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          catch_block: {
            nodes: [
              {
                type: "if",
                branches: [
                  { condition: "turnIndex >= maxTurns", nodes: [] },
                  {
                    condition: null,
                    nodes: [
                      {
                        type: "step_do",
                        name: "handle-error",
                        config: {
                          retries: {
                            limit: 5,
                            delay: 1000,
                            backoff: "exponential",
                          },
                          timeout: 10000,
                        },
                        nodes: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          finally_block: null,
        },
      ],
    },
  },
  {
    name: "Celso Workflow",
    workflow: {
      class_name: "RBLCheckWorkflow",
      params: [
        "exp",
        "user",
        "account",
        "martians",
        "ips",
        "jobId",
        "ip",
        "length",
        "trim",
      ],
      functions: {
        checkFwdrRBL: {
          name: "checkFwdrRBL",
          nodes: [
            {
              type: "if",
              branches: [
                {
                  condition: null,
                  nodes: [
                    {
                      type: "sequence",
                      nodes: [
                        {
                          type: "if",
                          branches: [
                            {
                              condition: "res.ok",
                              nodes: [
                                {
                                  type: "try",
                                  try_block: null,
                                  catch_block: {
                                    nodes: [],
                                  },
                                  finally_block: null,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        checkRBL: {
          name: "checkRBL",
          nodes: [
            {
              type: "switch",
              discriminant: "rbl.type",
              branches: [
                {
                  condition: "0",
                  nodes: [],
                },
              ],
            },
          ],
        },
      },
      nodes: [
        {
          type: "if",
          branches: [
            {
              condition: "event.payload.ips",
              nodes: [],
            },
            {
              condition: null,
              nodes: [
                {
                  type: "try",
                  try_block: {
                    nodes: [
                      {
                        type: "step_do",
                        name: "create job instance",
                        config: {
                          retries: {
                            limit: 5,
                            delay: 1000,
                            backoff: "exponential",
                          },
                          timeout: 10000,
                        },
                        nodes: [],
                      },
                      {
                        type: "step_do",
                        name: "gets list of rbls",
                        config: {
                          retries: {
                            limit: 5,
                            delay: 1000,
                            backoff: "exponential",
                          },
                          timeout: 10000,
                        },
                        nodes: [],
                      },
                      {
                        type: "step_do",
                        name: "processing ${...} from rbl ${...}",
                        config: {
                          retries: {
                            limit: 5,
                            delay: 1000,
                            backoff: "exponential",
                          },
                          timeout: 10000,
                        },
                        nodes: [],
                      },
                      {
                        type: "step_do",
                        name: "updating state",
                        config: {
                          retries: {
                            limit: 5,
                            delay: 1000,
                            backoff: "exponential",
                          },
                          timeout: 10000,
                        },
                        nodes: [],
                      },
                    ],
                  },
                  catch_block: {
                    nodes: [],
                  },
                  finally_block: null,
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
