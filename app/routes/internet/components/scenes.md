# Scenes

```tsx
type Visual = {
  points: Record<string, ScenePoint>;
  scenes: SceneDefinition[];
};

type ScenePoint = {
  shape: "circle" | "square" | "triangle" | "diamond" | "router";
  className: string;
  label?: string;
};

type PointMap = Record<string, Point>;

type SceneDefinition =
  | PointMap
  | {
      initial: PointMap;
      on: Record<string, SceneDefinition>;
    };

type Point = {
  x: number;
  y: number;
  label?: { x: number; y: number; text?: string };
};

function useVisual(visual: Visual): Scene;

type Scene = ScenePoint[];

type ScenePoint = {
  id: string;
  x: number;
  y: number;
  shape: "circle" | "square" | "triangle" | "diamond" | "router";
  className: string;
  label?: {
    text: string;
    x: number;
    y: number;
  };
};
```

Usage:

```tsx
const scene = useVisual(littleInternetVisual);
```
