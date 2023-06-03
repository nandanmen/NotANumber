import React from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useStateContext } from "./state";
import type { Page } from "../components/visual-wrapper";

const squareConfig = {
  width: 60,
  height: 40,
  cornerRadius: 4,
  x: 12,
  y: 15,
};

export function Square() {
  const id = React.useId();
  const { data } = useStateContext("intro");
  const textRef = React.useRef<SVGTextElement>();
  const weight = useMotionValue(0);
  const textOffset = useTransform(weight, (w) => 35 + w);

  React.useEffect(() => {
    weight.on("change", (weight) => {
      if (textRef.current) {
        textRef.current.textContent = weight.toFixed(0);
      }
    });
  }, [weight]);

  React.useEffect(() => {
    if (data.toggled) {
      animate(weight, 20, { type: "spring", bounce: 0 });
    } else {
      animate(weight, 0, { type: "spring", bounce: 0 });
    }
  }, [data.toggled, weight]);

  return (
    <svg width="auto" height="100%" viewBox="-10 0 120 80">
      <mask id={id}>
        <rect x="0" y="0" width="100" height="100" fill="black" />
        <HeavySquare weight={weight} fill="white" />
      </mask>
      <HeavySquare
        weight={weight}
        className="fill-none stroke-gray12"
        strokeWidth="0.75"
      />
      <motion.text
        mask={`url('#${id}')`}
        x={squareConfig.x + squareConfig.width / 2}
        y={textOffset}
        dominantBaseline="central"
        textAnchor="middle"
        ref={textRef}
        className="font-mono"
      >
        {weight.get()}
      </motion.text>
    </svg>
  );
}

const HeavySquare = ({ weight, ...props }) => {
  const d = useTransform(weight, (weight: number) => {
    const { width: w, height: h, cornerRadius: r, x, y } = squareConfig;
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

export const page: Page = {
  children: <Square />,
};
