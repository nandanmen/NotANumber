import { Suspense, lazy, useEffect, useState } from "react";

/**
 * Sandpack evaluates code at import time, which Cloudflare Workers don't allow
 * during server rendering, so the sandbox only loads in the browser. The
 * server renders a placeholder of roughly the same size.
 */
const SandboxClient = lazy(() =>
  import("./SandboxClient").then((module) => ({ default: module.Sandbox })),
);

// Editor + tab bar + 400px preview, measured from the rendered sandbox.
const SANDBOX_PLACEHOLDER_HEIGHT = 843;

type SandboxProps = {
  files?: any;
  dependencies?: Record<string, string>;
};

const placeholder = (
  <div
    aria-hidden
    className="rounded-[var(--sp-border-radius,4px)] bg-[#151515]"
    style={{ minHeight: SANDBOX_PLACEHOLDER_HEIGHT }}
  />
);

export const Sandbox = (props: SandboxProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return placeholder;
  return (
    <Suspense fallback={placeholder}>
      <SandboxClient {...props} />
    </Suspense>
  );
};
