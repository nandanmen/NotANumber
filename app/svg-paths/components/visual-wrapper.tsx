import { useIndexContext } from "./index-provider";
import { type Config, Svg } from "./svg";

export type VisualWrapperComponents = Array<{
  children: React.ReactNode;
  svg?:
    | number
    | {
        size?: number;
        config?: Partial<Config>;
      };
}>;

export function ActiveComponent({
  components,
}: {
  components: VisualWrapperComponents;
}) {
  const { index } = useIndexContext();
  const component = components[index];
  if (!component) return null;
  return <>{component.children}</>;
}

export function VisualWrapper({
  components,
}: {
  components: VisualWrapperComponents;
}) {
  const { index } = useIndexContext();
  const component = components[index];
  if (!component) return <Svg size={25} />;

  const { children, svg = 25 } = component;
  let props = svg;
  if (typeof props === "number") props = { size: props };
  return <Svg {...props}>{children}</Svg>;
}
