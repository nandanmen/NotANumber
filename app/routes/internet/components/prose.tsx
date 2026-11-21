import type { ReactNode } from "react";

// Text-only building blocks for the article body.

export function Callout({ children }: { children: ReactNode }) {
  return <div className="grid gap-y-4 border-l-2 border-gray-7 pl-4">{children}</div>;
}

export function ProblemStatement({ children }: { children: ReactNode }) {
  return <div className="grid gap-y-4 border bg-white p-4 font-medium">{children}</div>;
}

export function Aside({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="grid gap-y-4 border bg-white p-6">
      <p className="font-medium">{label}</p>
      {children}
    </aside>
  );
}

// Inline stand-ins for the figures' routers and computers, so the text can
// point at them directly. Colors match each network in the figures.
const NETWORK_COLORS = {
  1: { router: "var(--blue-9)", computer: "var(--blue-7)" },
  2: { router: "var(--orange-8)", computer: "var(--orange-8)" },
} as const;

type Network = keyof typeof NETWORK_COLORS;

/**
 * A router's numbered card, as it appears in the figures. Its digit sits on the
 * text's baseline, so it's raised by half the difference between the text's
 * cap height and the digit's, centering the card on the surrounding capitals.
 */
export function Router({ network }: { network: Network }) {
  return (
    <span
      className="inline-grid size-[1.5em] place-items-center align-[0.12em] text-[0.75em] font-bold leading-none text-white"
      style={{ background: NETWORK_COLORS[network].router }}
    >
      <span className="sr-only">Router </span>
      {network}
    </span>
  );
}

/** A computer's shape, in its network's color, as it appears in the figures. */
export function Computer({
  shape,
  network,
  label,
}: {
  shape: "circle" | "square" | "triangle" | "diamond";
  network: Network;
  label: string;
}) {
  const common = {
    style: { fill: NETWORK_COLORS[network].computer, stroke: "var(--gray-12)" },
    strokeWidth: 1.5,
    vectorEffect: "non-scaling-stroke" as const,
  };
  const h = Math.sqrt(3) / 2;
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="-0.5 -0.5 1 1"
      className="inline-block size-[1em] align-[-0.15em] overflow-visible"
    >
      {shape === "circle" && <circle r="0.4" {...common} />}
      {shape === "square" && <rect x="-0.4" y="-0.4" width="0.8" height="0.8" {...common} />}
      {shape === "triangle" && (
        <polygon points={`0,${(-2 * h) / 3} 0.5,${h / 3} -0.5,${h / 3}`} {...common} />
      )}
      {shape === "diamond" && <polygon points="0,-0.6 0.48,0 0,0.6 -0.48,0" {...common} />}
    </svg>
  );
}
