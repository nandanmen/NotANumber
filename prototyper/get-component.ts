/**
 * Self-contained React component + source file resolution for a DOM node.
 * Intended to be copied into a separate package; depends only on `react` (+ DOM types).
 *
 * Logic originates from agentation's `react-detection.ts` and `source-location.ts`.
 */

import React from "react";

// =============================================================================
// Fiber / component types (merged from detection + source-location)
// =============================================================================

interface ReactFiber {
  tag: number;
  type: ComponentType | string | null;
  elementType: ComponentType | null;
  return: ReactFiber | null;
  child?: ReactFiber | null;
  sibling?: ReactFiber | null;
  _debugSource?: {
    fileName: string;
    lineNumber: number;
    columnNumber?: number;
  };
  _debugOwner?: ReactFiber;
  memoizedProps?: Record<string, unknown>;
  stateNode?: unknown;
}

interface ComponentType {
  name?: string;
  displayName?: string;
  render?: { name?: string; displayName?: string };
  type?: ComponentType;
  _context?: { displayName?: string };
  _status?: number;
  _result?: ComponentType;
  $$typeof?: symbol;
}

const FiberTags = {
  FunctionComponent: 0,
  ClassComponent: 1,
  IndeterminateComponent: 2,
  HostRoot: 3,
  HostPortal: 4,
  HostComponent: 5,
  HostText: 6,
  Fragment: 7,
  Mode: 8,
  ContextConsumer: 9,
  ContextProvider: 10,
  ForwardRef: 11,
  Profiler: 12,
  SuspenseComponent: 13,
  MemoComponent: 14,
  SimpleMemoComponent: 15,
  LazyComponent: 16,
  IncompleteClassComponent: 17,
  DehydratedFragment: 18,
  SuspenseListComponent: 19,
  ScopeComponent: 21,
  OffscreenComponent: 22,
  LegacyHiddenComponent: 23,
  CacheComponent: 24,
  TracingMarkerComponent: 25,
  HostHoistable: 26,
  HostSingleton: 27,
  IncompleteFunctionComponent: 28,
  Throw: 29,
  ViewTransitionComponent: 30,
  ActivityComponent: 31,
} as const;

// =============================================================================
// Filter configuration (default: filtered — matches package behavior)
// =============================================================================

const DEFAULT_SKIP_EXACT = new Set([
  "Component",
  "PureComponent",
  "Fragment",
  "Suspense",
  "Profiler",
  "StrictMode",
  "Routes",
  "Route",
  "Outlet",
  "Root",
  "ErrorBoundaryHandler",
  "HotReload",
  "Hot",
]);

const DEFAULT_SKIP_PATTERNS: RegExp[] = [
  /Boundary$/,
  /BoundaryHandler$/,
  /Provider$/,
  /Consumer$/,
  /^(Inner|Outer)/,
  /Router$/,
  /^Client(Page|Segment|Root)/,
  /^Segment(ViewNode|Node)$/,
  /^LayoutSegment/,
  /^Server(Root|Component|Render)/,
  /^RSC/,
  /Context$/,
  /^Hot(Reload)?$/,
  /^(Dev|React)(Overlay|Tools|Root)/,
  /Overlay$/,
  /Handler$/,
  /^With[A-Z]/,
  /Wrapper$/,
  /^Root$/,
];

const DEFAULT_USER_PATTERNS: RegExp[] = [
  /Page$/,
  /View$/,
  /Screen$/,
  /Section$/,
  /Card$/,
  /List$/,
  /Item$/,
  /Form$/,
  /Modal$/,
  /Dialog$/,
  /Button$/,
  /Nav$/,
  /Header$/,
  /Footer$/,
  /Layout$/,
  /Panel$/,
  /Tab$/,
  /Menu$/,
];

type ReactDetectionMode = "all" | "filtered" | "smart";

interface ResolvedConfig {
  maxComponents: number;
  maxDepth: number;
  mode: ReactDetectionMode;
  skipExact: Set<string>;
  skipPatterns: RegExp[];
  userPatterns: RegExp[];
}

function resolveConfig(): ResolvedConfig {
  return {
    maxComponents: 6,
    maxDepth: 30,
    mode: "filtered",
    skipExact: DEFAULT_SKIP_EXACT,
    skipPatterns: DEFAULT_SKIP_PATTERNS,
    userPatterns: DEFAULT_USER_PATTERNS,
  };
}

