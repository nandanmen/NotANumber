import {
  useMotionValue,
  motion,
  useAnimationFrame,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import React from "react";
import { GridBackground } from "~/components/Grid";
import { styled } from "~/stitches.config";

const DURATION = 2000;

export const Button = () => {
  const rectRef = React.useRef<SVGRectElement | null>(null);
  const currentLength = useMotionValue(0);

  useAnimationFrame((elapsedTime) => {
    const length = rectRef.current?.getTotalLength();
    if (length) {
      const unitsPerMs = length / DURATION;
      currentLength.set((elapsedTime * unitsPerMs) % length);
    }
  });

  const x = useTransform(
    currentLength,
    (val) => rectRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    currentLength,
    (val) => rectRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <GridBackground>
      <ContentWrapper>
        <Wrapper>
          <GlowWrapper mask>
            <MovingGlowWrapper>
              <svg preserveAspectRatio="none" width="100%" height="100%">
                <rect width="100%" height="100%" fill="none" ref={rectRef} />
                <foreignObject x="0" y="0" width="100%" height="100%">
                  <GlowBox blur style={{ transform }} />
                </foreignObject>
              </svg>
            </MovingGlowWrapper>
          </GlowWrapper>
          <Text>Hello!</Text>
        </Wrapper>
      </ContentWrapper>
    </GridBackground>
  );
};

export const WithoutMaskAndBlur = () => {
  const rectRef = React.useRef<SVGRectElement | null>(null);
  const currentLength = useMotionValue(0);

  useAnimationFrame((elapsedTime) => {
    const length = rectRef.current?.getTotalLength();
    if (length) {
      const unitsPerMs = length / DURATION;
      currentLength.set((elapsedTime * unitsPerMs) % length);
    }
  });

  const x = useTransform(
    currentLength,
    (val) => rectRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    currentLength,
    (val) => rectRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <GridBackground>
      <ContentWrapper>
        <Wrapper>
          <GlowWrapper>
            <MovingGlowWrapper>
              <svg preserveAspectRatio="none" width="100%" height="100%">
                <rect width="100%" height="100%" fill="none" ref={rectRef} />
                <foreignObject x="0" y="0" width="100%" height="100%">
                  <GlowBox style={{ transform }} />
                </foreignObject>
              </svg>
            </MovingGlowWrapper>
          </GlowWrapper>
          <Text>Hello!</Text>
        </Wrapper>
      </ContentWrapper>
    </GridBackground>
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
  background: "$blue10",

  variants: {
    blur: {
      true: {
        filter: "blur(16px)",
      },
    },
  },
});

// --

const ContentWrapper = styled("div", {
  padding: "$8",
  display: "flex",
  justifyContent: "center",
});

const Wrapper = styled("button", {
  position: "relative",
  padding: "$3 $6",
  background: "$blue5",
  borderRadius: "$base",
  border: "2px solid $blue6",
});
