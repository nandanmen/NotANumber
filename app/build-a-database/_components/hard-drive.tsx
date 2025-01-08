import {
  motion,
  useAnimationControls,
  useMotionValue,
  animate,
} from "framer-motion";
import React from "react";
import { Slider } from "~/components/Slider";
import { range } from "~/lib/utils";
import { styled } from "~/stitches.config";

const numArcs = 4;
const numSectors = 3;

const ARC_LENGTH = (2 * Math.PI * 20) / numArcs;

const getRadius = (i: number) => 20 + ((i + 1) * (70 - 20)) / numSectors;

export const HardDrive = () => {
  const [rotation, setRotation] = React.useState(20);
  const rotationAnimation = useAnimationControls();
  const arcGroupControls = useAnimationControls();
  const rotate = useMotionValue(0);
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
    <>
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
      <div className="!col-span-2 w-2/3 border border-gray8 rounded-lg bg-gray5 py-6">
        <svg
          className="stroke-gray9 mx-auto"
          width="600"
          viewBox="-4 -4 208 168"
        >
          <g className="stroke-gray8">
            <rect
              vectorEffect="non-scaling-stroke"
              className="fill-gray4"
              y="2"
              x="2"
              width="196"
              height="156"
              rx="6"
            />
            <circle
              cx="8"
              cy="8"
              r="3"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="8"
              cy="152"
              r="3"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="192"
              cy="8"
              r="3"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="192"
              cy="152"
              r="3"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <g strokeWidth="0.3" fill="none">
            <Box as={motion.g} style={{ x: 120, y: 80, rotate }}>
              <circle r="72" />
              <circle r="70" stroke="none" />
              <motion.g
                animate="visible"
                initial="hidden"
                stroke="var(--colors-gray9)"
                strokeDasharray="1"
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
              <Box as="circle" r="20" className="fill-gray3" />
              <g>
                <Bolt cy={-12} />
                <Bolt cy={12} />
                <Bolt cx={-12} />
                <Bolt cx={12} />
                <Box as="circle" r="5" fill="var(--colors-gray2)" />
              </g>
              <g className="stroke-blue8 fill-blue5" strokeWidth="0.3">
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
                className="fill-gray3"
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
                  />
                </motion.g>
                <Box
                  as="path"
                  d="M 0 9 l 5 80 l 1 2 h 6 l 1 -2 l 5 -80 A 9 9 0 0 0 0 9"
                />
                <Box
                  as="circle"
                  r="6"
                  cx="9"
                  cy="9"
                  fill="var(--colors-gray2)"
                />
              </Box>
            </motion.g>
          </g>
        </svg>
      </div>
    </>
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
    />
  );
};

const Bolt = ({ cy = 0, cx = 0 }) => {
  return <circle cx={cx} cy={cy} r="3" fill="none" />;
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
      <motion.line x1="0" y1={p1.radius} x2="0" y2={p0.radius} />
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
