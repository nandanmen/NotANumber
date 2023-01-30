import { motion } from "framer-motion";
import { Visualizer, Content } from "~/components/Visualizer";
import { range } from "~/lib/utils";

const numArcs = 12;
const numSectors = 5;

export const DiskDrive = () => {
  const arcsLen = 360 / numArcs;
  const sectorRadius = (70 - 20) / numSectors;
  return (
    <Visualizer fullWidth>
      <Content>
        <svg viewBox="20 0 180 160">
          <g
            stroke="var(--colors-gray8)"
            strokeWidth="0.3"
            fill="var(--colors-gray5)"
          >
            <motion.g
              style={{ x: 120, y: 80 }}
              animate={{ rotate: 360 }}
              transition={{
                type: "tween",
                duration: 8,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              <circle r="70" />
              <g strokeDasharray="2">
                {range(numArcs).map((i) => {
                  const { x: x2, y: y2 } = toCartesian(i * arcsLen, 70);
                  return (
                    <line key={`${x2}-${y2}`} x1="0" y1="0" x2={x2} y2={y2} />
                  );
                })}
                {range(numSectors - 1).map((i) => {
                  const r = 20 + (i + 1) * sectorRadius;
                  return <circle key={r} r={r} fill="none" />;
                })}
              </g>
              <circle r="20" fill="var(--colors-gray4)" />
              <g fill="var(--colors-gray3)">
                <circle r="3" cy="-12" />
                <circle r="3" cy="12" />
                <circle r="3" cx="-12" />
                <circle r="3" cx="12" />
                <circle r="5" />
              </g>
            </motion.g>
            <motion.g style={{ x: 30, y: 30 }}>
              <motion.g style={{ rotate: -20, originX: "9px", originY: "9px" }}>
                <motion.g style={{ x: 6.5, y: 90 }}>
                  <path d="M 0 0 l 2.5 8 l 2.5 -8 z" />
                </motion.g>
                <path d="M 0 9 l 5 80 l 1 2 h 6 l 1 -2 l 5 -80 A 9 9 0 0 0 0 9" />
                <circle r="6" cx="9" cy="9" fill="var(--colors-gray4)" />
              </motion.g>
            </motion.g>
          </g>
        </svg>
      </Content>
    </Visualizer>
  );
};

const toCartesian = (angle: number, radius: number) => {
  const angleInRadians = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: radius * Math.cos(angleInRadians),
    y: radius * Math.sin(angleInRadians),
  };
};
