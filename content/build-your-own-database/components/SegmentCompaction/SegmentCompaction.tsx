import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { styled, darkTheme } from "~/stitches.config";
import { range } from "~/lib/utils";
import { useAlgorithm } from "~/lib/algorithm";
import {
  Visualizer,
  Content,
  AlgorithmControls,
} from "~/components/Visualizer";
import { Page, isStale, type Record } from "../FileDatabase";
import { Segment } from "../Segments";
import { compact, type CompactState } from "./compact";

const records = [
  [1, "Lorem ipsum"],
  [18, "dolor sit"],
  [12, "adipiscing elit."],
  [15, "Vestibulum varius"],
  [15, "dolor sit"],
  [1, "iaculis pharetra."],
  [18, "null"],
  [0, "amet, consectetur"],
].map((value) => ({ value })) as Record[];

export const SegmentCompaction = () => {
  const [state, ctx] = useAlgorithm<CompactState>(compact, [
    range(records.length / 4).map((index) =>
      records.slice(index * 4, index * 4 + 4)
    ),
  ]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    setBox(wrapperRef.current?.getBoundingClientRect());
  }, []);

  const aspectRatio = box ? box.width / box.height : 1;

  const visibleRecords: Record[] = React.useMemo(() => {
    if (ctx.currentStep > 1 && ctx.currentStep < 5) {
      return [
        { value: [14, "iaculis pharetra."] },
        { value: [18, "dolor sit"] },
      ];
    }
    if (ctx.currentStep > 4) {
      return [
        { value: [14, "iaculis pharetra."] },
        { value: [18, "dolor sit"] },
        { value: [6, "amet, consectetur"] },
      ];
    }
    return [{ value: [14, "iaculis pharetra."] }];
  }, [ctx.currentStep]);

  return (
    <Visualizer fullWidth>
      <Content padding="lg" noOverflow>
        <ContentWrapper>
          {range(records.length / 4).map((index) => {
            const start = index * 4;
            return (
              <_Segment
                key={index}
                records={records.slice(start, start + 4).map((record) => ({
                  ...record,
                  stale: isStale(record.value, records),
                }))}
                highlighted={
                  state.segmentIndex === index ? state.offset : undefined
                }
                disabled
              />
            );
          })}
          <ActiveSegment>
            <Separator viewBox="0 0 100 2">
              <SeparatorLine x1="0" x2="100" y1="1" y2="1" />
            </Separator>
            <Segment records={visibleRecords} />
          </ActiveSegment>
          <CompactedPageWrapper>
            <Background />
            <CompactedPage
              done={state.__done}
              records={state.compactedRecords}
            />
          </CompactedPageWrapper>
          <ArrowWrapper>
            <ArrowContentWrapper ref={wrapperRef}>
              {box && (
                <>
                  <ArrowAnimation aspectRatio={aspectRatio} />
                  <PointWrapper>
                    <Point />
                    <Point />
                  </PointWrapper>
                  <PointWrapper css={{ justifyContent: "center" }}>
                    <Point />
                  </PointWrapper>
                </>
              )}
            </ArrowContentWrapper>
          </ArrowWrapper>
        </ContentWrapper>
      </Content>
      <AlgorithmControls context={ctx} />
    </Visualizer>
  );
};

const ActiveSegment = styled("div", {
  marginTop: "$4",
  paddingTop: "$8",
  position: "relative",
  gridColumn: "1 / -1",
});

const Separator = styled("svg", {
  position: "absolute",
  top: 0,
  width: "100%",
  transform: "translateY(-50%)",
});

const SeparatorLine = styled("line", {
  stroke: "$gray8",
  strokeWidth: 0.3,
  strokeDasharray: "1",
});

const ContentWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "300px 150px 300px",
  justifyContent: "center",
  rowGap: "$4",
});

const CompactedPage = ({ done, records }) => {
  return (
    <_CompactedPage
      done={done}
      transition={{ type: "spring", damping: 20 }}
      layout
    >
      {records
        .filter((record) => record.value[1] !== "null")
        .map((record) => {
          const [dbKey, dbValue] = record.value;
          return (
            <CompactedRecord
              key={dbKey}
              layout="position"
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: -16, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <span>{String(dbKey).padStart(3, "0")}:</span> {dbValue}
            </CompactedRecord>
          );
        })}
    </_CompactedPage>
  );
};

const _CompactedPage = styled(Page, {
  background: "$blue4",
  borderColor: "$blue9",
  borderStyle: "solid",
  overflow: "hidden",
  position: "relative",
  height: "100%",
  minHeight: "auto",

  [`.${darkTheme} &`]: {
    background: "linear-gradient(-20deg, $blueDark4, $blueDark8)",
    borderColor: "$blueDark8",
  },

  variants: {
    done: {
      true: {
        height: "fit-content",
      },
    },
  },
});

const Background = styled("div", {
  $$color: "$colors$blue5",
  $$borderColor: "$colors$blue6",

  position: "absolute",
  background: `repeating-linear-gradient(-45deg, $$color, $$color 8px, transparent 8px, transparent 16px)`,
  border: "1px solid $$borderColor",
  borderRadius: "$base",
  inset: 0,

  [`.${darkTheme} &`]: {
    $$color: "$colors$blueDark5",
    $$borderColor: "$colors$blueDark6",
  },
});

const CompactedRecord = styled(motion.li, {
  position: "relative",
  padding: "$1 $6",
  color: "$blue11",
  span: {
    fontWeight: "bold",
  },
});

const _Segment = styled(Segment, {
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
      <Path d={`M 1 2.5 C 20 2 30 10 54 ${midPoint}`} />
      <Path d={`M 50 ${midPoint} h 100`} />
      <Path
        d={`M 1 ${height - 2.5} C 20 ${height - 2} 30 ${
          height - 10
        } 54 ${midPoint}`}
      />
      <ArrowCircle r={14} cx={50} cy={midPoint} />
      <Arrow x={42} y={height / 2 - 8} size={16} />
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
  stroke: "$blue8",
  strokeWidth: 1.5,
  strokeDasharray: "4 3",
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
  position: "relative",
});
