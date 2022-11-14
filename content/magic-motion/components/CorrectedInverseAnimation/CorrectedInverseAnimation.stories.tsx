import { CorrectedInverseAnimation } from "./CorrectedInverseAnimation";

const from = (width, container) => {
  return {
    x: container.width - width / 2 - container.padding,
    y: container.height / 2,
  };
};

const to = (width, container) => {
  return {
    x: container.padding + width / 2,
    y: container.height / 2,
  };
};

export const Center = () => <CorrectedInverseAnimation from={from} to={to} />;

export const TopLeft = () => (
  <CorrectedInverseAnimation
    from={(width, container) => ({
      x: container.width - width - container.padding,
      y: container.height / 2 - width / 2,
    })}
    to={(width, container) => ({
      x: container.padding,
      y: container.height / 2 - width / 2,
    })}
    origin="topLeft"
  />
);

export const Default = () => (
  <CorrectedInverseAnimation
    from={(width, container) => ({
      x: container.width - width - container.padding,
      y: container.height / 2 - width / 2,
    })}
    to={(width, container) => ({
      x: container.padding,
      y: container.height / 2 - width / 2,
    })}
  />
);
