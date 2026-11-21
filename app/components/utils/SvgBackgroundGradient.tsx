export type Color = "yellow" | "green";

export type SvgBackgroundGradientProps = {
  id: string;
  color?: Color;
};

export const getFillFromId = (id: string) => `url('#${id}')`;

const stopStart = {
  blue: "[stop-color:var(--color-blue4)] dark:[stop-color:var(--color-blue7)]",
  green:
    "[stop-color:var(--color-green4)] dark:[stop-color:var(--color-green7)]",
  yellow:
    "[stop-color:var(--color-yellow4)] dark:[stop-color:var(--color-yellow7)]",
  red: "[stop-color:var(--color-red4)] dark:[stop-color:var(--color-red7)]",
};

const stopEnd = {
  blue: "[stop-color:var(--color-blue6)] dark:[stop-color:var(--color-blue9)]",
  green:
    "[stop-color:var(--color-green6)] dark:[stop-color:var(--color-green9)]",
  yellow:
    "[stop-color:var(--color-yellow6)] dark:[stop-color:var(--color-yellow9)]",
  red: "[stop-color:var(--color-red6)] dark:[stop-color:var(--color-red9)]",
};

export function SvgBackgroundGradient({
  id,
  color,
}: SvgBackgroundGradientProps) {
  return (
    <defs>
      <linearGradient id={id} gradientTransform="rotate(45)">
        <stop offset="0%" className={stopStart[color ?? "blue"]} />
        <stop offset="100%" className={stopEnd[color ?? "blue"]} />
      </linearGradient>
    </defs>
  );
}