function normalizeComponentName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function getAncestorClasses(element: HTMLElement, maxDepth = 10): Set<string> {
  const classes = new Set<string>();
  let current: HTMLElement | null = element;
  let depth = 0;

  while (current && depth < maxDepth) {
    if (current.className && typeof current.className === "string") {
      for (const cls of current.className.split(/\s+/)) {
        if (cls.length > 1) {
          const normalized = cls
            .replace(/[_][a-zA-Z0-9]{5,}.*$/, "")
            .toLowerCase();
          if (normalized.length > 1) {
            classes.add(normalized);
          }
        }
      }
    }
    current = current.parentElement;
    depth++;
  }

  return classes;
}

function componentCorrelatesWithDOM(
  componentName: string,
  domClasses: Set<string>,
): boolean {
  const normalized = normalizeComponentName(componentName);

  for (const cls of domClasses) {
    if (cls === normalized) return true;

    const componentWords = normalized.split("-").filter((w) => w.length > 2);
    const classWords = cls.split("-").filter((w) => w.length > 2);

    for (const cWord of componentWords) {
      for (const dWord of classWords) {
        if (cWord === dWord || cWord.includes(dWord) || dWord.includes(cWord)) {
          return true;
        }
      }
    }
  }

  return false;
}

function shouldIncludeComponent(
  name: string,
  _depth: number,
  config: ResolvedConfig,
  domClasses?: Set<string>,
): boolean {
  switch (config.mode) {
    case "all":
      return true;

    case "filtered":
      if (config.skipExact.has(name)) return false;
      if (config.skipPatterns.some((p) => p.test(name))) return false;
      return true;

    case "smart":
      if (config.skipExact.has(name)) return false;
      if (config.skipPatterns.some((p) => p.test(name))) return false;
      if (domClasses && componentCorrelatesWithDOM(name, domClasses)) {
        return true;
      }
      if (config.userPatterns.some((p) => p.test(name))) {
        return true;
      }
      return false;

    default:
      return true;
  }
}

// =============================================================================
// React page + fiber access
// =============================================================================

let reactDetectionCache: boolean | null = null;

function hasReactFiber(element: Element): boolean {
  return Object.keys(element).some(
    (key) =>
      key.startsWith("__reactFiber$") ||
      key.startsWith("__reactInternalInstance$") ||
      key.startsWith("__reactProps$"),
  );
}

function isReactPage(): boolean {
  if (reactDetectionCache !== null) {
    return reactDetectionCache;
  }

  if (typeof document === "undefined") {
    return false;
  }

  if (document.body && hasReactFiber(document.body)) {
    reactDetectionCache = true;
    return true;
  }

  const commonRoots = ["#root", "#app", "#__next", "[data-reactroot]"];
  for (const selector of commonRoots) {
    const el = document.querySelector(selector);
    if (el && hasReactFiber(el)) {
      reactDetectionCache = true;
      return true;
    }
  }

  if (document.body) {
    for (const child of document.body.children) {
      if (hasReactFiber(child)) {
        reactDetectionCache = true;
        return true;
      }
    }
  }

  reactDetectionCache = false;
  return false;
}

function getFiberFromElement(element: HTMLElement): ReactFiber | null {
  if (!element || typeof element !== "object") {
    return null;
  }

  const keys = Object.keys(element);

  const fiberKey = keys.find((key) => key.startsWith("__reactFiber$"));
  if (fiberKey) {
    return (element as unknown as Record<string, ReactFiber>)[fiberKey] || null;
  }

  const instanceKey = keys.find((key) =>
    key.startsWith("__reactInternalInstance$"),
  );
  if (instanceKey) {
    return (element as unknown as Record<string, ReactFiber>)[instanceKey] || null;
  }

  const possibleFiberKey = keys.find((key) => {
    if (!key.startsWith("__react")) return false;
    const value = (element as unknown as Record<string, unknown>)[key];
    return value && typeof value === "object" && "_debugSource" in (value as object);
  });

  if (possibleFiberKey) {
    return (element as unknown as Record<string, ReactFiber>)[possibleFiberKey] || null;
  }

  return null;
}

function getComponentNameFromType(type: ComponentType | null): string | null {
  if (!type) return null;
  if (type.displayName) return type.displayName;
  if (type.name) return type.name;
  return null;
}

