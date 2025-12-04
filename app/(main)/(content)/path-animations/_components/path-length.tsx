"use client";

import { animate, useMotionValue } from "motion/react";
import { CheckAnimation, CheckAnimationWrapper } from "./shared";

export function PathLength({ inverse = false }) {
  const offsetLarge = useMotionValue(inverse ? 0 : 64);
  const offsetSmall = useMotionValue(inverse ? 0 : 16);
  return (
    <CheckAnimationWrapper
      onPlay={async () => {
        await Promise.all([
          animate(offsetLarge, inverse ? [0, 64] : [64, 0], {
            duration: 2,
            type: "spring",
            bounce: 0,
          }),
          animate(offsetSmall, inverse ? [0, 16] : [16, 0], {
            duration: 2,
            type: "spring",
            bounce: 0,
          }),
        ]);
      }}
    >
      <CheckAnimation
        showSkeleton
        highlight={3}
        dashLength={64}
        offset={offsetLarge}
      />
      <CheckAnimation showSkeleton highlight={3} offset={offsetSmall} />
    </CheckAnimationWrapper>
  );
}

export function PathLengthVisual() {
  return (
    <CheckAnimationWrapper className="grid-cols-1">
      <div className="relative">
        <svg viewBox="0 0 200 50" width="100%" aria-hidden="true">
          <path
            d="M 25 25 H 75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </CheckAnimationWrapper>
  );
}
