import React from "react";
import { useIndexContext } from "app/svg-paths/components/index-provider";
import { Ripple } from "app/svg-paths/components/ripple";
import { Circle } from "app/svg-paths/components/svg/circle";
import { Path } from "app/svg-paths/components/svg/path";
import { parsePath } from "app/svg-paths/lib/path";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useSvgContext } from "app/svg-paths/components/svg";
import { useStateContext } from "../state";

const path = parsePath("M 7 7 A 8 8 0 0 0 18 18");

export const initialState = {
  slice: [1],
  active: ["1.largeArc", "1.sweep"],
  path,
};

export const components = { Flags };

function Flags() {
  const { index } = useIndexContext();
  const { data } = useStateContext("flags");
  const arc = data.path.atAbsolute<"A">(1);
  return (
    <>
      <Path
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", duration: 1.5, delay: 1 }}
        className="stroke-gray8 fill-none"
        d="M 7 7 A 8 8 0 0 1 18 18"
      />
      <Path
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", duration: 1.5, delay: 1.2 }}
        className="stroke-gray8 fill-none"
        d="M 7 7 A 8 8 0 1 0 18 18"
      />
      <Path
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", duration: 1.5, delay: 1.3 }}
        className="stroke-gray8 fill-none"
        d="M 7 7 A 8 8 0 1 1 18 18"
      />
      <Path
        d="M 7 7 A 8 8 0 0 0 18 18"
        className="stroke-gray8 fill-none"
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
      />
      {index === 4 && (
        <Path
          d="M 7 7 A 8 8 0 0 0 18 18"
          animate={{ pathLength: 1 }}
          initial={{ pathLength: 0 }}
          transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
        />
      )}
      {index === 5 && (
        <>
          <ArrowPath d="M 7 7 A 8 8 0 0 1 18 18" />
          <ArrowPath d="M 7 7 A 8 8 0 1 1 18 18" delay={0.3} />
        </>
      )}
      {index === 6 && (
        <>
          <ArrowPath d="M 7 7 A 8 8 0 0 0 18 18" />
          <ArrowPath d="M 7 7 A 8 8 0 1 0 18 18" delay={0.3} />
        </>
      )}
      {index === 7 && <SweepToggle arc={arc} />}
      {index === 8 && (
        <Path
          animate={{
            d: arc.largeArc
              ? `M 7 7 C -4 15.5 11 28.5 18 18`
              : `M 7 7 C 2.8 15 11 22 18 18`,
          }}
          transition={{
            type: "spring",
            duration: 1,
          }}
        />
      )}
      <Ripple cx={7} cy={7}>
        <Circle cx={7} cy={7} variant="point" />
      </Ripple>
      <Ripple cx={18} cy={18} delay={0.2}>
        <Circle cx={18} cy={18} variant="point" />
      </Ripple>
    </>
  );
}

function SweepToggle({ arc }) {
  return (
    <Path
      animate={{
        d: arc.sweep
          ? `M 7 7 C 15 2.8 22 11 18 18`
          : `M 7 7 C 2.8 15 11 22 18 18`,
      }}
      transition={{
        type: "spring",
        duration: 1,
      }}
    />
  );
}

const ArrowPath = ({ d, delay = 0 }) => {
  const ref = React.useRef<SVGGElement>(null);
  const { getRelative } = useSvgContext();
  const pathLength = useMotionValue(0);
  const opacity = useTransform(pathLength, (v) => (v > 0.05 ? 1 : 0));

  React.useEffect(() => {
    pathLength.on("change", (v) => {
      if (v > 0.05) {
        ref.current?.style.setProperty("offset-distance", `${v * 100}%`);
      }
    });
  }, [pathLength]);

  return (
    <g>
      <Path
        style={{ pathLength }}
        animate={{ pathLength: 0.96 }}
        initial={{ pathLength: 0 }}
        transition={{
          type: "spring",
          duration: 1.5,
          bounce: 0.1,
          delay,
        }}
        d={d}
      />
      <motion.g
        ref={ref}
        style={{
          offsetPath: `path('${d}')`,
          transformOrigin: "1.15px 0.5px",
          opacity,
        }}
      >
        <path
          className="fill-none stroke-current"
          strokeWidth={getRelative(1)}
          d="M 0 0 l 1 0.5 l -1 0.5"
          strokeLinecap="round"
        />
      </motion.g>
    </g>
  );
};

export const page = {
  children: <Flags />,
};
