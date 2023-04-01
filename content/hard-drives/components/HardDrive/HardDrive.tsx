import {
  motion,
  useAnimationControls,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import React from "react";
import { FullWidth } from "~/components/FullWidth";
import { Slider } from "~/components/Slider";
import {
  SvgBackgroundGradient,
  getFillFromId,
} from "~/components/utils/SvgBackgroundGradient";
import { range } from "~/lib/utils";
import { styled } from "~/stitches.config";

const numArcs = 6;
const numSectors = 5;

const ARC_LENGTH = (2 * Math.PI * 20) / numArcs;

const getRadius = (i: number) => 20 + ((i + 1) * (70 - 20)) / numSectors;

export const HardDrive = () => {
  const [rotation, setRotation] = React.useState(20);
  const rotationAnimation = useAnimationControls();
  const arcGroupControls = useAnimationControls();
  const rotate = useMotionValue(0);
  const id = React.useId();
  const highlightId = React.useId();
  const [reading, setReading] = React.useState(false);

  React.useEffect(() => {
    rotate.onChange((r) => {
      if (r >= 95 && r <= 220) {
        setReading(true);
      } else {
        setReading(false);
      }
    });
  }, [rotate]);

  return (
    <FullWidth>
      <Slider
        min={20}
        max={48}
        step={0.5}
        value={[rotation]}
        onValueChange={([r]) => {
          setRotation(r);
          rotationAnimation.start({
            rotate: -1 * r,
          });
        }}
      />
      <Box as="div" css={{ background: "$gray4", padding: "$12" }}>
        <svg viewBox="20 0 180 160">
          <SvgBackgroundGradient
            id={id}
            startColor="var(--colors-gray3)"
            stopColor="var(--colors-gray4)"
            rotate={90}
          />
          <SvgBackgroundGradient
            id={highlightId}
            startColor="var(--colors-blue5)"
            stopColor="var(--colors-blue6)"
            rotate={90}
          />
          <Box
            stroke="var(--colors-gray9)"
            strokeWidth="0.3"
            fill="var(--colors-gray4"
          >
            <Box as={motion.g} style={{ x: 120, y: 80, rotate }}>
              <circle r="71" fill={getFillFromId(id)} />
              <circle r="70" stroke="none" />
              <motion.g
                animate="visible"
                initial="hidden"
                stroke="var(--colors-gray7)"
                transition={{ staggerChildren: 0.1 }}
              >
                {range(numSectors).map((i) => {
                  const r = getRadius(i);
                  const numArcs = Math.floor((2 * Math.PI * r) / ARC_LENGTH);
                  return (
                    <>
                      <motion.circle
                        key={r}
                        variants={{
                          visible: { r },
                          hidden: { r: 0 },
                        }}
                        transition={{ type: "spring", damping: 20 }}
                        onAnimationComplete={() => {
                          if (i === numSectors - 1) {
                            arcGroupControls.start("shown");
                            rotationAnimation.start({
                              rotate: -41,
                              transition: {
                                type: "spring",
                                damping: 20,
                              },
                            });
                          }
                        }}
                        fill="none"
                      />
                      {range(numArcs).map((j) => {
                        const angle = j * (360 / numArcs);
                        return (
                          <PolarLine
                            key={j}
                            index={i}
                            p0={{ angle, radius: r }}
                            p1={{ angle, radius: getRadius(i - 1) }}
                          />
                        );
                      })}
                    </>
                  );
                })}
              </motion.g>
              <Box
                as="circle"
                css={{ filter: `drop-shadow( 0px 1px 0px rgba(0, 0, 0, .05))` }}
                r="20"
                fill={getFillFromId(id)}
              />
              <g>
                <Bolt cy={-12} rotation={rotate} />
                <Bolt cy={12} rotation={rotate} />
                <Bolt cx={-12} rotation={rotate} />
                <Bolt cx={12} rotation={rotate} />
                <Box
                  as="circle"
                  r="5"
                  fill="var(--colors-gray2)"
                  css={{
                    filter: `drop-shadow( 0px 1px 0px rgba(0, 0, 0, .05))`,
                  }}
                />
              </g>
              <g
                fill={getFillFromId(highlightId)}
                stroke="var(--colors-blue8)"
                strokeWidth="0.3"
              >
                <ArcGroup
                  startAngle={0}
                  sectorNumber={1}
                  length={4}
                  animate={arcGroupControls}
                  onAnimationComplete={() => {
                    animate(rotate, 360, {
                      type: "tween",
                      // ease: "linear",
                      duration: 8,
                    });
                  }}
                />
              </g>
            </Box>
            <motion.g style={{ x: 30, y: 30 }}>
              <Box
                as={motion.g}
                style={{
                  originX: "9px",
                  originY: "9px",
                }}
                animate={rotationAnimation}
                fill={getFillFromId(id)}
              >
                <motion.g style={{ x: 6.5, y: 90 }}>
                  <motion.circle
                    animate={{ r: reading ? 2 : 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    stroke="none"
                    cx="2.5"
                    cy="8"
                    fill="var(--colors-blue7)"
                  />
                  <Box
                    as="path"
                    d="M 0 0 l 2.5 8 l 2.5 -8 z"
                    fill="var(--colors-gray3)"
                    css={{
                      filter: `drop-shadow( 0px 1px 0px rgba(0, 0, 0, .05))`,
                    }}
                  />
                </motion.g>
                <Box
                  as="path"
                  d="M 0 9 l 5 80 l 1 2 h 6 l 1 -2 l 5 -80 A 9 9 0 0 0 0 9"
                  css={{
                    filter: `drop-shadow( 0px 1px 0px rgba(0, 0, 0, .05))`,
                  }}
                />
                <Box
                  as="circle"
                  css={{
                    filter: `drop-shadow( 0px 1px 0px rgba(0, 0, 0, .05))`,
                  }}
                  r="6"
                  cx="9"
                  cy="9"
                  fill="var(--colors-gray2)"
                />
              </Box>
            </motion.g>
          </Box>
        </svg>
      </Box>
    </FullWidth>
  );
};

const ArcGroup = ({ startAngle, sectorNumber, length = 1, ...props }) => {
  const radius = getRadius(sectorNumber);
  const arcAngle = 360 / Math.floor((2 * Math.PI * radius) / ARC_LENGTH);
  return (
    <Box
      as={motion.g}
      initial="hidden"
      transition={{ staggerChildren: 0.1 }}
      {...props}
    >
      {range(length).map((i) => {
        return (
          <Arc
            key={i}
            startAngle={startAngle + i * arcAngle}
            sectorNumber={sectorNumber}
          />
        );
      })}
    </Box>
  );
};

const Arc = ({ startAngle, sectorNumber }) => {
  const radius = getRadius(sectorNumber);
  const numArcs = Math.floor((2 * Math.PI * radius) / ARC_LENGTH);
  const arcAngle = 360 / numArcs;
  const endAngle = startAngle + arcAngle;

  const { x: x1, y: y1 } = toCartesian(startAngle, radius);
  const { x: x2, y: y2 } = toCartesian(endAngle, radius);

  const innerRadius = getRadius(sectorNumber - 1);
  const { x: x3, y: y3 } = toCartesian(endAngle, innerRadius);
  const { x: x4, y: y4 } = toCartesian(startAngle, innerRadius);

  const d = [
    `M ${x1} ${y1}`,
    `A ${radius} ${radius} 0 0 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");

  return (
    <Box
      as={motion.path}
      variants={{
        shown: { scale: 1 },
        hidden: { scale: 0 },
      }}
      transition={{ type: "spring", damping: 20 }}
      d={d}
      css={{
        filter: `drop-shadow( 0px 1px 0px rgba(0, 0, 0, .05))`,
      }}
    />
  );
};

const Bolt = ({ cy = 0, cx = 0, rotation }) => {
  const id = React.useId();
  const inverse = useTransform(rotation, (r) => r * -1);
  return (
    <motion.g style={{ y: cy, x: cx }}>
      <mask id={id}>
        <circle r="6" x="0" y="0" width="3" height="3" fill="black" />
        <circle r="2.7" x="0" y="0" width="3" height="3" fill="white" />
      </mask>
      <circle r="3" fill="var(--colors-gray8)" />
      <motion.circle
        r="3"
        cx="0"
        cy="1"
        mask={getFillFromId(id)}
        fill="var(--colors-gray4)"
        stroke="none"
        style={{ rotate: inverse, originX: "0px", originY: "0px" }}
      />
    </motion.g>
  );
};

type PolarCoordinates = {
  angle: number;
  radius: number;
};

const PolarLine = ({
  p0,
  p1,
  index,
  animate = true,
}: {
  p0: PolarCoordinates;
  p1: PolarCoordinates;
  index?: number;
  animate?: boolean;
}) => {
  return (
    <motion.g style={{ originX: "0px", originY: "0px", rotate: p0.angle }}>
      <motion.line
        x1="0"
        y1={p1.radius}
        x2="0"
        y2={p0.radius}
        {...(animate && {
          animate: { pathLength: 1 },
          initial: { pathLength: 0 },
          transition: { type: "spring", damping: 20, delay: 2 * (0.1 * index) },
        })}
      />
    </motion.g>
  );
};

const Box = styled("g", {});

const toCartesian = (angle: number, radius: number) => {
  const angleInRadians = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: radius * Math.cos(angleInRadians),
    y: radius * Math.sin(angleInRadians),
  };
};