function getComponentNameFromFiber(fiber: ReactFiber): string | null {
  const { tag, type, elementType } = fiber;

  if (
    tag === FiberTags.HostComponent ||
    tag === FiberTags.HostText ||
    tag === FiberTags.HostHoistable ||
    tag === FiberTags.HostSingleton
  ) {
    return null;
  }

  if (
    tag === FiberTags.Fragment ||
    tag === FiberTags.Mode ||
    tag === FiberTags.Profiler ||
    tag === FiberTags.DehydratedFragment
  ) {
    return null;
  }

  if (
    tag === FiberTags.HostRoot ||
    tag === FiberTags.HostPortal ||
    tag === FiberTags.ScopeComponent ||
    tag === FiberTags.OffscreenComponent ||
    tag === FiberTags.LegacyHiddenComponent ||
    tag === FiberTags.CacheComponent ||
    tag === FiberTags.TracingMarkerComponent ||
    tag === FiberTags.Throw ||
    tag === FiberTags.ViewTransitionComponent ||
    tag === FiberTags.ActivityComponent
  ) {
    return null;
  }

  if (tag === FiberTags.ForwardRef) {
    const elType = elementType as ComponentType | null;
    if (elType?.render) {
      const innerName = getComponentNameFromType(elType.render);
      if (innerName) return innerName;
    }
    if (elType?.displayName) return elType.displayName;
    return getComponentNameFromType(type as ComponentType);
  }

  if (
    tag === FiberTags.MemoComponent ||
    tag === FiberTags.SimpleMemoComponent
  ) {
    const elType = elementType as ComponentType | null;
    if (elType?.type) {
      const innerName = getComponentNameFromType(elType.type);
      if (innerName) return innerName;
    }
    if (elType?.displayName) return elType.displayName;
    return getComponentNameFromType(type as ComponentType);
  }

  if (tag === FiberTags.ContextProvider) {
    const elType = type as ComponentType | null;
    if (elType?._context?.displayName) {
      return `${elType._context.displayName}.Provider`;
    }
    return null;
  }

  if (tag === FiberTags.ContextConsumer) {
    const elType = type as ComponentType | null;
    if (elType?.displayName) {
      return `${elType.displayName}.Consumer`;
    }
    return null;
  }

  if (tag === FiberTags.LazyComponent) {
    const elType = elementType as ComponentType | null;
    if (elType?._status === 1 && elType._result) {
      return getComponentNameFromType(elType._result);
    }
    return null;
  }

  if (
    tag === FiberTags.SuspenseComponent ||
    tag === FiberTags.SuspenseListComponent
  ) {
    return null;
  }

  if (
    tag === FiberTags.IncompleteClassComponent ||
    tag === FiberTags.IncompleteFunctionComponent
  ) {
    return getComponentNameFromType(type as ComponentType);
  }

  if (
    tag === FiberTags.FunctionComponent ||
    tag === FiberTags.ClassComponent ||
    tag === FiberTags.IndeterminateComponent
  ) {
    return getComponentNameFromType(type as ComponentType);
  }

  return null;
}

function isMinifiedName(name: string): boolean {
  if (name.length <= 2) return true;
  if (name.length <= 3 && name === name.toLowerCase()) return true;
  return false;
}

/** Filtered-mode component names (innermost first), same defaults as agentation. */
function collectComponentNames(element: HTMLElement): string[] {
  const resolved = resolveConfig();

  if (!isReactPage()) {
    return [];
  }

  const domClasses =
    resolved.mode === "smart" ? getAncestorClasses(element) : undefined;

  const components: string[] = [];

  try {
    let fiber = getFiberFromElement(element);
    let depth = 0;

    while (
      fiber &&
      depth < resolved.maxDepth &&
      components.length < resolved.maxComponents
    ) {
      const name = getComponentNameFromFiber(fiber);

      if (
        name &&
        !isMinifiedName(name) &&
        shouldIncludeComponent(name, depth, resolved, domClasses)
      ) {
        components.push(name);
      }

      fiber = fiber.return;
      depth++;
    }
  } catch {
    return [];
  }

  return components;
}

// =============================================================================
// Source location (_debugSource + React 19 + stack probe)
// =============================================================================

interface ResolvedSource {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
  componentName?: string;
}

function getDisplayNameForSourceFiber(fiber: ReactFiber): string | null {
  if (!fiber.type) {
    return null;
  }

  if (typeof fiber.type === "string") {
    return null;
  }

  if (typeof fiber.type === "object" || typeof fiber.type === "function") {
    const type = fiber.type as { displayName?: string; name?: string };

    if (type.displayName) {
      return type.displayName;
    }

    if (type.name) {
      return type.name;
    }
  }

  return null;
}

