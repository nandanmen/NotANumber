"use client";

import { Hello } from "./hello";
import { Figure } from "./figure";
import { useMotionValue, animate } from "motion/react";
import { CheckAnimation, CheckAnimationWrapper } from "./shared";

export function Drawing() {
  return (
    <Figure
      variant="grid"
      className="px-8 flex items-center justify-center h-[320px]"
    >
      <div className="w-full max-w-[450px] relative">
        <Hello />
      </div>
    </Figure>
  );
}

export function Checkmarks({
  showSkeleton = false,
  dashLength = 16,
}: {
  showSkeleton?: boolean;
  dashLength?: number;
}) {
  const offset = useMotionValue(0);
  return (
    <CheckAnimationWrapper
      onPlay={async () => {
        await animate(offset, [0, -dashLength], {
          type: "spring",
          bounce: 0,
          duration: 1,
        });
        await animate(offset, [dashLength, 0], {
          type: "spring",
          bounce: 0,
          duration: 1,
        });
      }}
    >
      <CheckAnimation
        dashLength={dashLength}
        offset={offset}
        showSkeleton={showSkeleton}
        variant="stroke"
        highlight={showSkeleton && 2}
      />
      <CheckAnimation
        dashLength={dashLength}
        offset={offset}
        showSkeleton={showSkeleton}
        variant="fill"
        highlight={showSkeleton && 2}
      />
    </CheckAnimationWrapper>
  );
}
