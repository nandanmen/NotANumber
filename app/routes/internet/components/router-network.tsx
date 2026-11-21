import {
  useVisual,
  type SceneDefinition,
  type ScenePoint,
  type Visual,
} from "~/components/article/use-visual";
import { useScrollerEvent, type ScrollerEvent } from "~/components/article/scroller";
import { useAnimate } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import {
  clearRoute,
  LinkFills,
  NODE_SCALE,
  routeSequence,
  RouterShape,
  tableLookup,
  type RouterLookup,
  SmallScreenCenter,
  type RoutePoint,
  type RouterBadge,
  LINK_WIDTH,
  SHAPE_STROKE,
  LabelTag,
  RoutePointShape,
} from "./network";

const scenes: SceneDefinition[] = [
  {
    one: { x: 8, y: 3, label: { x: 8, y: 1.5, text: "1" } },
    four: { x: 11, y: 5, label: { x: 12.423, y: 4.526, text: "4" } },
    three: { x: 10, y: 9, label: { x: 10.832, y: 10.248, text: "3" } },
    two: { x: 6, y: 9, label: { x: 5.168, y: 10.248, text: "2" } },
    five: { x: 5, y: 5, label: { x: 3.577, y: 4.526, text: "5" } },
    routerOne: { x: 8, y: 6 },
  },
  {
    one: { x: 2, y: 5, label: { x: 2, y: 3.5, text: "1" } },
    two: { x: 2, y: 9, label: { x: 2, y: 10.5, text: "2" } },
    routerOne: { x: 5.5, y: 7 },
    three: { x: 14, y: 5, label: { x: 14, y: 3.5, text: "3" } },
    four: { x: 14, y: 9, label: { x: 14, y: 10.5, text: "4" } },
    routerTwo: { x: 10.5, y: 7 },
  },
];

const routerNetworkVisual: Visual = {
  points: {
    one: { shape: "circle", className: "fill-blue-7", label: "1" },
    two: { shape: "square", className: "fill-yellow-10", label: "2" },
    three: { shape: "circle", className: "fill-cyan-9", label: "3" },
    four: { shape: "triangle", className: "fill-red-8", label: "2.1" },
    five: { shape: "diamond", className: "fill-green-9", label: "2.2" },
    routerOne: { shape: "router", className: "fill-white", label: "R1" },
    routerTwo: { shape: "router", className: "fill-white", label: "R2" },
  },
  scenes,
  events: ["send-packet"],
};

const LABEL_OFFSET_SCALE = 0.75;

// Each router's card uses its network's color.
const ROUTER_BADGES: Record<string, RouterBadge> = {
  routerOne: { label: "1", fill: "var(--blue-9)", text: "white" },
  routerTwo: { label: "2", fill: "var(--orange-8)", text: "white" },
};

// With two networks, each router knows which router every computer in the
// other network sits behind. Computers are named by their point id.
const ROUTING_TABLES: Record<string, { to: string; via: string }[]> = {
  routerOne: [
    { to: "three", via: "routerTwo" },
    { to: "four", via: "routerTwo" },
  ],
  routerTwo: [
    { to: "one", via: "routerOne" },
    { to: "two", via: "routerOne" },
  ],
};

// Routing tables hang this far below their router's center, and are sized in
// the same units as the routers (before NODE_SCALE enlarges both). Each row is
// a computer's shape, an arrow, and the badge of the router to send it to,
// with the same padding on every side.
const TABLE_OFFSET = 1;
const TABLE_PADDING = 0.18;
const TABLE_GAP = 0.12;
const TABLE_SHAPE_SIZE = 0.5;

// How much larger than a circle each shape is (its widest side over the
// circle's 0.8), and how far its center sits above its middle, so each fits a
// table cell the way a circle does.
const TRIANGLE_HEIGHT = Math.sqrt(3) / 2;
const SHAPE_FIT: Partial<Record<ScenePoint["shape"], { size: number; offsetY: number }>> = {
  triangle: { size: 1 / 0.8, offsetY: -TRIANGLE_HEIGHT / 6 },
  diamond: { size: 1.2 / 0.8, offsetY: 0 },
};
const TABLE_ARROW_WIDTH = 0.3;
const TABLE_BADGE_SIZE = 0.5;
const TABLE_ROW_HEIGHT = TABLE_BADGE_SIZE + 2 * TABLE_PADDING;
const TABLE_WIDTH =
  2 * TABLE_PADDING + TABLE_SHAPE_SIZE + TABLE_ARROW_WIDTH + TABLE_BADGE_SIZE + 2 * TABLE_GAP;

type SendPacketEvent = ScrollerEvent & {
  type: "send-packet";
  from: string;
  to: string;
};

function isSendPacketEvent(event: ScrollerEvent): event is SendPacketEvent {
  return (
    event.type === "send-packet" && typeof event.from === "string" && typeof event.to === "string"
  );
}