function findDebugSource(
  fiber: ReactFiber,
  maxDepth = 50,
): { source: NonNullable<ReactFiber["_debugSource"]>; componentName: string | null } | null {
  let current: ReactFiber | null | undefined = fiber;
  let depth = 0;

  while (current && depth < maxDepth) {
    if (current._debugSource) {
      return {
        source: current._debugSource,
        componentName: getDisplayNameForSourceFiber(current),
      };
    }

    if (current._debugOwner?._debugSource) {
      return {
        source: current._debugOwner._debugSource,
        componentName: getDisplayNameForSourceFiber(current._debugOwner),
      };
    }

    current = current.return ?? null;
    depth++;
  }

  return null;
}

function findDebugSourceReact19(
  fiber: ReactFiber,
): { source: NonNullable<ReactFiber["_debugSource"]>; componentName: string | null } | null {
  let current: ReactFiber | null | undefined = fiber;
  let depth = 0;
  const maxDepth = 50;

  while (current && depth < maxDepth) {
    const anyFiber = current as unknown as Record<string, unknown>;

    const possibleSourceKeys = [
      "_debugSource",
      "__source",
      "_source",
      "debugSource",
    ];

    for (const key of possibleSourceKeys) {
      const source = anyFiber[key];
      if (source && typeof source === "object" && "fileName" in source) {
        return {
          source: source as NonNullable<ReactFiber["_debugSource"]>,
          componentName: getDisplayNameForSourceFiber(current),
        };
      }
    }

    if (current.memoizedProps) {
      const props = current.memoizedProps as Record<string, unknown>;
      if (props.__source && typeof props.__source === "object") {
        const source = props.__source as {
          fileName?: string;
          lineNumber?: number;
          columnNumber?: number;
        };
        if (source.fileName && source.lineNumber) {
          return {
            source: {
              fileName: source.fileName,
              lineNumber: source.lineNumber,
              columnNumber: source.columnNumber,
            },
            componentName: getDisplayNameForSourceFiber(current),
          };
        }
      }
    }

    current = current.return ?? null;
    depth++;
  }

  return null;
}

/** Callable component from a fiber (function / forwardRef render / memo inner). */
type FiberCallable = (...args: unknown[]) => unknown;

const sourceProbeCache = new Map<FiberCallable, ResolvedSource | null>();

function unwrapComponentType(fiber: ReactFiber): FiberCallable | null {
  const tag = fiber.tag;
  const type = fiber.type;
  const elementType = fiber.elementType as Record<string, unknown> | null | undefined;

  if (typeof type === "string" || type == null) return null;

  if (
    typeof type === "function" &&
    (type as { prototype?: { isReactComponent?: boolean } }).prototype?.isReactComponent
  ) {
    return null;
  }

  if (
    (tag === FiberTags.FunctionComponent || tag === FiberTags.IndeterminateComponent) &&
    typeof type === "function"
  ) {
    return type as FiberCallable;
  }

  if (tag === FiberTags.ForwardRef && elementType) {
    const render = elementType.render;
    if (typeof render === "function") return render as FiberCallable;
  }

  if (
    (tag === FiberTags.MemoComponent || tag === FiberTags.SimpleMemoComponent) &&
    elementType
  ) {
    const inner = elementType.type;
    if (typeof inner === "function") return inner as FiberCallable;
  }

  if (typeof type === "function") return type as FiberCallable;

  return null;
}

function getReactDispatcher(): {
  get: () => unknown;
  set: (d: unknown) => void;
} | null {
  const reactModule = React as unknown as Record<string, unknown>;

  const r19 = reactModule.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE as
    | Record<string, unknown>
    | undefined;
  if (r19 && "H" in r19) {
    return {
      get: () => r19.H,
      set: (d: unknown) => {
        r19.H = d;
      },
    };
  }

  const r18 = reactModule.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as
    | Record<string, unknown>
    | undefined;
  if (r18) {
    const dispatcher = r18.ReactCurrentDispatcher as
      | { current: unknown }
      | undefined;
    if (dispatcher && "current" in dispatcher) {
      return {
        get: () => dispatcher.current,
        set: (d: unknown) => {
          dispatcher.current = d;
        },
      };
    }
  }

  return null;
}

