import { clsx } from "clsx";
import { useSvgContext } from "../svg";

type TextProps = Omit<React.ComponentPropsWithoutRef<"text">, "fontSize"> & {
  font?: string;
  fontSize?: number;
  variant?: "current" | "secondary" | "primary";
};

const mapVariantToFill = {
  current: "fill-current",
  secondary: "fill-gray10",
  primary: "fill-gray12",
};

export const Text = ({
  children,
  fontSize = 2,
  font = "font-mono",
  variant,
  ...props
}: TextProps) => {
  const { getRelative } = useSvgContext();
  const _fontSize = getRelative(fontSize);
  return (
    <g
      fontSize={_fontSize}
      textAnchor="middle"
      dominantBaseline="middle"
      fontWeight="bold"
      className={font}
    >
      <text strokeWidth={getRelative(0.5)} className="stroke-gray4" {...props}>
        {children}
      </text>
      <text
        className={clsx("stroke-none", mapVariantToFill[variant])}
        {...props}
      >
        {children}
      </text>
    </g>
  );
};