const firstNetworkConnections = [
  ["routerOne", "one"],
  ["routerOne", "two"],
  ["routerOne", "three"],
  ["routerOne", "four"],
  ["routerOne", "five"],
] as const;

const twoNetworkConnections = [
  ["routerOne", "one"],
  ["routerOne", "two"],
  ["routerTwo", "three"],
  ["routerTwo", "four"],
  ["routerOne", "routerTwo"],
] as const;

function getConnections(scene: ScenePoint[]) {
  const pointById = new Map(scene.map((point) => [point.id, point]));
  const connections = pointById.has("routerTwo") ? twoNetworkConnections : firstNetworkConnections;

  return connections.flatMap(([fromId, toId]) => {
    const from = pointById.get(fromId);
    const to = pointById.get(toId);
    return from && to ? [{ from, to }] : [];
  });
}

// Finds the shortest chain of links from `from` to `to`, marking routers along the way.
function findRoute(
  links: { from: ScenePoint; to: ScenePoint }[],
  from: ScenePoint,
  to: ScenePoint,
): RoutePoint[] | null {
  const neighbors = new Map<string, ScenePoint[]>();
  for (const link of links) {
    neighbors.set(link.from.id, [...(neighbors.get(link.from.id) ?? []), link.to]);
    neighbors.set(link.to.id, [...(neighbors.get(link.to.id) ?? []), link.from]);
  }

  const previous = new Map<string, ScenePoint | null>([[from.id, null]]);
  const queue = [from];
  while (queue.length > 0) {
    const point = queue.shift()!;
    if (point.id === to.id) break;
    for (const next of neighbors.get(point.id) ?? []) {
      if (previous.has(next.id)) continue;
      previous.set(next.id, point);
      queue.push(next);
    }
  }
  if (!previous.has(to.id)) return null;

  const route: RoutePoint[] = [];
  for (let point: ScenePoint | null = to; point; point = previous.get(point.id) ?? null) {
    route.unshift(point.shape === "router" ? { ...point, routerId: point.id } : point);
  }
  return route;
}

