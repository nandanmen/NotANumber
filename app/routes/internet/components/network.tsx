import { motion, type AnimationSequence } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

// Shared pieces for the internet visuals: the dotted grid, routers, and the
// link fill that draws a route as data travels along it.

type Point = { x: number; y: number };

// A point on a route. Points with a `routerId` are routers, rendered inside a
// `[data-router="<routerId>"]` group, and light up their dots as data passes through.
// A route's first and last points pulse if they have an `id` matching a
// `[data-route-point="<id>"]` element (see `RoutePointShape`).
export type RoutePoint = Point & { routerId?: string; id?: string };

export type RouterBadge = { label: string; fill: string; text: string };

export const FILL_COLOR = "var(--gray-12)";

// The growing end of a route carries a small copy of its destination.
const LINK_HEAD_SCALE = 0.6;

// Shapes, routers and labels are drawn around their own origin, so they can be
// drawn larger than their grid spacing without moving them.
export const NODE_SCALE = "scale-150";

// Outlines of routers and other shapes, thickened to suit their larger size.
export const SHAPE_STROKE = "[stroke-width:1.5]";

// Link thickness in pixels.
export const LINK_WIDTH = 4;
const FILL_TRANSITION = { type: "tween", duration: 0.6, ease: "linear" } as const;
const ROUTER_DOT_DELAY = 0.15;
const LINK_HEAD = "[data-link-head]";

// The sender squeezes in before the route is drawn, and the receiver swells as
// the route reaches it.
const SEND_PULSE = { scale: [1, 0.8, 1], duration: 0.3 };
const RECEIVE_PULSE = { scale: [1, 1.2, 1], duration: 0.3 };
const ROUTER_CENTER_DOT = 4;

// 3x3 grid of square dots filling this much of the router, indexed row by row
// from the top-left.
const ROUTER_DOT_GRID_SIZE = 0.6;
const ROUTER_DOT_GAP = 0.03;
const ROUTER_DOT_SIZE = (ROUTER_DOT_GRID_SIZE - 2 * ROUTER_DOT_GAP) / 3;
const ROUTER_DOT_POSITIONS = [-1, 0, 1].flatMap((row) =>
  [-1, 0, 1].map((col) => ({
    x: col * (ROUTER_DOT_SIZE + ROUTER_DOT_GAP) - ROUTER_DOT_SIZE / 2,
    y: row * (ROUTER_DOT_SIZE + ROUTER_DOT_GAP) - ROUTER_DOT_SIZE / 2,
  })),
);

// Picks the outer dot that faces `point`, snapping the direction to the nearest 45°.
function routerDotForDirection(router: Point, point: Point) {
  const octant = Math.round(Math.atan2(point.y - router.y, point.x - router.x) / (Math.PI / 4));
  const angle = (octant * Math.PI) / 4;
  const col = Math.round(Math.cos(angle));
  const row = Math.round(Math.sin(angle));
  return (row + 1) * 3 + (col + 1);
}

// Builds the animation that fills in each link along `path` in order. Link `i`
// is drawn by the `[data-link-fill="<i>"]` line, so the figure must render at
// least `path.length - 1` of them (see `LinkFills`). The route stays drawn at
// the end until `clearRoute` resets it, unless `retract` is set, in which case
// the fill then drains away toward the destination.
// While a router's center square is lit, it can look something up (such as
// scanning its routing table). Given the router and the time its center lights
// up, returns the animation for that and how long the route should wait for it.
export type RouterLookup = (
  routerId: string,
  at: number,
  destination: RoutePoint,
) => { sequence: AnimationSequence; duration: number } | null;

// How long a routing table lookup highlights each row it checks, and how the
// router's center square turns 45° as it checks each row.
export const LOOKUP_ROW_DURATION = 0.25;
const LOOKUP_TURN = { degrees: 45, duration: 0.2, ease: "easeOut" } as const;

/**
 * Scans a routing table's rows top to bottom while its router's center square
 * is lit, stopping at `match` (which stays highlighted) or passing every row
 * when there's no match. Rows are `[data-lookup="<routerId>"]` elements with a
 * `data-lookup-row` index; `clearRoute` hides them again.
 */
export function tableLookup(
  routerId: string,
  at: number,
  rows: number,
  match: number,
): { sequence: AnimationSequence; duration: number } {
  const sequence: AnimationSequence = [];
  const checked = match === -1 ? rows : match + 1;
  for (let row = 0; row < checked; row++) {
    const selector = `[data-lookup="${routerId}"] [data-lookup-row="${row}"]`;
    const start = at + row * LOOKUP_ROW_DURATION;
    sequence.push([selector, { opacity: [0, 1] }, { duration: 0, at: start }]);
    sequence.push([
      `[data-router="${routerId}"] [data-router-cell="${ROUTER_CENTER_DOT}"]`,
      { rotate: [row * LOOKUP_TURN.degrees, (row + 1) * LOOKUP_TURN.degrees] },
      { duration: LOOKUP_TURN.duration, ease: LOOKUP_TURN.ease, at: start },
    ]);
    // Rows that don't match turn off as the scan moves on.
    if (row !== match) {
      sequence.push([
        selector,
        { opacity: [1, 0] },
        { duration: 0, at: start + LOOKUP_ROW_DURATION },
      ]);
    }
  }
  return { sequence, duration: checked * LOOKUP_ROW_DURATION };
}

