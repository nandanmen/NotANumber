import useInterval from "@use-it/interval";
import { useState } from "react";
import { cn } from "~/lib/cn";

export function DotAnimation({ children }: { children: React.ReactNode }) {
  const [visibleDots, setVisibleDots] = useState(0);

  useInterval(() => {
    setVisibleDots((v) => (v + 1) % 4);
  }, 350);

  return (
    <span>
      {children}
      <span className={cn("opacity-0", visibleDots > 0 && "opacity-100")}>
        .
      </span>
      <span className={cn("opacity-0", visibleDots > 1 && "opacity-100")}>
        .
      </span>
      <span className={cn("opacity-0", visibleDots > 2 && "opacity-100")}>
        .
      </span>
    </span>
  );
}
