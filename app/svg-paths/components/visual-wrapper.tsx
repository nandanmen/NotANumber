import { useIndexContext } from "./index-provider";
import { type Config, Svg } from "./svg";

export type Page = {
  children: React.ReactNode;
  svg?:
    | false
    | number
    | {
        size?: number;
        config?: Partial<Config>;
      };
};

export type VisualWrapperComponents = Page[];

export function VisualWrapper({
  components,
}: {
  components: VisualWrapperComponents;
}) {
  const { index } = useIndexContext();
  const component = components[index];
  if (!component) return <Svg size={25} />;

  const { children, svg = 25 } = component;
  if (!svg) return <>{children}</>;

  let props = svg;
  if (typeof props === "number") props = { size: props };
  return <Svg {...props}>{children}</Svg>;
}
