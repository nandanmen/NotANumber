import React from "react";
import { Content } from "~/components/Visualizer";
import { styled } from "~/stitches.config";

export const FramerMagicMotion = () => {
  return (
    <Wrapper>
      <Background />
      <svg viewBox="0 0 100 100" style={{ position: "relative" }}>
        <defs>
          <linearGradient id="my-gradient" gradientTransform="rotate(45)">
            <stop offset="0%" stopColor="var(--colors-blue5)" />
            <stop offset="100%" stopColor="var(--colors-blue7)" />
          </linearGradient>
        </defs>
        <Rect rx="2" x="40" y="10" type="secondary" />
        <Rect rx="2" x="11" y="41" type="shadow" />
        <Rect rx="2" x="10" y="40" fill="url('#my-gradient')" />
        <path
          fill="none"
          stroke="var(--colors-gray12)"
          strokeWidth="0.2"
          strokeDasharray="2 1"
          d="M 10 40 A 45 45 0 0 1 40 10"
        />
        <path
          fill="none"
          stroke="var(--colors-gray12)"
          strokeWidth="0.2"
          strokeDasharray="2 1"
          d="M 60 40 A 80 80 0 0 1 90 10"
        />
        <path
          fill="none"
          stroke="var(--colors-gray12)"
          strokeWidth="0.2"
          strokeDasharray="2 1"
          d="M 60 90 A 80 80 0 0 0 90 60"
        />
        <circle
          cx="10"
          cy="40"
          r="2"
          stroke="black"
          fill="white"
          strokeWidth="0.2"
        />
        <circle
          cx="60"
          cy="40"
          r="2"
          stroke="black"
          fill="white"
          strokeWidth="0.2"
        />
        <circle
          cx="10"
          cy="90"
          r="2"
          stroke="black"
          fill="white"
          strokeWidth="0.2"
        />
        <circle
          cx="60"
          cy="90"
          r="2"
          stroke="black"
          fill="white"
          strokeWidth="0.2"
        />
        <circle
          cx="40"
          cy="10"
          r="2"
          stroke="black"
          fill="white"
          strokeWidth="0.2"
        />
        <circle
          cx="90"
          cy="10"
          r="2"
          stroke="black"
          fill="white"
          strokeWidth="0.2"
        />
        <circle
          cx="90"
          cy="60"
          r="2"
          stroke="black"
          fill="white"
          strokeWidth="0.2"
        />
      </svg>
    </Wrapper>
  );
};

const Square = styled("div", {
  $$gap: "10%",
  width: "50%",
  aspectRatio: 1,
  position: "absolute",
  background: "linear-gradient(-45deg, $blue6, $blue5)",
  border: "1px solid $gray12",
  borderRadius: 12,
  boxShadow: "4px 4px 0 $colors$gray12",

  variants: {
    inactive: {
      true: {
        background: "$gray4",
        border: "1px dashed $gray10",
        boxShadow: "none",
      },
    },
  },
});

const Background = styled(Content, {
  position: "absolute",
  inset: 0,
  borderRadius: 9999,
  border: "1px solid $gray8",
});

const Wrapper = styled("div", {
  height: "100%",
  position: "relative",
});

const Rect = styled("rect", {
  width: 50,
  height: 50,
  strokeWidth: 0.2,
  stroke: "$gray12",

  variants: {
    type: {
      secondary: {
        fill: "none",
        strokeDasharray: "2 1",
      },
      shadow: {
        fill: "$gray12",
      },
    },
  },
});