export function routeSequence(
  path: RoutePoint[],
  { retract = false, lookup }: { retract?: boolean; lookup?: RouterLookup } = {},
): AnimationSequence {
  // Sequences merge every segment for an element into one keyframe track, so
  // instant changes use explicit [from, to] keyframes to avoid interpolating
  // between segments.
  const instant = (at: number) => ({ duration: 0, at });
  const sequence: AnimationSequence = [];
  let time = 0;

  const routePoint = (point: RoutePoint | undefined) =>
    point?.id ? `[data-route-point="${point.id}"]` : null;
  const sender = routePoint(path[0]);
  if (sender) {
    sequence.push([
      sender,
      { scale: SEND_PULSE.scale },
      { duration: SEND_PULSE.duration, at: time },
    ]);
    // The route sets off once the sender has squeezed in, as it springs back.
    time += SEND_PULSE.duration / 2;
  }

  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const next = path[i];
    const fill = `[data-link-fill="${i - 1}"]`;

    // Grow the filled line from the previous point toward the next one.
    sequence.push([fill, { x1: [prev.x, prev.x], y1: [prev.y, prev.y] }, instant(time)]);
    sequence.push([fill, { opacity: [0, 1] }, instant(time)]);
    sequence.push([
      fill,
      { x2: [prev.x, next.x], y2: [prev.y, next.y] },
      { ...FILL_TRANSITION, at: time },
    ]);
    // The head moves with the growing end, from the start of the route.
    if (i === 1) sequence.push([LINK_HEAD, { opacity: [0, 1] }, instant(time)]);
    sequence.push([
      LINK_HEAD,
      { x: [prev.x, next.x], y: [prev.y, next.y] },
      { ...FILL_TRANSITION, at: time },
    ]);
    time += FILL_TRANSITION.duration;

    const after = path[i + 1];
    if (next.routerId && after) {
      const dot = (index: number) =>
        `[data-router="${next.routerId}"] [data-router-dot="${index}"]`;
      // Light the dots in the order the data crosses the router: in, through the center, out.
      sequence.push([dot(routerDotForDirection(next, prev)), { opacity: [0, 1] }, instant(time)]);
      time += ROUTER_DOT_DELAY;
      sequence.push([dot(ROUTER_CENTER_DOT), { opacity: [0, 1] }, instant(time)]);
      const found = lookup?.(next.routerId, time, path[path.length - 1]);
      if (found) {
        sequence.push(...found.sequence);
        time += found.duration;
      }
      time += ROUTER_DOT_DELAY;
      sequence.push([dot(routerDotForDirection(next, after)), { opacity: [0, 1] }, instant(time)]);
    }
  }

  // The route has been drawn, so the head goes and the receiver swells.
  sequence.push([LINK_HEAD, { opacity: [1, 0] }, instant(time)]);
  const receiver = routePoint(path.at(-1));
  if (receiver) {
    sequence.push([
      receiver,
      { scale: RECEIVE_PULSE.scale },
      { duration: RECEIVE_PULSE.duration, at: time },
    ]);
  }

  if (retract) {
    // Pull the start of each filled line toward its end, one link after another.
    for (let i = 1; i < path.length; i++) {
      const prev = path[i - 1];
      const next = path[i];
      const fill = `[data-link-fill="${i - 1}"]`;
      sequence.push([
        fill,
        { x1: [prev.x, next.x], y1: [prev.y, next.y] },
        { ...FILL_TRANSITION, at: time },
      ]);
      time += FILL_TRANSITION.duration;
      sequence.push([fill, { opacity: [1, 0] }, instant(time)]);
    }
  }

  return sequence;
}

// Hides any drawn route and lit router dots.
export function clearRoute(
  animate: (
    selector: string,
    values: { opacity: number } | { rotate: number } | { scale: number },
    options: { duration: number },
  ) => unknown,
) {
  animate("[data-link-fill]", { opacity: 0 }, { duration: 0 });
  animate(LINK_HEAD, { opacity: 0 }, { duration: 0 });
  animate("[data-router-dot]", { opacity: 0 }, { duration: 0 });
  animate("[data-router-cell]", { rotate: 0 }, { duration: 0 });
  animate("[data-lookup-row]", { opacity: 0 }, { duration: 0 });
  animate("[data-route-point]", { scale: 1 }, { duration: 0 });
}

/** Wraps a point's shape so a route starting or ending there can pulse it. */
export function RoutePointShape({ id, children }: { id: string; children: ReactNode }) {
  return (
    <g data-route-point={id} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      {children}
    </g>
  );
}

