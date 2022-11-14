import { useMotionValue } from "framer-motion";
import { SizeDiagram } from "./SizeDiagram";

export const Default = () => {
  const scale = useMotionValue(0.5);
  return <SizeDiagram scale={scale} />;
};

export const WithWidthChange = () => {
  const scale = useMotionValue(0.5);
  return (
    <SizeDiagram
      scale={scale}
      onWidthChange={(width) => scale.set(120 / width)}
    />
  );
};
