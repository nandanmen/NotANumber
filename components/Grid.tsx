import { styled } from "~/stitches.config";
import { range } from "~/lib/utils";

const CELL_SIZE = 8;

type GridProps = {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
  children?: React.ReactNode;
};

export const Grid = ({
  rows = 10,
  cols = 15,
  cellSize = CELL_SIZE,
  className = "",
  children,
}: GridProps) => {
  const xMax = cols * cellSize;
  const yMax = rows * cellSize;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${xMax} ${yMax}`}
      preserveAspectRatio="none"
      className={className}
    >
      <Wrapper>
        {range(rows)
          .slice(1)
          .map((index) => (
            <line
              key={`row-${index}`}
              x1="0"
              x2={xMax}
              y1={index * cellSize}
              y2={index * cellSize}
              stroke="currentColor"
              strokeWidth="0.2"
            />
          ))}
        {range(cols)
          .slice(1)
          .map((index) => (
            <line
              key={`col-${index}`}
              x1={index * cellSize}
              x2={index * cellSize}
              y1="0"
              y2={yMax}
              stroke="currentColor"
              strokeWidth="0.2"
            />
          ))}
      </Wrapper>
      {children}
    </svg>
  );
};

const Wrapper = styled("g", {
  color: "$gray6",
});

type GridBackgroundProps = {
  children: React.ReactNode;
};

export const GridBackground = ({ children }: GridBackgroundProps) => (
  <GridBackgroundWrapper>{children}</GridBackgroundWrapper>
);

const GridBackgroundWrapper = styled("div", {
  position: "relative",
  border: "1px solid $gray8",
  borderRadius: "$base",
  backgroundImage: "url(/grid.svg)",
  backgroundSize: "40px 40px",
});
