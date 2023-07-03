export type SyntaxState = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
  active: "x1" | "x2" | "x" | null;
  state: "idle" | "hovering" | "panning";
};