export function RouterNetwork() {
  const scene = useVisual(routerNetworkVisual);
  const [scope, animate] = useAnimate();
  const animationRef = useRef<{ stop: () => void } | null>(null);
  // Where the route being drawn is headed, shown at its growing end.
  const [destination, setDestination] = useState<string | null>(null);

  const links = getConnections(scene);
  const hasSecondNetwork = scene.some((point) => point.id === "routerTwo");

  useScrollerEvent((event) => {
    if (!isSendPacketEvent(event)) return;

    const from = scene.find((point) => point.id === event.from);
    const to = scene.find((point) => point.id === event.to);
    const route = from && to && findRoute(links, from, to);
    if (!route) return;

    animationRef.current?.stop();
    clearRoute(animate);
    setDestination(to.id);
    // Routers with a routing table look the destination up in it on the way through.
    const lookup: RouterLookup = (routerId, at, destination) => {
      const routes = hasSecondNetwork ? ROUTING_TABLES[routerId] : undefined;
      if (!routes) return null;
      const match = routes.findIndex((route) => route.to === (destination as ScenePoint).id);
      return tableLookup(routerId, at, routes.length, match);
    };
    animationRef.current = animate(routeSequence(route, { lookup }), {
      onComplete: () => {
        animationRef.current = null;
      },
    });
  });

  // Scrolling to the other section swaps the drawing at once, without animating
  // between the two. A drawn route no longer lines up, so clear it.
  const layoutKey = scene.map((point) => `${point.id}:${point.x},${point.y}`).join(" ");
  useLayoutEffect(() => {
    animationRef.current?.stop();
    animationRef.current = null;
    clearRoute(animate);
  }, [layoutKey, animate]);

  // With two networks, computers take their network's color.
  const points = hasSecondNetwork
    ? scene.map((point) =>
        point.shape === "router"
          ? point
          : {
              ...point,
              className: ["three", "four"].includes(point.id) ? "fill-orange-8" : "fill-blue-7",
            },
      )
    : scene;
  const head = points.find((point) => point.id === destination);

  return (
    <div className="w-full">
      <svg
        ref={scope}
        aria-label="Computer networks connected by routers"
        className="block w-full h-auto aspect-square overflow-visible"
        fill="none"
        role="img"
        viewBox="0 0 16 16"
      >
        <SmallScreenCenter points={scene}>
          <g stroke="currentColor" className="text-gray-7">
            {links.map(({ from, to }) => (
              <line
                key={`${from.id}-${to.id}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                vectorEffect="non-scaling-stroke"
                strokeWidth={LINK_WIDTH}
              />
            ))}
          </g>
          {hasSecondNetwork &&
            scene
              .filter((point) => ROUTING_TABLES[point.id])
              .map((router) => (
                <line
                  key={`${router.id}-table-link`}
                  x1={router.x}
                  y1={router.y}
                  x2={router.x}
                  y2={router.y + TABLE_OFFSET}
                  stroke="black"
                  strokeDasharray="4 3"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
          <LinkFills
            count={links.length}
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
          {points.map((point) => (
            <ScenePoint key={point.id} point={point} />
          ))}
          {hasSecondNetwork &&
            scene
              .filter((point) => ROUTING_TABLES[point.id])
              .map((router) => (
                <RoutingTable
                  key={`${router.id}-table`}
                  routerId={router.id}
                  x={router.x}
                  y={router.y + TABLE_OFFSET}
                  routes={ROUTING_TABLES[router.id]}
                  points={points}
                />
              ))}
        </SmallScreenCenter>
      </svg>
    </div>
  );
}

function ScenePoint({ point }: { point: ScenePoint }) {
  return (
    <g
      data-point-id={point.id}
      data-router={point.shape === "router" ? point.id : undefined}
      transform={`translate(${point.x} ${point.y})`}
    >
      <g className={NODE_SCALE}>
        {point.shape === "router" ? (
          <RouterShape badge={ROUTER_BADGES[point.id]} />
        ) : (
          <RoutePointShape id={point.id}>
            <Shape type={point.shape} className={point.className} />
          </RoutePointShape>
        )}
      </g>
    </g>
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
      return null;
  }
}

// A table of which router to send each computer's data to, hanging from its
// top-center at (x, y).
function RoutingTable({
  routerId,
  x,
  y,
  routes,
  points,
}: {
  routerId: string;
  x: number;
  y: number;
  routes: { to: string; via: string }[];
  points: ScenePoint[];
}) {
  const left = -TABLE_WIDTH / 2;
  const height = routes.length * TABLE_ROW_HEIGHT;
  const shapeX = left + TABLE_PADDING;
  const arrowX = shapeX + TABLE_SHAPE_SIZE + TABLE_GAP;
  const badgeX = arrowX + TABLE_ARROW_WIDTH + TABLE_GAP;
  const arrowHead = 0.09;

  return (
    <g transform={`translate(${x} ${y})`} data-lookup={routerId}>
      <g className={`${NODE_SCALE} font-sans`}>
        <rect x={left} width={TABLE_WIDTH} height={height} fill="white" />
        {routes.map((route, index) => {
          const top = index * TABLE_ROW_HEIGHT;
          const middle = top + TABLE_ROW_HEIGHT / 2;
          const badge = ROUTER_BADGES[route.via];
          const computer = points.find((point) => point.id === route.to);
          return (
            <g key={route.to}>
              {/* Highlights the row as the router checks it during a lookup. */}
              <rect
                data-lookup-row={index}
                x={left}
                y={top}
                width={TABLE_WIDTH}
                height={TABLE_ROW_HEIGHT}
                style={{ fill: "var(--gray-4)" }}
                opacity="0"
              />
              {index > 0 && (
                <line
                  x1={left}
                  x2={-left}
                  y1={top}
                  y2={top}
                  stroke="black"
                  strokeDasharray="4 3"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {computer && (
                // Shrink each shape to half size, and the larger ones further to match a circle.
                <g
                  transform={`translate(${shapeX + TABLE_SHAPE_SIZE / 2} ${middle}) scale(${TABLE_SHAPE_SIZE / (SHAPE_FIT[computer.shape]?.size ?? 1)}) translate(0 ${-(SHAPE_FIT[computer.shape]?.offsetY ?? 0)})`}
                >
                  <Shape type={computer.shape} className={computer.className} />
                </g>
              )}
              <path
                d={`M ${arrowX} ${middle} h ${TABLE_ARROW_WIDTH} m ${-arrowHead} ${-arrowHead} l ${arrowHead} ${arrowHead} l ${-arrowHead} ${arrowHead}`}
                stroke="var(--gray-12)"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x={badgeX}
                y={middle - TABLE_BADGE_SIZE / 2}
                width={TABLE_BADGE_SIZE}
                height={TABLE_BADGE_SIZE}
                style={{ fill: badge.fill }}
              />
              <text
                x={badgeX + TABLE_BADGE_SIZE / 2}
                y={middle}
                style={{ fill: badge.text }}
                fontSize="0.3"
                fontWeight="700"
                textAnchor="middle"
                dy="0.35em"
              >
                {badge.label}
              </text>
            </g>
          );
        })}
        {/* The border goes on top, so highlighted rows don't cover it. */}
        <rect
          x={left}
          width={TABLE_WIDTH}
          height={height}
          fill="none"
          stroke="black"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </g>
  );
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
    <g transform={`translate(${targetX} ${targetY})`}>
      <g className={NODE_SCALE}>
        <line
          x1={offsetX}
          y1={offsetY}
          x2={0}
          y2={0}
          stroke="black"
          strokeDasharray="4 3"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <g transform={`translate(${offsetX} ${offsetY})`}>
          <LabelTag text={label} />
        </g>
      </g>
    </g>
  );
}
