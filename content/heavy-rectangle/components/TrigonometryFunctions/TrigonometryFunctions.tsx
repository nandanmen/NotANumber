import { FullWidth } from "~/components/FullWidth";
import { Visualizer, Content } from "~/components/Visualizer";
import { styled } from "~/stitches.config";

export const TrigonometryFunctions = () => {
  return (
    <FullWidth>
      <Wrapper>
        <Visualizer>
          <Content>
            <Triangle />
          </Content>
        </Visualizer>
        <Visualizer>
          <Content>
            <Triangle />
          </Content>
        </Visualizer>
        <Visualizer>
          <Content>
            <Triangle />
          </Content>
        </Visualizer>
      </Wrapper>
    </FullWidth>
  );
};

const Triangle = () => {
  return (
    <svg viewBox="0 0 100 150">
      <Line x1="20" y1="30" x2="20" y2="120" type="numerator" />
      <Line x1="20" y1="120" x2="80" y2="120" type="denominator" />
      <Line x1="20" y1="30" x2="80" y2="120" />
      <Endpoint r="3" cx="20" cy="30" />
      <Endpoint r="3" cx="20" cy="120" type="numerator" />
      <Endpoint r="3" cx="80" cy="120" type="denominator" />
    </svg>
  );
};

const Line = styled("line", {
  strokeWidth: 2,
  stroke: "$gray8",
  variants: {
    type: {
      numerator: {
        stroke: "$blue8",
      },
      denominator: {
        stroke: "$blue11",
      },
    },
  },
});

const Endpoint = styled("circle", {
  fill: "$gray4",
  stroke: "$gray8",
  strokeWidth: 1.5,
  variants: {
    type: {
      numerator: {
        stroke: "$blue8",
      },
      denominator: {
        stroke: "$blue11",
      },
    },
  },
});

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "$4",
});