function parseComponentFrame(
  stack: string,
): { fileName: string; line: number; column?: number } | null {
  const lines = stack.split("\n");

  const skipPatterns = [
    /node_modules\//,
    /react-dom/,
    /react\.development/,
    /react\.production/,
    /chunk-[A-Z0-9]+/i,
    /react-stack-bottom-frame/,
    /react-reconciler/,
    /scheduler/,
    /<anonymous>/,
  ];

  const v8Re = /^\s*at\s+(?:.*?\s+\()?(.+?):(\d+):(\d+)\)?$/;
  const webkitRe = /^[^@]*@(.+?):(\d+):(\d+)$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (skipPatterns.some((p) => p.test(trimmed))) continue;

    const match = v8Re.exec(trimmed) || webkitRe.exec(trimmed);
    if (match) {
      return {
        fileName: match[1],
        line: Number.parseInt(match[2], 10),
        column: Number.parseInt(match[3], 10),
      };
    }
  }

  return null;
}

function cleanSourcePath(rawPath: string): string {
  let path = rawPath;

  path = path.replace(/[?#].*$/, "");
  path = path.replace(/^turbopack:\/\/\/\[project\]\//, "");
  path = path.replace(/^webpack-internal:\/\/\/\.\//, "");
  path = path.replace(/^webpack-internal:\/\/\//, "");
  path = path.replace(/^webpack:\/\/\/\.\//, "");
  path = path.replace(/^webpack:\/\/\//, "");
  path = path.replace(/^turbopack:\/\/\//, "");
  path = path.replace(/^https?:\/\/[^/]+\//, "");
  path = path.replace(/^file:\/\/\//, "/");
  path = path.replace(/^\([^)]+\)\/\.\//, "");
  path = path.replace(/^\.\//, "");

  return path;
}

function probeComponentSource(fiber: ReactFiber): ResolvedSource | null {
  const fn = unwrapComponentType(fiber);
  if (!fn) return null;

  const cachedProbe = sourceProbeCache.get(fn);
  if (cachedProbe !== undefined) {
    return cachedProbe;
  }

  const dispatcher = getReactDispatcher();
  if (!dispatcher) {
    sourceProbeCache.set(fn, null);
    return null;
  }

  const original = dispatcher.get();
  let result: ResolvedSource | null = null;

  try {
    const stackCapturingDispatcher = new Proxy(
      {},
      {
        get() {
          throw new Error("probe");
        },
      },
    );
    dispatcher.set(stackCapturingDispatcher);

    try {
      fn({});
    } catch (e) {
      if (e instanceof Error && e.message === "probe" && e.stack) {
        const frame = parseComponentFrame(e.stack);
        if (frame) {
          const cleaned = cleanSourcePath(frame.fileName);
          result = {
            fileName: cleaned,
            lineNumber: frame.line,
            columnNumber: frame.column,
            componentName: getDisplayNameForSourceFiber(fiber) || undefined,
          };
        }
      }
    }
  } finally {
    dispatcher.set(original);
  }

  sourceProbeCache.set(fn, result);
  return result;
}

function probeSourceWalk(
  fiber: ReactFiber,
  maxDepth = 15,
): ResolvedSource | null {
  let current: ReactFiber | null | undefined = fiber;
  let depth = 0;

  while (current && depth < maxDepth) {
    const source = probeComponentSource(current);
    if (source) return source;

    current = current.return ?? null;
    depth++;
  }

  return null;
}

function tryResolveSource(element: HTMLElement): ResolvedSource | null {
  const fiber = getFiberFromElement(element);
  if (!fiber) return null;

  let debugInfo = findDebugSource(fiber);
  if (!debugInfo) {
    debugInfo = findDebugSourceReact19(fiber);
  }

  if (debugInfo?.source) {
    return {
      fileName: debugInfo.source.fileName,
      lineNumber: debugInfo.source.lineNumber,
      columnNumber: debugInfo.source.columnNumber,
      componentName: debugInfo.componentName || undefined,
    };
  }

  return probeSourceWalk(fiber);
}

// =============================================================================
// Public API
// =============================================================================

export function getComponent(element: HTMLElement): {
  componentName: string;
  filePath: string;
} {
  const source = tryResolveSource(element);
  const components = collectComponentNames(element);

  const componentName =
    (source?.componentName && String(source.componentName)) ||
    components[0] ||
    "";

  const filePath = source?.fileName ?? "";

  return { componentName, filePath };
}
