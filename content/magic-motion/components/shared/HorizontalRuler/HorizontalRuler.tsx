import { motion } from "framer-motion";
import { keyframes, styled } from "~/stitches.config";

export const HorizontalRuler = ({
  from,
  to,
  showLine = true,
  small = false,
}) => {
  const distance = to - from;
  return (
    <g>
      {showLine && <Line x1={from} x2={to} y1="0" y2="0" />}
      <LineEndpoint cx={from} small={small} cy="0" />
      <LineEndpoint cx={to} small={small} cy="0" />
      <g style={{ transform: `translateX(${(to - from) / 2 + from}px)` }}>
        <RulerTextBackground small={small} />
        <RulerText
          x="0"
          textAnchor="middle"
          dominantBaseline="middle"
          small={small}
        >
          {distance.toFixed(1)}
        </RulerText>
      </g>
    </g>
  );
};

export const RulerTextBackground = ({ small = false, ...props }) => {
  const smallProps = small
    ? {
        x: -25,
        y: -12.5,
      }
    : {
        x: -30,
        y: -15,
      };
  return (
    <RulerTextBackgroundRect rx="4" small={small} {...smallProps} {...props} />
  );
};

const RulerTextBackgroundRect = styled("rect", {
  width: 60,
  fill: "$blue2",
  height: 30,
  stroke: "$blue8",

  variants: {
    small: {
      true: {
        width: 50,
        height: 25,
      },
    },
  },
});

const RulerText = styled("text", {
  fill: "$blue10",
  fontFamily: "$mono",
  fontSize: "$sm",

  variants: {
    small: {
      true: {
        fontSize: 12,
      },
    },
  },
});

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const Line = styled(motion.line, {
  stroke: "$blue8",
  strokeDasharray: "4",
  animationName: `${fadeIn}`,
  animationDuration: "500ms",
  animationFillMode: "forwards",
  animationTimingFunction: "ease-out",
});

export const LineEndpoint = styled(motion.circle, {
  r: "6px",
  fill: "$blue2",
  stroke: "$blue8",
  animationName: `${fadeIn}`,
  animationDuration: "500ms",
  animationFillMode: "forwards",
  animationTimingFunction: "ease-out",

  variants: {
    small: {
      true: {
        r: "4px",
      },
    },
  },
});
