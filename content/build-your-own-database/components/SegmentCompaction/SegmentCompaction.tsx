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
].map((value) => ({ value })) as Record[];

export const SegmentCompaction = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    setBox(wrapperRef.current?.getBoundingClientRect());
  }, []);

  const aspectRatio = box ? box.width / box.height : 1;
  return (
    <Visualizer fullWidth>
      <Content
        padding="lg"
        css={{
          display: "grid",
          gridTemplateColumns: "300px 200px 300px",
          justifyContent: "center",
          rowGap: "$6",
        }}
        noOverflow
      >
        {range(records.length / 4).map((index) => {
          const start = index * 4;
          return (
            <_Segment key={index} records={records.slice(start, start + 4)} />
          );
        })}
        <CompactedPageWrapper>
          <CompactedPage />
        </CompactedPageWrapper>
        {box && (
          <ArrowWrapper>
            <ArrowContentWrapper ref={wrapperRef}>
              <ArrowAnimation aspectRatio={aspectRatio} />
              <PointWrapper>
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

const _Segment = styled(Segment, {
  background: "$gray5",
  gridColumn: 1,
});

const ArrowWrapper = styled("div", {
  gridColumn: 2,
  gridRow: "1 / 3",
  padding: "68px 0",
  margin: "0 -4px",
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
      <Path d={`M 1 2 C 20 2 30 10 54 ${midPoint}`} />
      <Path d={`M 50 ${midPoint} h 100`} />
      <Path
        d={`M 1 ${height - 2} C 20 ${height - 2} 30 ${
          height - 10
        } 54 ${midPoint}`}
      />
      <ArrowCircle r={12} cx={50} cy={midPoint} />
      <Arrow x={43} y={height / 2 - 7} size={14} />
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
  gridColumn: 3,
  gridRow: "1 / 3",
  display: "flex",
  alignItems: "center",
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
