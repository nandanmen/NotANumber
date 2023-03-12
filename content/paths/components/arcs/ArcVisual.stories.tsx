import { ArcPlayground } from ".";

export const Default = () => {
  return (
    <div style={{ width: 1100, position: "relative" }}>
      <ArcPlayground
        x0={10}
        y0={12}
        largeArc={false}
        sweep={false}
        rx={10}
        ry={5}
        x={20}
        y={12}
      />
    </div>
  );
};