// Lines that `routeSequence` positions and grows over the links of a route.
// `head` is the destination's shape, drawn small at the growing end of the route.
export function LinkFills({ count, head }: { count: number; head?: ReactNode }) {
  return (
    <>
      <g style={{ stroke: FILL_COLOR }}>
        {Array.from({ length: count }, (_, i) => (
          <motion.line
            key={i}
            data-link-fill={i}
            initial={{ opacity: 0 }}
            vectorEffect="non-scaling-stroke"
            strokeWidth={LINK_WIDTH}
          />
        ))}
      </g>
      {/* Rides the growing end of the route as it's drawn. */}
      <motion.g data-link-head initial={{ opacity: 0 }}>
        <g transform={`scale(${LINK_HEAD_SCALE})`}>{head}</g>
      </motion.g>
    </>
  );
}

const FIGURE_SIZE = 16;
// Grid lines fall every this many units on small screens.
const SMALL_SCREEN_GRID_STEP = 2;

type LabeledPoint = Point & { label?: Point };

// Offset that moves the middle of [min, max] to the middle of the figure, in
// whole grid cells so points stay on the grid lines.
function centeringShift(values: number[]) {
  const middle = (Math.min(...values) + Math.max(...values)) / 2;
  const cells = Math.round((FIGURE_SIZE / 2 - middle) / SMALL_SCREEN_GRID_STEP);
  return cells * SMALL_SCREEN_GRID_STEP;
}

/** Centers a drawing of `points` (and their labels) in its 16-unit figure on small screens. */
export function SmallScreenCenter({
  points,
  children,
}: {
  points: LabeledPoint[];
  children: ReactNode;
}) {
  const withLabels = points.flatMap((point) => (point.label ? [point, point.label] : [point]));
  // CSS lengths on SVG content are in user units, so px here means grid units.
  const style = {
    "--center-x": `${centeringShift(withLabels.map((point) => point.x))}px`,
    "--center-y": `${centeringShift(withLabels.map((point) => point.y))}px`,
  } as CSSProperties;

  return (
    <g
      className="max-lg:translate-x-(--center-x) max-lg:translate-y-(--center-y) transition-[translate] duration-300"
      style={style}
    >
      {children}
    </g>
  );
}

export function RouterShape({ badge }: { badge: RouterBadge }) {
  return (
    <>
      {/* Numbered card tucked behind the router, peeking out above it. Labels in
          these figures center their digits with dy rather than
          dominant-baseline, which iOS WebKit places too high. */}
      <g>
        <rect x="-0.25" y="-0.92" width="0.5" height="0.72" style={{ fill: badge.fill }} />
        <text
          y="-0.68"
          style={{ fill: badge.text }}
          className="font-sans"
          fontSize="0.28"
          fontWeight="700"
          textAnchor="middle"
          dy="0.35em"
        >
          {badge.label}
        </text>
      </g>
      <rect
        width="0.9"
        height="0.9"
        x="-0.45"
        y="-0.45"
        style={{ fill: "white", stroke: "var(--gray-12)" }}
        className={SHAPE_STROKE}
        vectorEffect="non-scaling-stroke"
      />
      {ROUTER_DOT_POSITIONS.map(({ x, y }, index) => (
        // Each cell turns as a whole, around its own center.
        <g
          key={index}
          data-router-cell={index}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <rect
            x={x}
            y={y}
            width={ROUTER_DOT_SIZE}
            height={ROUTER_DOT_SIZE}
            style={{ fill: "var(--gray-5)" }}
          />
          <rect
            data-router-dot={index}
            x={x}
            y={y}
            width={ROUTER_DOT_SIZE}
            height={ROUTER_DOT_SIZE}
            style={{ fill: badge.fill, transformBox: "fill-box", transformOrigin: "center" }}
            opacity="0"
          />
        </g>
      ))}
    </>
  );
}

// Labels on points are sized like a router's numbered card: as tall as the part
// peeking out above the router, with the same text, and wide enough to fit it.
const LABEL_HEIGHT = 0.48;
const LABEL_FONT_SIZE = 0.28;
const LABEL_MIN_WIDTH = 0.5;
const LABEL_CHARACTER_WIDTH = 0.16;

/** A point's label tag, drawn around its own origin. */
export function LabelTag({ text }: { text: string }) {
  const width = Math.max(LABEL_MIN_WIDTH, LABEL_CHARACTER_WIDTH * (text.length + 1));
  return (
    <>
      <rect
        x={-width / 2}
        y={-LABEL_HEIGHT / 2}
        width={width}
        height={LABEL_HEIGHT}
        style={{ fill: "var(--gray-12)" }}
      />
      <text
        style={{ fill: "var(--gray-1)" }}
        className="font-sans"
        fontSize={LABEL_FONT_SIZE}
        fontWeight="700"
        textAnchor="middle"
        dy="0.35em"
      >
        {text}
      </text>
    </>
  );
}
