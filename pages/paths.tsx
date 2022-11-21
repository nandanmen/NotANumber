import React from "react";
import { motion } from "framer-motion";
import { styled } from "~/stitches.config";

const ASPECT_RATIO = 1;

const SVG_PADDING = 6;
const SVG_HEIGHT = 100;
const SVG_WIDTH = ASPECT_RATIO * SVG_HEIGHT;

const SVG_GRID_GAP = 10;

const range = (start: number, end: number, skip = 1) => {
  const nums = [];
  for (let i = start; i <= end; i += skip) {
    nums.push(i);
  }
  return nums;
};

const SVG_COLUMNS = range(0, SVG_WIDTH, SVG_GRID_GAP);
const SVG_ROWS = range(0, SVG_HEIGHT, SVG_GRID_GAP);

export default function PathsPage() {
  const [commands, setCommands] = React.useState(`M 10 20\nL 30 40`);

  const [activeCommand] = commands.split("\n");
  const [, rawX, rawY] = activeCommand.split(" ");

  const x = Number(rawX);
  const y = Number(rawY);

  return (
    <Wrapper>
      <MainWrapper>
        <ContentWrapper>
          <Aside>
            <Commands>
              <CommandInput
                value={commands}
                onChange={(evt) => setCommands(evt.target.value)}
              />
            </Commands>
            <Article>
              <p>
                The M, or move, command moves the cursor to the provided x and y
                coordinates.
              </p>
              <p>
                In this case, we're moving the cursor to the coordinates ({x},
                {y}).
              </p>
            </Article>
          </Aside>
        </ContentWrapper>
        <SvgWrapper>
          <svg
            width="100%"
            height="100%"
            viewBox={`
              ${-SVG_PADDING}
              ${-SVG_PADDING}
              ${SVG_WIDTH + SVG_PADDING * 2}
              ${SVG_HEIGHT + SVG_PADDING * 2}
            `}
          >
            <Background />
            <path d={commands} stroke="black" strokeWidth="1.5" fill="none" />
            <ActiveLine
              animate={{ x2: x, y2: y }}
              x1="0"
              y1="0"
              x2={x}
              y2={y}
              strokeDasharray="1"
            />
            <OriginPoint />
            <ActivePoint animate={{ cx: x, cy: y }} cx={x} cy={y} r="1.25" />
          </svg>
        </SvgWrapper>
      </MainWrapper>
    </Wrapper>
  );
}

const CommandInput = styled("textarea", {
  background: "inherit",
  border: "none",
  fontSize: "inherit",
  width: "100%",
  height: "100%",
  lineHeight: "$body",
  fontFamily: "$mono",
  padding: "$6",
  resize: "none",
});

const Point = (props) => {
  return <motion.circle r="1" strokeWidth="0.3" {...props} />;
};

const OriginPoint = styled(Point, {
  stroke: "$gray8",
  fill: "$gray3",
});

const ActivePoint = styled(Point, {
  stroke: "$blue8",
  fill: "$blue6",
});

const ActiveLine = styled(motion.line, {
  stroke: "$blue8",
  strokeWidth: "0.5",
});

const Background = () => {
  return (
    <g>
      {SVG_COLUMNS.map((x) => (
        <GridLine
          key={`column-${x}`}
          x1={x}
          x2={x}
          y1={-SVG_PADDING}
          y2={SVG_HEIGHT + SVG_PADDING}
        />
      ))}
      {SVG_ROWS.map((y) => (
        <GridLine
          key={`row-${y}`}
          x1={-SVG_PADDING}
          x2={SVG_WIDTH + SVG_PADDING}
          y1={y}
          y2={y}
        />
      ))}
      <g style={{ transform: `translate(-2px, -2px)` }}>
        {SVG_ROWS.map((y) => (
          <LabelText key={`row-label-${y}`} x="0" y={y} textAnchor="end">
            {y}
          </LabelText>
        ))}
      </g>
      <g style={{ transform: `translate(-2px, -2px)` }}>
        {SVG_COLUMNS.map((x) => (
          <LabelText key={`col-label-${x}`} x={x} y="0" textAnchor="end">
            {x}
          </LabelText>
        ))}
      </g>
    </g>
  );
};

const LabelText = styled("text", {
  fontSize: 2,
  fontFamily: "$mono",
  fill: "$gray9",
  fontWeight: "bold",
});

const GridLine = styled("line", {
  stroke: "$gray8",
  strokeWidth: "0.2",
  strokeDasharray: "1",
});

const Wrapper = styled("div", {
  height: "100vh",
  margin: "-$16 0",
});

const MainWrapper = styled("div", {
  height: "100%",
  display: "grid",
  gridTemplateColumns: "45ch 1fr",
  padding: "$12",
  gap: "$12",
  alignItems: "center",
  margin: "0 auto",
  width: "fit-content",
});

const SvgWrapper = styled("main", {
  aspectRatio: ASPECT_RATIO,
  height: "100%",
  width: "fit-content",
});

const ContentWrapper = styled("div", {
  height: "100%",
});

const Aside = styled("aside", {
  borderRadius: "$base",
  border: "1px solid $gray8",
  boxShadow: "$md",
  background: "$gray3",
  height: "100%",
  display: "grid",
  gridTemplateRows: "1fr 1fr",
  overflow: "hidden",
});

const Commands = styled("div", {});

const Article = styled("article", {
  borderTop: "1px solid $gray8",
  background: "$gray2",
  padding: "$6",
  lineHeight: "$body",

  "> *:not(:last-child)": {
    marginBottom: "$3",
  },
});
