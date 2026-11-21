import {
  useVisual,
  type SceneDefinition,
  type ScenePoint,
  type Visual,
} from "~/components/article/use-visual";
import { useScrollerEvent, type ScrollerEvent } from "~/components/article/scroller";
import { motion, useAnimate } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import {
  clearRoute,
  LinkFills,
  NODE_SCALE,
  routeSequence,
  SmallScreenCenter,
  LINK_WIDTH,
  SHAPE_STROKE,
  LabelTag,
  RoutePointShape,
} from "./network";

const pentagonScene: SceneDefinition = {
  initial: {
    one: { x: 8, y: 3, label: { x: 8, y: 1.5 } },
    four: { x: 11, y: 5, label: { x: 12.5, y: 5 } },
    three: { x: 10, y: 9, label: { x: 11.5, y: 10.5 } },
    two: { x: 6, y: 9, label: { x: 4.5, y: 10.5 } },
    five: { x: 5, y: 5, label: { x: 3.5, y: 5 } },
    six: null,
    seven: null,
  },
  on: {
    add: {
      initial: {
        one: { x: 8, y: 3, label: { x: 8, y: 1.5 } },
        four: { x: 11, y: 5, label: { x: 12.5, y: 5 } },
        three: { x: 11, y: 9, label: { x: 12.5, y: 10.5 } },
        six: { x: 8, y: 11, label: { x: 8, y: 12.5 } },
        two: { x: 5, y: 9, label: { x: 3.5, y: 10.5 } },
        five: { x: 5, y: 5, label: { x: 3.5, y: 5 } },
      },
      on: {
        get reset(): SceneDefinition {
          return pentagonScene;
        },
        add: {
          initial: {
            one: { x: 8, y: 3, label: { x: 8, y: 1.5 } },
            four: { x: 11, y: 4.5, label: { x: 12.5, y: 4 } },
            three: { x: 12, y: 8, label: { x: 13.5, y: 8.5 } },
            six: { x: 10, y: 11, label: { x: 10.5, y: 12.5 } },
            seven: { x: 6, y: 11, label: { x: 5.5, y: 12.5 } },
            two: { x: 4, y: 8, label: { x: 2.5, y: 8.5 } },
            five: { x: 5, y: 4.5, label: { x: 3.5, y: 4 } },
          },
          on: {
            get reset(): SceneDefinition {
              return pentagonScene;
            },
          },
        },
      },
    },
  },
};

const scenes: SceneDefinition[] = [
  {
    one: { x: 8, y: 3 },
    two: { x: 8, y: 9 },
  },
  {
    one: { x: 8, y: 3, label: { x: 8, y: 1.5 } },
    two: { x: 5, y: 9, label: { x: 3.5, y: 10.5 } },
    three: { x: 11, y: 9, label: { x: 12.5, y: 10.5 } },
  },
  pentagonScene,
];

const littleInternetVisual: Visual = {
  points: {
    one: { shape: "circle", className: "fill-blue-7", label: "1" },
    two: { shape: "square", className: "fill-yellow-10", label: "2" },
    three: { shape: "triangle", className: "fill-red-8", label: "3" },
    four: { shape: "circle", className: "fill-cyan-9", label: "4" },
    five: { shape: "diamond", className: "fill-green-9", label: "5" },
    six: { shape: "square", className: "fill-blue-9", label: "6" },
    seven: { shape: "triangle", className: "fill-cyan-9", label: "7" },
  },
  scenes,
  events: ["send-packet"],
};

const SWIFT_TRANSITION = {
  type: "spring",
  stiffness: 280,
  damping: 18,
  mass: 0.3,
} as const;

const LABEL_OFFSET_SCALE = 0.75;

type SendPacketEvent = ScrollerEvent & {
  type: "send-packet";
  from?: string;
  random?: boolean;
  to?: string;
};

function isSendPacketEvent(event: ScrollerEvent): event is SendPacketEvent {
  return (
    event.type === "send-packet" &&
    (event.random === true || (typeof event.from === "string" && typeof event.to === "string"))
  );
}

function randomConnectedPair(scene: ScenePoint[]): [ScenePoint, ScenePoint] | null {
  if (scene.length < 2) return null;

  const fromIndex = Math.floor(Math.random() * scene.length);
  const toIndex = Math.floor(Math.random() * (scene.length - 1));
  const adjustedToIndex = toIndex >= fromIndex ? toIndex + 1 : toIndex;

  return [scene[fromIndex], scene[adjustedToIndex]];
}

