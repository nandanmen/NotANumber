import { useEffect, useRef, useState } from "react";
import { useScroller, useScrollerEvent } from "./scroller";

export type PointDefinition = {
  shape: "circle" | "square" | "triangle" | "diamond" | "router";
  className: string;
  label?: string;
};

export type Point = {
  x: number;
  y: number;
  label?: { x: number; y: number; text?: string };
};

export type PointMap = Record<string, Point | null>;

function applyPoints(current: Record<string, Point>, changes: PointMap): Record<string, Point> {
  const next = { ...current };
  for (const [id, point] of Object.entries(changes)) {
    if (point === null) delete next[id];
    else next[id] = point;
  }
  return next;
}

export type SceneDefinition =
  | PointMap
  | {
      initial: PointMap;
      on: Record<string, SceneDefinition>;
    };

export type Visual = {
  points: Record<string, PointDefinition>;
  scenes: SceneDefinition[];
  events?: string[];
};

export type ScenePoint = {
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

export type Scene = ScenePoint[];

function toScene(
  points: Record<string, Point>,
  definitions: Record<string, PointDefinition>,
): Scene {
  return Object.entries(points).map(([id, point]) => {
    const visualPoint = definitions[id];
    if (!visualPoint) {
      throw new Error(`Visual point "${id}" is not defined.`);
    }
    return {
      id,
      x: point.x,
      y: point.y,
      shape: visualPoint.shape,
      className: visualPoint.className,
      ...(point.label && {
        label: {
          text: point.label.text ?? visualPoint.label ?? id,
          x: point.label.x,
          y: point.label.y,
        },
      }),
    };
  });
}

function isTransitionDefinition(
  definition: SceneDefinition,
): definition is Exclude<SceneDefinition, PointMap> {
  return "initial" in definition && "on" in definition;
}

function resolveScene(definition: SceneDefinition): {
  points: PointMap;
  transitions: Record<string, SceneDefinition>;
} {
  return isTransitionDefinition(definition)
    ? { points: definition.initial, transitions: definition.on }
    : { points: definition, transitions: {} };
}

function getAvailableEvents(
  visual: Visual,
  transitions: Record<string, SceneDefinition>,
): string[] {
  return [...new Set([...Object.keys(transitions), ...(visual.events ?? [])])];
}

function assertFirstScene(visual: Visual): SceneDefinition {
  const scene = visual.scenes.at(0);
  if (!scene) {
    throw new Error(`Visual must contain at least one scene: ${JSON.stringify(visual)}`);
  }
  return scene;
}

export function useVisual(visual: Visual): Scene {
  const firstScene = resolveScene(assertFirstScene(visual));
  const [points, setPoints] = useState(() => applyPoints({}, firstScene.points));
  const transitions = useRef<Record<string, SceneDefinition>>(firstScene.transitions);
  const { activeSection, setAvailableEvents } = useScroller();

  useEffect(() => {
    const nextScene = visual.scenes.at(activeSection);
    if (!nextScene) return;
    const next = resolveScene(nextScene);
    setPoints(applyPoints({}, next.points));
    transitions.current = next.transitions;
    setAvailableEvents({
      index: activeSection,
      types: getAvailableEvents(visual, next.transitions),
    });
    return () => setAvailableEvents(null);
  }, [visual, activeSection, setAvailableEvents]);

  useScrollerEvent((event, index) => {
    if (index !== activeSection) return;
    if (!Object.hasOwn(transitions.current, event.type)) return;
    const nextScene = resolveScene(transitions.current[event.type]);
    transitions.current = nextScene.transitions;
    setAvailableEvents({
      index: activeSection,
      types: getAvailableEvents(visual, nextScene.transitions),
    });
    setPoints((currentPoints) => applyPoints(currentPoints, nextScene.points));
  });

  return toScene(points, visual.points);
}
