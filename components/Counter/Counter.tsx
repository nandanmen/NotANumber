import { FaMinus, FaPlus } from "react-icons/fa";
import { IconButton } from "~/components/Visualizer";
import { styled } from "~/stitches.config";

type CounterProps = {
  value: number;
  onChange: (value: number) => void;
  children?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
};

export const Counter = ({
  value,
  onChange,
  children,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
}: CounterProps) => {
  return (
    <CounterWrapper>
      <IconButton
        secondary
        onClick={() => onChange(Math.max(min, value - step))}
      >
        <FaMinus />
      </IconButton>
      <Value>{children ?? `${value}px`}</Value>
      <IconButton
        secondary
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <FaPlus />
      </IconButton>
    </CounterWrapper>
  );
};

const CounterWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
});

const Value = styled("div", {
  fontFamily: "$mono",
  color: "$gray11",
});
