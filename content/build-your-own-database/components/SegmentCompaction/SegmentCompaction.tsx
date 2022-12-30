import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { styled, darkTheme } from "~/stitches.config";
import { range } from "~/lib/utils";
import { Visualizer, Content } from "~/components/Visualizer";
import { Page, type Record } from "../FileDatabase";
import { Segment } from "../Segments";

const records = [
  [1, "Lorem ipsum"],
  [18, "dolor sit"],
  [12, "adipiscing elit."],
  [15, "Vestibulum varius"],
  [15, "dolor sit"],
  [1, "iaculis pharetra."],
  [3, "dolor sit"],
  [0, "amet, consectetur"],
  [3, "vel mauris"],
  [13, "Vestibulum varius"],
  [12, "null"],
  [9, "iaculis pharetra."],
].map((value) => ({ value })) as Record[];

export const SegmentCompaction = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    setBox(wrapperRef.current?.getBoundingClientRect());
  }, []);

  const width = box?.width - 56 - 600;
  const height = box?.height - 64 - 136;

  return (
    <Visualizer fullWidth>
      <Content
        ref={wrapperRef}
        padding="lg"
        css={{ display: "flex", flexDirection: "column", gap: "$6" }}
        noOverflow
      >
        {range(records.length / 4).map((index) => {
          const start = index * 4;
          return (
            <Segment key={index} records={records.slice(start, start + 4)} />
          );
        })}
        <CompactedPageWrapper>
          <CompactedPage />
        </CompactedPageWrapper>
        {box && (
          <ArrowWrapper css={{ width, height }}>
            <ArrowContentWrapper>
              <ArrowAnimation aspectRatio={width / height} />
              <PointWrapper>
                <Point />
                <Point />
                <Point />
              </PointWrapper>
              <PointWrapper css={{ justifyContent: "center" }}>
                <Point />
              </PointWrapper>
            </ArrowContentWrapper>
          </ArrowWrapper>
        )}
      </Content>
    </Visualizer>
  );
};

const ArrowWrapper = styled("div", {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
});

const ArrowContentWrapper = styled("div", {
  position: "relative",
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "space-between",
});

const PointWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
});

const Point = styled("div", {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "$blue9",

  [`.${darkTheme} &`]: {
    background: "$blueDark9",
  },
});

const ArrowAnimation = ({ aspectRatio }) => {
  const height = 100 / aspectRatio;
  const midPoint = height / 2;
  return (
    <Svg viewBox={`0 0 100 ${height}`}>
      <Path d={`M 1 1 Q 50 10 50 ${midPoint}`} />
      <Path d={`M 1 ${midPoint} h 100`} />
      <Path d={`M 1 ${height - 1} Q 50 ${height - 10} 50 ${midPoint}`} />
      <ArrowCircle r={10} cx={50} cy={midPoint} />
      <Arrow x={44} y={height / 2 - 6} size={12} />
    </Svg>
  );
};

const ArrowCircle = styled(motion.circle, {
  stroke: "$blue9",
  strokeWidth: 1,
  fill: "$blue5",

  [`.${darkTheme} &`]: {
    fill: "$blueDark7",
  },
});

const Arrow = styled(FaArrowRight, {
  fill: "$blue10",

  [`.${darkTheme} &`]: {
    fill: "$blueDark11",
  },
});

const Path = styled(motion.path, {
  stroke: "$blue7",
  strokeWidth: 1,
  strokeDasharray: "3",
  fill: "none",

  [`.${darkTheme} &`]: {
    stroke: "$blueDark7",
  },
});

const Svg = styled("svg", {
  position: "absolute",
  inset: 0,
});

const CompactedPageWrapper = styled("div", {
  position: "absolute",
  right: "$8",
  top: "50%",
  transform: "translateY(-50%)",
});

const CompactedPage = styled(Page, {
  background: "$blue4",
  borderColor: "$blue9",
  borderStyle: "solid",
  overflow: "hidden",
  position: "relative",
  height: "fit-content",
  minHeight: 80,

  [`.${darkTheme} &`]: {
    background: "linear-gradient(-20deg, $blueDark4, $blueDark8)",
    borderColor: "$blueDark8",
  },
});
