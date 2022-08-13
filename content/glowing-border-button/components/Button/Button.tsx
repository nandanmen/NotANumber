import {
  useMotionValue,
  motion,
  useAnimationFrame,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import React from "react";
import { styled } from "~/stitches.config";

const DURATION = 2000;

export const Button = ({ mask = true, blur = true, playing = true }) => {
  const rectRef = React.useRef<SVGRectElement | null>(null);
  const lastPausedTime = React.useRef(0);
  const currentLength = useMotionValue(0);

  useAnimationFrame((elapsedTime) => {
    const length = rectRef.current?.getTotalLength();
    if (!playing) {
      lastPausedTime.current = elapsedTime;
    } else if (length) {
      const unitsPerMs = length / DURATION;
      currentLength.set(
        ((elapsedTime - lastPausedTime.current) * unitsPerMs) % length
      );
    }
  });

  const x = useTransform(
    currentLength,
    (val) => rectRef.current?.getPointAtLength(val).x ?? 0
  );
  const y = useTransform(
    currentLength,
    (val) => rectRef.current?.getPointAtLength(val).y ?? 0
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <Wrapper>
      <GlowWrapper mask={mask}>
        <MovingGlowWrapper>
          <svg preserveAspectRatio="none" width="100%" height="100%">
            <rect width="100%" height="100%" fill="none" ref={rectRef} />
            <foreignObject x="0" y="0" width="100%" height="100%">
              <GlowBox
                blur={blur}
                style={{
                  transform: playing ? transform : `translate(-50%, -50%)`,
                }}
              />
            </foreignObject>
          </svg>
        </MovingGlowWrapper>
      </GlowWrapper>
      <Text>Hello!</Text>
    </Wrapper>
  );
};

const Text = styled("span", {
  fontSize: "$lg",
  fontFamily: "$serif",
  fontWeight: 500,
  color: "$blue11",
});

const MovingGlowWrapper = styled("div", {
  position: "absolute",
  inset: -2,
});

const GlowWrapper = styled("div", {
  position: "absolute",
  inset: -2,
  borderRadius: "inherit",
  border: "2px solid transparent",

  variants: {
    mask: {
      true: {
        "-webkit-mask": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        "-webkit-mask-composite": "xor",
      },
    },
  },
});

const GlowBox = styled(motion.div, {
  height: 32,
  width: 32,
  background: "$blue11",

  variants: {
    blur: {
      true: {
        filter: "blur(16px)",
      },
    },
  },
});

// --

const Wrapper = styled("button", {
  position: "relative",
  padding: "$3 $6",
  background: "$blue5",
  borderRadius: "$base",
  border: "2px solid $blue6",
});
