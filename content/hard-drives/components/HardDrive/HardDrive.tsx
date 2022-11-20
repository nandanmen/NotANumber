import React from "react";
import { motion } from "framer-motion";

import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  ToggleButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";

const X_MAX = 120;
const Y_MAX = 90;
const DISK_RADIUS = 40;
const PADDING = 5;

const getPointAtAngle = (angle: number, radius: number) => {
  const inRadians = (angle * Math.PI) / 180;
  return {
    x: Math.cos(inRadians) * radius,
    y: Math.sin(inRadians) * radius,
  };
};

const range = (from: number, to: number, skip = 1) => {
  const nums = [];
  for (let i = from; i < to; i += skip) {
    nums.push(i);
  }
  return nums;
};

export const HardDrive = () => {
  const [spinning, setSpinning] = React.useState(false);

  return (
    <FullWidth>
      <Visualizer>
        <ContentWrapper noOverflow>
          <svg
            width="100%"
            height="100%"
            viewBox={`${-PADDING} -${PADDING} ${X_MAX + 2 * PADDING} ${
              Y_MAX + 2 * PADDING
            }`}
          >
            <motion.g
              style={{ x: X_MAX - DISK_RADIUS, y: Y_MAX / 2 }}
              animate={{ rotate: 360 }}
              transition={{
                type: "tween",
                duration: 5,
                ease: "linear",
                repeat: spinning ? Number.POSITIVE_INFINITY : 0,
              }}
            >
              <Disk r={DISK_RADIUS} />
              <DiskCenter r={DISK_RADIUS / 4} />
              <g>
                <Track r={DISK_RADIUS - 2} />
                <Track r={DISK_RADIUS / 4 + 2} />
                <Track r={20.5} />
                <Track r={29.5} />
                {range(0, 360, 30).map((angle) => (
                  <Sector
                    key={`track1-${angle}`}
                    angle={angle}
                    from={12}
                    to={20.5}
                  />
                ))}
                {range(0, 360, 20).map((angle) => (
                  <Sector
                    key={`track2-${angle}`}
                    angle={angle}
                    from={20.5}
                    to={29.5}
                  />
                ))}
                {range(0, 360, 15).map((angle) => (
                  <Sector
                    key={`track2-${angle}`}
                    angle={angle}
                    from={29.5}
                    to={38}
                  />
                ))}
                <ActiveSector
                  startAngle={0}
                  endAngle={20}
                  startRadius={20.5}
                  endRadius={29.5}
                />
                <ActiveSector
                  startAngle={120}
                  endAngle={150}
                  startRadius={12}
                  endRadius={20.5}
                />
              </g>
            </motion.g>
          </svg>
        </ContentWrapper>
        <Controls>
          <ToggleButton onClick={() => setSpinning(!spinning)}>
            Toggle
          </ToggleButton>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const ActiveSector = ({ startAngle, endAngle, startRadius, endRadius }) => {
  const lowerArcStart = getPointAtAngle(startAngle, startRadius);
  const lowerArcEnd = getPointAtAngle(endAngle, startRadius);
  const upperArcStart = getPointAtAngle(startAngle, endRadius);
  const upperArcEnd = getPointAtAngle(endAngle, endRadius);

  const d = `
    M ${lowerArcStart.x} ${lowerArcStart.y}
    A ${startRadius} ${startRadius} 0 0 1 ${lowerArcEnd.x} ${lowerArcEnd.y}
    L ${upperArcEnd.x} ${upperArcEnd.y}
    A ${endRadius} ${endRadius} 0 0 0 ${upperArcStart.x} ${upperArcStart.y}
    Z
  `;

  return <_ActiveSector d={d} />;
};

const _ActiveSector = styled("path", {
  fill: "$blue6",
  stroke: "$blue8",
  strokeWidth: "0.2",
  filter: "drop-shadow($shadows$md)",
});

const Sector = ({ angle, from, to }) => {
  const { x: x1, y: y1 } = getPointAtAngle(angle, from);
  const { x: x2, y: y2 } = getPointAtAngle(angle, to);
  return <SectorLine x1={x1} y1={y1} x2={x2} y2={y2} />;
};

const ContentWrapper = styled(Content, {
  aspectRatio: 4 / 3,
});

const SectorLine = styled("line", {
  fill: "none",
  stroke: "$gray9",
  strokeWidth: "0.2",
  strokeDasharray: "1.2",
});

const Track = styled("circle", {
  fill: "none",
  stroke: "$gray9",
  strokeWidth: "0.2",
  strokeDasharray: "1.2",
});

const Disk = styled("circle", {
  fill: "$gray5",
  stroke: "$gray8",
  strokeWidth: "0.2",
  filter: "drop-shadow($shadows$md)",
});

const DiskCenter = styled("circle", {
  fill: "$gray3",
  stroke: "$gray8",
  strokeWidth: "0.2",
  filter: "drop-shadow($shadows$md)",
});
