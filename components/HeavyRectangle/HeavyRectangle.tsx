import type { ComponentPropsWithoutRef } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

type HeavyRectangleProps = {
  weight: MotionValue<number>;
  width?: number;
  height?: number;
  r?: number;
  x?: number;
  y?: number;
} & ComponentPropsWithoutRef<typeof motion["path"]>;

export const HeavyRectangle = ({
  weight,
  width: w = 80,
  height: h = 40,
  r = 4,
  x = 10,
  y = 20,
  ...props
}: HeavyRectangleProps) => {
  const d = useTransform(weight, (weight) => {
    const mx = (x + w + x) / 2;
    const rw = (w - r * 2) / 2;
    const angle = Math.atan(weight / rw);
    const yOffset = r * Math.sin(angle);
    const xOffset = r * Math.cos(angle);
    return `
      M ${x + r - xOffset - yOffset} ${y + r - yOffset}
      Q ${x + r - xOffset} ${y - yOffset} ${x + r} ${y}
      Q ${mx} ${y + weight} ${x + w - r} ${y}
      q ${xOffset} ${-yOffset} ${xOffset + yOffset} ${xOffset - yOffset}
      L ${x + w + (h - r) * Math.sin(angle)} ${y + (h - r) * Math.cos(angle)}
      q ${yOffset} ${xOffset} ${-(xOffset - yOffset)} ${xOffset + yOffset}
      Q ${mx} ${y + h + weight} ${x + r - (h - r) * Math.sin(angle)} ${
      y + h * Math.cos(angle)
    }
      q ${-xOffset} ${-yOffset} ${-(xOffset - yOffset)} ${-(xOffset + yOffset)}
      z
    `;
  });
  return <motion.path d={d} {...props} />;
};