export function LittleInternet() {
  const scene = useVisual(littleInternetVisual);
  const previousPoints = useRef(new Map<string, ScenePoint>());
  const [scope, animate] = useAnimate();
  const animationRef = useRef<{ stop: () => void } | null>(null);
  // Where the route being drawn is headed, shown at its growing end.
  const [destination, setDestination] = useState<string | null>(null);

  useScrollerEvent((event) => {
    if (!isSendPacketEvent(event)) return;

    const [randomFrom, randomTo] = event.random ? (randomConnectedPair(scene) ?? []) : [];
    const from = randomFrom ?? scene.find((point) => point.id === event.from);
    const to = randomTo ?? scene.find((point) => point.id === event.to);
    if (!from || !to) return;

    animationRef.current?.stop();
    clearRoute(animate);
    setDestination(to.id);
    animationRef.current = animate(routeSequence([from, to], { retract: true }), {
      onComplete: () => {
        animationRef.current = null;
      },
    });
  });

  useLayoutEffect(() => {
    previousPoints.current = new Map(scene.map((point) => [point.id, point]));
  }, [scene]);

  // A drawn route no longer lines up once the points move, so clear it.
  const layoutKey = scene.map((point) => `${point.id}:${point.x},${point.y}`).join(" ");
  useLayoutEffect(() => {
    animationRef.current?.stop();
    animationRef.current = null;
    clearRoute(animate);
  }, [layoutKey, animate]);
  const links = scene.flatMap((from, index) => scene.slice(index + 1).map((to) => ({ from, to })));
  const head = scene.find((point) => point.id === destination);
  return (
    <div className="w-full">
      <svg
        ref={scope}
        aria-label="Connected computers"
        className="block w-full h-auto aspect-square overflow-visible"
        fill="none"
        role="img"
        viewBox="0 0 16 16"
      >
        <SmallScreenCenter points={scene}>
          <g stroke="currentColor" className="text-gray-7">
            {links.map(({ from, to }) => (
              <motion.line
                key={`${from.id}-${to.id}`}
                animate={{
                  x1: from.x,
                  y1: from.y,
                  x2: to.x,
                  y2: to.y,
                }}
                initial={{
                  x1: previousPoints.current.get(from.id)?.x ?? from.x,
                  y1: previousPoints.current.get(from.id)?.y ?? from.y,
                  x2: previousPoints.current.get(to.id)?.x ?? to.x,
                  y2: previousPoints.current.get(to.id)?.y ?? to.y,
                }}
                transition={SWIFT_TRANSITION}
                vectorEffect="non-scaling-stroke"
                strokeWidth={LINK_WIDTH}
              />
            ))}
          </g>
          <LinkFills
            count={1}
            head={head && <Shape type={head.shape} className={head.className} />}
          />
          {scene.map(
            (point) =>
              point.label && (
                <VertexLabel
                  key={`${point.id}-label`}
                  label={point.label.text}
                  x={point.label.x}
                  y={point.label.y}
                  targetX={point.x}
                  targetY={point.y}
                />
              ),
          )}
          {scene.map((point) => (
            <ScenePoint key={point.id} point={point} />
          ))}
        </SmallScreenCenter>
      </svg>
    </div>
  );
}

function ScenePoint({ point }: { point: ScenePoint }) {
  return (
    <motion.g animate={{ x: point.x, y: point.y }} initial={false} transition={SWIFT_TRANSITION}>
      <g className={NODE_SCALE}>
        <RoutePointShape id={point.id}>
          <Shape type={point.shape} className={point.className} />
        </RoutePointShape>
      </g>
    </motion.g>
  );
}

function Shape({ type, className }: { type: ScenePoint["shape"]; className?: string }) {
  const triangleHeight = Math.sqrt(3) / 2;
  switch (type) {
    case "circle":
      return (
        <circle
          className={`${className} stroke-current ${SHAPE_STROKE}`}
          vectorEffect="non-scaling-stroke"
          r="0.4"
        />
      );
    case "square":
      return (
        <rect
          x="-0.4"
          y="-0.4"
          className={`${className} stroke-current ${SHAPE_STROKE}`}
          vectorEffect="non-scaling-stroke"
          width="0.8"
          height="0.8"
        />
      );
    case "triangle":
      return (
        <polygon
          points={`0,${(-2 * triangleHeight) / 3} 0.5,${triangleHeight / 3} -0.5,${triangleHeight / 3}`}
          className={`${className} stroke-current ${SHAPE_STROKE}`}
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
        />
      );
    case "diamond":
      return (
        <polygon
          points="0,-0.6 0.48,0 0,0.6 -0.48,0"
          className={`${className} stroke-current ${SHAPE_STROKE}`}
          vectorEffect="non-scaling-stroke"
        />
      );
    case "router":
      return <circle r="1" stroke="none" />;
  }
}

function VertexLabel({
  label,
  x,
  y,
  targetX,
  targetY,
}: {
  label: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}) {
  const offsetX = (x - targetX) * LABEL_OFFSET_SCALE;
  const offsetY = (y - targetY) * LABEL_OFFSET_SCALE;

  // Drawn around the point it labels, so scaling it up on small screens also
  // moves the label clear of the (equally scaled) shape.
  return (
    <motion.g animate={{ x: targetX, y: targetY }} initial={false} transition={SWIFT_TRANSITION}>
      <g className={NODE_SCALE}>
        <motion.line
          animate={{ x1: offsetX, y1: offsetY }}
          initial={false}
          transition={SWIFT_TRANSITION}
          x2={0}
          y2={0}
          stroke="black"
          strokeDasharray="4 3"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <motion.g
          animate={{ x: offsetX, y: offsetY }}
          initial={false}
          transition={SWIFT_TRANSITION}
        >
          <LabelTag text={label} />
        </motion.g>
      </g>
    </motion.g>
  );
}
