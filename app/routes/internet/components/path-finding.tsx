import {
  animate,
  motion,
  useAnimate,
  useMotionValue,
  useTransform,
  type Transition,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useScroller, useScrollerEvent } from "~/components/article/scroller";
import {
  clearRoute,
  LINK_WIDTH,
  NODE_SCALE,
  routeSequence,
  SHAPE_STROKE,
  type RoutePoint,
  LabelTag,
  LinkFills,
  RoutePointShape,
} from "./network";

// Three networks connected in a chain, R1 — R2 — R3, across four scroller sections:
// 0. data from 1.1 to 3.2 has to hop through R2;
// 1. stepped through by the text: R3 starts up, announces 3.x to R2, learns
//    R2's routes, and R2 passes 3.x on to R1;
// 2. with a direct R1 — R3 link running over R2, R3 announces 3.x to both;
// 3. R2 passes 3.x on to R1 too, so R1 hears about it twice.

type Point = { x: number; y: number };
type Shape = "circle" | "square" | "triangle";
type RouterId = "r1" | "r2" | "r3";
type ComputerId = "c11" | "c12" | "c21" | "c31" | "c32";

type RouterBadge = { label: string; fill: string; text: string };

const ROUTER_IDS: RouterId[] = ["r1", "r2", "r3"];

// Each router's card uses its network's color.
const ROUTER_BADGES: Record<RouterId, RouterBadge> = {
  r1: { label: "1", fill: "var(--blue-9)", text: "white" },
  r2: { label: "2", fill: "var(--orange-8)", text: "white" },
  r3: { label: "3", fill: "var(--green-9)", text: "white" },
};

const ROUTER_Y = 8;

// Where the routers sit: in the first section's chain, before router 3 starts
// up (centered), and once it's up.
const CHAIN_X: Record<RouterId, number> = { r1: 4, r2: 8, r3: 12 };
const START_X: Record<RouterId, number> = { r1: 5.5, r2: 10.5, r3: 13 };
const END_X: Record<RouterId, number> = { r1: 3, r2: 8, r3: 13 };

// Router 3 first appears as a square twice as wide as a link.
const SQUARE_SIZE = LINK_WIDTH * 2;

// Full router size, in viewBox units.
const ROUTER_SIZE = 0.9;

// The figure's viewBox is this many units across.
const VIEW_SIZE = 16;

const ACTIVE_STROKE = "var(--gray-12)";
const INACTIVE = { fill: "var(--gray-6)", stroke: "var(--gray-8)" };

type Computer = {
  id: ComputerId;
  shape: Shape;
  fill: string;
  stroke: string;
  router: RouterId;
  position: Point;
  label?: { text: string; position: Point };
};

// Computers only appear in the first section. Only the endpoints we talk about
// in the text get a color and a label.
const computers: Computer[] = [
  {
    id: "c11",
    shape: "circle",
    fill: "var(--blue-7)",
    stroke: ACTIVE_STROKE,
    router: "r1",
    position: { x: 2, y: 5 },
    label: { text: "1.1", position: { x: 2, y: 3.5 } },
  },
  { id: "c12", shape: "square", ...INACTIVE, router: "r1", position: { x: 2, y: 11 } },
  { id: "c21", shape: "triangle", ...INACTIVE, router: "r2", position: { x: 8, y: 11 } },
  { id: "c31", shape: "circle", ...INACTIVE, router: "r3", position: { x: 14, y: 5 } },
  {
    id: "c32",
    shape: "square",
    fill: "var(--green-9)",
    stroke: ACTIVE_STROKE,
    router: "r3",
    position: { x: 14, y: 11 },
    label: { text: "3.2", position: { x: 14, y: 12.5 } },
  },
];

// Buttons each section's text can use.
const SECTION_EVENTS = [["send-packet"], ["announce"], ["announce"], ["forward"]];

// The top and bottom of each section's content in the viewBox on small screens,
// with shapes drawn at their larger size: the labelled computers in the first, and the
// routers and their routing tables (up to three rows) in the others.
const SMALL_SCREEN_CROP: [number, number][] = [
  [2.5, 13.5],
  [5.9, 12.5],
  [5.4, 13.6],
  [5.4, 13.6],
];

const SWIFT_TRANSITION = { type: "spring", stiffness: 280, damping: 18, mass: 0.3 } as const;
const FADE_TRANSITION = { duration: 0.3 } as const;
const INSTANT = { duration: 0 } as const;
const LABEL_OFFSET_SCALE = 0.75;

// Router 3 starts up in two stages: it appears as a small square that pushes the
// others left and links up to router 2, then expands into a full router.
type StartupStage = 0 | 1 | 2;

// When each part of the startup begins, and how long it takes, in seconds.
// It fills most of a step's time while playing (see the `Steps` duration in
// the article), finishing at about 2s.
const LINK_DELAY = 0.25;
const LINK_DURATION = 0.6;
const MEET_AT = LINK_DELAY + LINK_DURATION;
const TICK_DRAW_OUT = 0.4;
// Router 3 starts expanding shortly after the two halves of the link meet.
const EXPAND_AT = MEET_AT + 0.3;

// Into stage 1: router 3 appears as it pushes the others left, then links up.
const LINK_UP = {
  square: { duration: 0.5, ease: "backOut" },
  link: { delay: LINK_DELAY, duration: LINK_DURATION, ease: "easeInOut" },
} as const;

// The ticks stay hidden until the two halves of the link meet, flash, then
// quickly draw out. Motion jumps to the first keyframe as soon as it starts,
// so the wait is part of the keyframes rather than a delay.
const TICK_TRANSITION: Transition = {
  duration: MEET_AT + TICK_DRAW_OUT,
  times: [0, (MEET_AT - 0.01) / (MEET_AT + TICK_DRAW_OUT), MEET_AT / (MEET_AT + TICK_DRAW_OUT), 1],
  ease: ["linear", "linear", "easeOut"],
};

// Into stage 2: router 3 expands, then its label and routing table appear.
const EXPAND = {
  dots: { delay: 0.15, duration: 0.3 },
  details: { delay: 0.4, duration: 0.4, ease: "easeOut" },
} as const;

// How far router 3's label and table travel as they appear.
const LABEL_RISE = 0.4;
const TABLE_DROP_PX = 8;

// Ticks above and below where the R2 — R3 link meets: how far from the link's
// center they start, and how long they are.
const TICK_GAP = 0.15;
const TICK_LENGTH = 0.25;

// Each half of the R2 — R3 link runs slightly past the middle so no seam shows.
const LINK_OVERLAP = 0.02;

// The direct R1 — R3 link goes straight up from R1, across over R2, and
// straight down into R3, with its two corners rounded to this radius.
const DIRECT_LINK_TOP = 6;
const DIRECT_LINK_RADIUS = 0.4;
const DIRECT_LINK_CORNER_SAMPLES = 8;

// Announcement packets are smaller than a router, outline included, so it
// hides them completely as they pass behind it.
const PACKET_WIDTH = 0.8;
const PACKET_HEIGHT = 0.44;

// Announcements travel this many seconds per unit of link.
const ANNOUNCEMENT_SECONDS_PER_UNIT = 0.1;

// Seconds between each step as an announcement works its way through a router,
// and how long a center square takes to pulse.
const ROUTER_STEP = 0.25;
const PULSE_DURATION = 0.3;
const PULSE_SCALE = 1.4;

// Seconds the lights stay on after the last animation ends, and how much longer
// the centers stay lit after the outer rings turn off.
const LIGHTS_OFF_DELAY = 0.3;
const CENTER_LINGER = 0.15;

// Routing tables sit under their router.
const TABLE_TOP = 9;
const TABLE_PADDING = 0.15;
const TABLE_ROW_HEIGHT = 0.9;

type Route = { prefix: string; via: RouterId };

type Forward = Partial<Record<RouterId, RouterId[]>>;

type Announcement = {
  id: number;
  prefix: string;
  from: RouterId;
  to: RouterId;
  // Where each router passes the announcement on to once it arrives.
  forward: Forward;
};

// R1 and R2 are directly connected, so each already knows how to reach the
// other's network. R3 has just started up and knows nothing yet.
const INITIAL_TABLES: Record<RouterId, Route[]> = {
  r1: [{ prefix: "2.x", via: "r2" }],
  r2: [{ prefix: "1.x", via: "r1" }],
  r3: [],
};

// Each router's routing table once the given step of the second section is done.
function tablesAfter(step: number): Record<RouterId, Route[]> {
  return {
    r1: [...INITIAL_TABLES.r1, ...(step >= 4 ? [{ prefix: "3.x", via: "r2" as const }] : [])],
    r2: [...INITIAL_TABLES.r2, ...(step >= 2 ? [{ prefix: "3.x", via: "r3" as const }] : [])],
    r3:
      step >= 3
        ? [
            { prefix: "2.x", via: "r2" },
            { prefix: "1.x", via: "r2" },
          ]
        : [],
  };
}

const NO_ROUTES: Record<RouterId, Route[]> = { r1: [], r2: [], r3: [] };

// What R1 and R2 have learned once R3 has announced 3.x to both, where the last
// section starts.
const AFTER_DIRECT_ANNOUNCEMENT: Record<RouterId, Route[]> = {
  r1: [{ prefix: "3.x", via: "r3" }],
  r2: [{ prefix: "3.x", via: "r3" }],
  r3: [],
};

// The network each prefix belongs to, which colors its announcements.
const PREFIX_ROUTER: Record<string, RouterId> = { "1.x": "r1", "2.x": "r2", "3.x": "r3" };

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
const ROUTER_CENTER_DOT = 4;

// Picks the outer dot that faces `point`, snapping the direction to the nearest 45°.
function routerDotForDirection(router: Point, point: Point) {
  const octant = Math.round(Math.atan2(point.y - router.y, point.x - router.x) / (Math.PI / 4));
  const angle = (octant * Math.PI) / 4;
  const col = Math.round(Math.cos(angle));
  const row = Math.round(Math.sin(angle));
  return (row + 1) * 3 + (col + 1);
}

function endPoint(id: RouterId): Point {
  return { x: END_X[id], y: ROUTER_Y };
}

// Points along a rounded corner, from `startAngle` to `endAngle` around `center`.
function cornerPoints(center: Point, startAngle: number, endAngle: number): Point[] {
  return Array.from({ length: DIRECT_LINK_CORNER_SAMPLES + 1 }, (_, i) => {
    const angle = startAngle + ((endAngle - startAngle) * i) / DIRECT_LINK_CORNER_SAMPLES;
    return {
      x: center.x + DIRECT_LINK_RADIUS * Math.cos(angle),
      y: center.y + DIRECT_LINK_RADIUS * Math.sin(angle),
    };
  });
}

// Points along the direct link, from R1 to R3.
function directLinkPoints(): Point[] {
  const r1 = endPoint("r1");
  const r3 = endPoint("r3");
  const cornerY = DIRECT_LINK_TOP + DIRECT_LINK_RADIUS;
  return [
    r1,
    ...cornerPoints({ x: r1.x + DIRECT_LINK_RADIUS, y: cornerY }, Math.PI, 1.5 * Math.PI),
    ...cornerPoints({ x: r3.x - DIRECT_LINK_RADIUS, y: cornerY }, 1.5 * Math.PI, 2 * Math.PI),
    r3,
  ];
}

function directLinkPath() {
  const r1 = endPoint("r1");
  const r3 = endPoint("r3");
  const r = DIRECT_LINK_RADIUS;
  const top = DIRECT_LINK_TOP;
  return [
    `M ${r1.x} ${r1.y}`,
    `V ${top + r}`,
    `A ${r} ${r} 0 0 1 ${r1.x + r} ${top}`,
    `H ${r3.x - r}`,
    `A ${r} ${r} 0 0 1 ${r3.x} ${top + r}`,
    `V ${r3.y}`,
  ].join(" ");
}

// Points an announcement passes through between two neighboring routers. R1 and
// R3 are only neighbors in the last section, through the direct link.
function announcementPath(from: RouterId, to: RouterId): Point[] {
  if (from === "r1" && to === "r3") return directLinkPoints();
  if (from === "r3" && to === "r1") return directLinkPoints().reverse();
  return [endPoint(from), endPoint(to)];
}

function pathLength(points: Point[]) {
  return points.slice(1).reduce((length, point, i) => {
    const prev = points[i];
    return length + Math.hypot(point.x - prev.x, point.y - prev.y);
  }, 0);
}

// Seconds an announcement takes to travel between two routers.
function travelTime(from: RouterId, to: RouterId) {
  return pathLength(announcementPath(from, to)) * ANNOUNCEMENT_SECONDS_PER_UNIT;
}

// How many pixels one viewBox unit takes up, kept current as the SVG resizes.
function usePixelsPerUnit(svgRef: { current: Element | null }) {
  const [pixelsPerUnit, setPixelsPerUnit] = useState(1);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const update = () => setPixelsPerUnit(svg.getBoundingClientRect().width / VIEW_SIZE || 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [svgRef]);

  return pixelsPerUnit;
}

export function PathFinding() {
  const { activeSection, setAvailableEvents } = useScroller();
  const sceneIndex = Math.min(activeSection, SECTION_EVENTS.length - 1);
  const [scope, animate] = useAnimate();
  const pixelsPerUnit = usePixelsPerUnit(scope);
  const routeAnimation = useRef<{ stop: () => void } | null>(null);

  // The second section's step, and routes learned from announcements that have
  // arrived during the current step (or the last two sections' announcements).
  const [step, setStep] = useState(0);
  const [learned, setLearned] = useState(NO_ROUTES);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const nextId = useRef(0);

  // How far router 3's startup has got in the second section, the stage it moved
  // on from, and whether to snap there rather than animate. Each startup run
  // remounts the ticks so they play again.
  const [startup, setStartup] = useState<{
    stage: StartupStage;
    from: StartupStage;
    instant: boolean;
  }>({ stage: 0, from: 0, instant: false });
  const [startupRuns, setStartupRuns] = useState(0);

  const timers = useRef<number[]>([]);
  // Pending turn-offs for the outer rings and the centers, and when the latest
  // animation ends.
  const offTimers = useRef(new Map<string, number>());
  const animationEndsAt = useRef(0);

  const schedule = (seconds: number, action: () => void) => {
    timers.current.push(window.setTimeout(action, seconds * 1000));
  };

  // Stops everything in flight and turns every light off.
  const reset = () => {
    routeAnimation.current?.stop();
    routeAnimation.current = null;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    offTimers.current.forEach(clearTimeout);
    offTimers.current.clear();
    animationEndsAt.current = 0;
    clearRoute(animate);
    animate("[data-router-dot]", { scale: 1 }, { duration: 0 });
    setAnnouncements([]);
    setLearned(NO_ROUTES);
  };

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      offTimers.current.forEach(clearTimeout);
    },
    [],
  );

  useEffect(() => {
    setAvailableEvents({ index: activeSection, types: SECTION_EVENTS[sceneIndex] ?? [] });
    return () => setAvailableEvents(null);
  }, [activeSection, sceneIndex, setAvailableEvents]);

  // Each section starts from a clean slate, the second one from its first step,
  // and the last one where the previous section's announcement ends.
  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset when the section changes
  useLayoutEffect(() => {
    reset();
    if (sceneIndex === 3) setLearned(AFTER_DIRECT_ANNOUNCEMENT);
    setStep(0);
    setStartup({ stage: 0, from: 0, instant: false });
  }, [sceneIndex]);

  const dot = (router: RouterId, index: number) =>
    `[data-router="${router}"] [data-router-dot="${index}"]`;

  // Turns off the squares matching `selector` after `seconds`, replacing any
  // earlier turn-off scheduled under the same key.
  const turnOffLater = (key: string, selector: string, seconds: number) => {
    clearTimeout(offTimers.current.get(key));
    offTimers.current.set(
      key,
      window.setTimeout(() => {
        offTimers.current.delete(key);
        animate(selector, { opacity: 0 }, { duration: 0 });
      }, seconds * 1000),
    );
  };

  // Lights stay on while announcements play out. Shortly after the last
  // animation ends, every router's outer ring turns off at once, then every
  // center. `busyFor` is how long the lit square keeps animating.
  const lightDot = (router: RouterId, index: number, busyFor = 0) => {
    animate(dot(router, index), { opacity: 1 }, { duration: 0 });

    const ends = performance.now() + busyFor * 1000;
    if (ends < animationEndsAt.current) return;
    animationEndsAt.current = ends;
    turnOffLater(
      "rings",
      `[data-router-dot]:not([data-router-dot="${ROUTER_CENTER_DOT}"])`,
      busyFor + LIGHTS_OFF_DELAY,
    );
    turnOffLater(
      "centers",
      `[data-router-dot="${ROUTER_CENTER_DOT}"]`,
      busyFor + LIGHTS_OFF_DELAY + CENTER_LINGER,
    );
  };

  // The center square lights up and briefly swells as the router handles an
  // announcement. `busyFor` covers anything the router does right after.
  const pulseCenter = (router: RouterId, busyFor = PULSE_DURATION) => {
    lightDot(router, ROUTER_CENTER_DOT, busyFor);
    animate(
      dot(router, ROUTER_CENTER_DOT),
      { scale: [1, PULSE_SCALE, 1] },
      { duration: PULSE_DURATION, ease: "easeInOut" },
    );
  };

  // Light the squares facing each outgoing link and send the announcement down
  // them; the figure stays busy until they arrive.
  const send = (prefix: string, from: RouterId, to: RouterId[], forward: Forward = {}) => {
    for (const target of to) {
      const path = announcementPath(from, target);
      lightDot(from, routerDotForDirection(path[0], path[1]), travelTime(from, target));
    }
    setAnnouncements((current) => [
      ...current,
      ...to.map((target) => ({ id: nextId.current++, prefix, from, to: target, forward })),
    ]);
  };

  // The square facing the link it came in on lights up, then the router records
  // the route as its center pulses, and passes it on if it should.
  const arrive = (announcement: Announcement) => {
    const { prefix, from, to } = announcement;
    const forward = announcement.forward[to] ?? [];
    setAnnouncements((current) => current.filter(({ id }) => id !== announcement.id));
    const path = announcementPath(from, to);
    lightDot(to, routerDotForDirection(path[path.length - 1], path[path.length - 2]), ROUTER_STEP);
    schedule(ROUTER_STEP, () => {
      pulseCenter(to, forward.length > 0 ? PULSE_DURATION + ROUTER_STEP : PULSE_DURATION);
      setLearned((current) => ({ ...current, [to]: [...current[to], { prefix, via: from }] }));
    });
    if (forward.length > 0) {
      schedule(ROUTER_STEP + PULSE_DURATION + ROUTER_STEP, () => send(prefix, to, forward));
    }
  };

  // A router decides to speak up, then sends each announcement in turn.
  const pulseThenSend = (
    from: RouterId,
    to: RouterId[],
    prefixes: string[],
    forward: Forward = {},
  ) => {
    pulseCenter(from, PULSE_DURATION + prefixes.length * ROUTER_STEP);
    prefixes.forEach((prefix, i) => {
      schedule(PULSE_DURATION + (i + 1) * ROUTER_STEP, () => send(prefix, from, to, forward));
    });
  };

  // Router 3 starts up from the two-router layout: it links up to router 2,
  // then expands into a full router. The first stage waits a moment so the
  // snap back to the two-router layout renders first.
  const startUpRouter3 = () => {
    setStartup({ stage: 0, from: 0, instant: true });
    setStartupRuns((runs) => runs + 1);
    schedule(0.02, () => setStartup({ stage: 1, from: 0, instant: false }));
    schedule(0.02 + EXPAND_AT, () => setStartup({ stage: 2, from: 1, instant: false }));
  };

  // What happens as each step of the second section plays out. Receiving routers
  // update their tables as each announcement arrives.
  const STEP_ACTIONS: Partial<Record<number, () => void>> = {
    1: startUpRouter3,
    2: () => pulseThenSend("r3", ["r2"], ["3.x"]),
    3: () => pulseThenSend("r2", ["r3"], ["2.x", "1.x"]),
    4: () => pulseThenSend("r2", ["r1"], ["3.x"]),
  };

  const goToStep = (next: number) => {
    reset();
    setStartup({ stage: next === 0 ? 0 : 2, from: 0, instant: true });
    setStep(next);
    STEP_ACTIONS[next]?.();
  };

  const sendPacket = () => {
    reset();
    const path: RoutePoint[] = [
      { ...computers[0].position, id: computers[0].id },
      ...ROUTER_IDS.map((id) => ({ x: CHAIN_X[id], y: ROUTER_Y, routerId: id })),
      { ...computers[4].position, id: computers[4].id },
    ];
    routeAnimation.current = animate(routeSequence(path), {
      onComplete: () => {
        routeAnimation.current = null;
      },
    });
  };

  useScrollerEvent((event, index) => {
    if (index !== activeSection) return;

    if (event.type === "send-packet" && sceneIndex === 0) {
      sendPacket();
    } else if (event.type === "announce" && sceneIndex === 1 && typeof event.step === "number") {
      goToStep(event.step);
    } else if (event.type === "announce" && sceneIndex === 2) {
      // R3 tells both its neighbors it can receive 3.x.
      reset();
      pulseThenSend("r3", ["r2", "r1"], ["3.x"]);
    } else if (event.type === "forward" && sceneIndex === 3) {
      // Not knowing R1 already heard from R3, R2 passes 3.x on to R1 too,
      // starting from where R3's announcement left the tables.
      reset();
      setLearned(AFTER_DIRECT_ANNOUNCEMENT);
      pulseThenSend("r2", ["r1"], ["3.x"]);
    }
  });

  // Router 3 is only starting up in the second section; elsewhere it's fully up.
  const stage: StartupStage = sceneIndex === 1 ? startup.stage : 2;
  const linked = stage >= 1;
  const expanded = stage >= 2;
  const snap = sceneIndex === 1 && startup.instant;
  const linkingUp = sceneIndex === 1 && startup.stage === 1 && startup.from === 0 && !snap;
  const expanding = sceneIndex === 1 && startup.stage === 2 && startup.from === 1 && !snap;
  const showTicks = sceneIndex === 1 && !snap && startup.stage >= 1 && startupRuns > 0;

  const move: Transition = snap ? INSTANT : SWIFT_TRANSITION;
  const fade: Transition = snap ? INSTANT : FADE_TRANSITION;
  const details: Transition = expanding ? EXPAND.details : fade;
  // Anything that disappears, whether scrolling between sections or stepping
  // back, goes away at once; only things appearing or moving animate.
  const unlessHiding = (visible: boolean, transition: Transition): Transition =>
    visible ? transition : INSTANT;
  const computersShown = sceneIndex === 0;
  const directLinkShown = sceneIndex >= 2;

  const routerX = (id: RouterId) =>
    sceneIndex === 0 ? CHAIN_X[id] : sceneIndex === 1 && !linked ? START_X[id] : END_X[id];
  const middleX = (routerX("r2") + routerX("r3")) / 2;

  const tables =
    sceneIndex === 1 ? tablesAfter(step - 1) : sceneIndex >= 2 ? INITIAL_TABLES : NO_ROUTES;
  const shownTables = Object.fromEntries(
    ROUTER_IDS.map((id) => [id, [...tables[id], ...learned[id]]]),
  ) as Record<RouterId, Route[]>;
  const showTables = sceneIndex > 0;

  const smallScale = SQUARE_SIZE / pixelsPerUnit / ROUTER_SIZE;
  const router3Scale = expanded ? 1 : linked ? smallScale : 0;
  const tickX = (END_X.r2 + END_X.r3) / 2;

  // On small screens each section shows its own copy of the figure, which
  // doesn't need to be square: trim it to the part of the viewBox its content
  // spans. Margins in % are relative to the (square) figure's width.
  const [cropTop, cropBottom] = SMALL_SCREEN_CROP[sceneIndex];
  const cropStyle = {
    "--crop-top": `${(-cropTop / VIEW_SIZE) * 100}%`,
    "--crop-bottom": `${(-(VIEW_SIZE - cropBottom) / VIEW_SIZE) * 100}%`,
  } as CSSProperties;

  return (
    <div
      // The figure isn't interactive, and on small screens its trimmed-off edges
      // overlap the text and buttons around it, so let taps through.
      className="pointer-events-none relative w-full max-lg:mt-(--crop-top) max-lg:mb-(--crop-bottom)"
      style={cropStyle}
    >
      <svg
        ref={scope}
        aria-label="Three networks connected in a chain of routers"
        className="block w-full h-auto aspect-square overflow-visible"
        fill="none"
        role="img"
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      >
        <g stroke="currentColor" className="text-gray-7">
          {computers.map((c) => (
            <motion.line
              key={`link-${c.id}`}
              x1={c.position.x}
              y1={c.position.y}
              initial={false}
              animate={{ x2: routerX(c.router), opacity: computersShown ? 1 : 0 }}
              transition={{
                ...SWIFT_TRANSITION,
                opacity: unlessHiding(computersShown, FADE_TRANSITION),
              }}
              y2={ROUTER_Y}
              vectorEffect="non-scaling-stroke"
              strokeWidth={LINK_WIDTH}
            />
          ))}
          <motion.line
            initial={false}
            animate={{ x1: routerX("r1"), x2: routerX("r2") }}
            transition={move}
            y1={ROUTER_Y}
            y2={ROUTER_Y}
            vectorEffect="non-scaling-stroke"
            strokeWidth={LINK_WIDTH}
          />
          {/* The R2 — R3 link, in two halves that grow from each end toward the middle. */}
          {(["r2", "r3"] as const).map((id) => {
            const toward = Math.sign(middleX - routerX(id));
            // Before router 3 is linked up, each half waits with no length at
            // its router's final position, so it grows out from there toward
            // the middle rather than from wherever router 2 started.
            const anchor = linked ? routerX(id) : END_X[id];
            return (
              <motion.line
                key={`link-half-${id}`}
                initial={false}
                animate={{
                  x1: anchor,
                  x2: linked ? middleX + toward * LINK_OVERLAP : anchor,
                }}
                transition={unlessHiding(linked, linkingUp ? LINK_UP.link : move)}
                y1={ROUTER_Y}
                y2={ROUTER_Y}
                vectorEffect="non-scaling-stroke"
                strokeWidth={LINK_WIDTH}
              />
            );
          })}
          <motion.path
            d={directLinkPath()}
            initial={false}
            animate={{
              pathLength: directLinkShown ? 1 : 0,
              opacity: directLinkShown ? 1 : 0,
            }}
            transition={unlessHiding(directLinkShown, { duration: 0.5, ease: "easeInOut" })}
            // Drawing along the path needs a stroke in viewBox units rather than
            // a non-scaling one, so convert the link width.
            strokeWidth={LINK_WIDTH / pixelsPerUnit}
          />
          {ROUTER_IDS.map((id) => {
            const shown = showTables && (id !== "r3" || expanded);
            return (
              <motion.line
                key={`table-link-${id}`}
                initial={false}
                animate={{ x1: routerX(id), x2: routerX(id), opacity: shown ? 1 : 0 }}
                transition={{
                  ...move,
                  opacity: unlessHiding(shown, id === "r3" ? details : fade),
                }}
                y1={ROUTER_Y + ROUTER_SIZE / 2}
                y2={TABLE_TOP}
                stroke="black"
                strokeDasharray="4 3"
                vectorEffect="non-scaling-stroke"
                strokeWidth="1"
              />
            );
          })}
        </g>

        {/* Lines that fill in the route as data is sent in the first section. */}
        <LinkFills
          count={computers.length - 1}
          head={
            <ComputerShape
              shape={computers[4].shape}
              fill={computers[4].fill}
              stroke={computers[4].stroke}
            />
          }
        />

        {/* Ticks marking where the two halves of the R2 — R3 link meet. */}
        {[-1, 1].map((side) => {
          const inner = ROUTER_Y + side * TICK_GAP;
          const outer = ROUTER_Y + side * (TICK_GAP + TICK_LENGTH);
          return (
            <motion.line
              key={`tick-${side}-${startupRuns}`}
              x1={tickX}
              x2={tickX}
              y2={outer}
              initial={{ opacity: 0, y1: inner }}
              animate={
                showTicks
                  ? {
                      opacity: [0, 0, 1, 1],
                      // Once shown, the inner end chases the outer end until the tick is gone.
                      y1: [inner, inner, inner, outer],
                    }
                  : { opacity: 0, y1: inner }
              }
              transition={showTicks ? TICK_TRANSITION : INSTANT}
              stroke="var(--gray-12)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {announcements.map((announcement) => (
          <AnnouncementBadge
            key={announcement.id}
            announcement={announcement}
            onArrive={() => arrive(announcement)}
          />
        ))}

        {computers.map(
          (c) =>
            c.label && (
              <motion.g
                key={`label-${c.id}`}
                initial={false}
                animate={{ opacity: computersShown ? 1 : 0 }}
                transition={unlessHiding(computersShown, FADE_TRANSITION)}
              >
                <VertexLabel
                  text={c.label.text}
                  x={c.label.position.x}
                  y={c.label.position.y}
                  targetX={c.position.x}
                  targetY={c.position.y}
                />
              </motion.g>
            ),
        )}

        {computers.map((c) => (
          <motion.g
            key={c.id}
            initial={false}
            animate={{ x: c.position.x, y: c.position.y, opacity: computersShown ? 1 : 0 }}
            transition={unlessHiding(computersShown, FADE_TRANSITION)}
          >
            <g className={NODE_SCALE}>
              <RoutePointShape id={c.id}>
                <ComputerShape shape={c.shape} fill={c.fill} stroke={c.stroke} />
              </RoutePointShape>
            </g>
          </motion.g>
        ))}

        {(["r1", "r2"] as const).map((id) => (
          <motion.g
            key={id}
            data-router={id}
            initial={false}
            animate={{ x: routerX(id), y: ROUTER_Y }}
            transition={move}
          >
            <g className={NODE_SCALE}>
              <BadgeCard badge={ROUTER_BADGES[id]} />
              <RouterFrame />
              <RouterDots badge={ROUTER_BADGES[id]} />
            </g>
          </motion.g>
        ))}

        {/* Router 3, which starts up as a small square in the second section. */}
        <motion.g
          data-router="r3"
          initial={false}
          animate={{ x: routerX("r3"), y: ROUTER_Y }}
          transition={move}
        >
          <g className={NODE_SCALE}>
            {/* Its numbered card rises from behind it once it's full size. */}
            <motion.g
              initial={false}
              animate={expanded ? { opacity: 1, y: 0 } : { opacity: 0, y: LABEL_RISE }}
              transition={unlessHiding(expanded, details)}
            >
              <BadgeCard badge={ROUTER_BADGES.r3} />
            </motion.g>
            <motion.g
              initial={false}
              animate={{ scale: router3Scale }}
              transition={unlessHiding(linked, linkingUp ? LINK_UP.square : move)}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <RouterFrame />
            </motion.g>
            <motion.g
              initial={false}
              animate={{ opacity: expanded ? 1 : 0 }}
              transition={unlessHiding(expanded, expanding ? EXPAND.dots : fade)}
            >
              <RouterDots badge={ROUTER_BADGES.r3} />
            </motion.g>
          </g>
        </motion.g>
      </svg>

      <div className="pointer-events-none absolute inset-0">
        {ROUTER_IDS.map((id) => {
          const visible = showTables && (id !== "r3" || expanded);
          return (
            <motion.div
              key={id}
              className="absolute inset-0"
              initial={false}
              animate={
                visible ? { opacity: 1, y: 0 } : { opacity: 0, y: id === "r3" ? -TABLE_DROP_PX : 0 }
              }
              transition={unlessHiding(visible, id === "r3" ? details : fade)}
            >
              <RoutingTable x={routerX(id)} routes={shownTables[id]} transition={move} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function AnnouncementBadge({
  announcement,
  onArrive,
}: {
  announcement: Announcement;
  onArrive: () => void;
}) {
  const color = ROUTER_BADGES[PREFIX_ROUTER[announcement.prefix] ?? "r3"].fill;
  const onArriveRef = useRef(onArrive);
  onArriveRef.current = onArrive;

  // Place the badge by distance travelled rather than by point, so it keeps a
  // steady speed through the direct link's tightly sampled corners.
  const path = announcementPath(announcement.from, announcement.to);
  const length = pathLength(path);
  const stops = path.map((_, i) => pathLength(path.slice(0, i + 1)) / length);
  const progress = useMotionValue(0);
  const x = useTransform(
    progress,
    stops,
    path.map((point) => point.x),
  );
  const y = useTransform(
    progress,
    stops,
    path.map((point) => point.y),
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: each badge travels once
  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: length * ANNOUNCEMENT_SECONDS_PER_UNIT,
      // The winding direct link eases in and out; straight hops stay linear.
      ease: path.length > 2 ? "easeInOut" : "linear",
      onComplete: () => onArriveRef.current(),
    });
    return () => controls.stop();
  }, []);

  return (
    <motion.g style={{ x, y }}>
      <g className={NODE_SCALE}>
        <rect
          x={-PACKET_WIDTH / 2}
          y={-PACKET_HEIGHT / 2}
          width={PACKET_WIDTH}
          height={PACKET_HEIGHT}
          style={{ fill: color }}
          // The outline separates the badge from the links it travels over, so
          // it matches the figure's background: white, or grey on small screens.
          className="stroke-white max-lg:stroke-gray-3"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <text
          style={{ fill: "white" }}
          className="font-sans"
          fontSize="0.26"
          fontWeight="700"
          textAnchor="middle"
          dy="0.35em"
        >
          {announcement.prefix}
        </text>
      </g>
    </motion.g>
  );
}

function RoutingTable({
  x,
  routes,
  transition,
}: {
  x: number;
  routes: Route[];
  transition: Transition;
}) {
  const cqwPerUnit = 100 / VIEW_SIZE;
  // Two routes for the same prefix leave the router with a choice to make.
  const isConflicting = (prefix: string) =>
    routes.filter((route) => route.prefix === prefix).length > 1;

  return (
    <motion.div
      // Drawn as large as the routers. Centered with `translate` rather than
      // `transform`: browsers apply `transform` after `scale`, which would scale
      // the offset too.
      className="absolute w-max origin-top -translate-x-1/2 overflow-hidden whitespace-nowrap border border-black bg-white font-sans text-gray-12 scale-150"
      initial={false}
      animate={{ left: `${(x / VIEW_SIZE) * 100}%` }}
      transition={transition}
      style={{
        top: `calc(${(TABLE_TOP / VIEW_SIZE) * 100}% - 1px)`,
        borderStyle: routes.length === 0 ? "dashed" : "solid",
        fontSize: `${0.4 * cqwPerUnit}cqw`,
      }}
    >
      {routes.length === 0 && (
        <div
          className="flex items-center bg-gray-2 text-gray-10 italic"
          style={{
            height: `${TABLE_ROW_HEIGHT * cqwPerUnit}cqw`,
            paddingInline: `calc(${TABLE_PADDING * cqwPerUnit}cqw + 1px)`,
            fontSize: `${0.3 * cqwPerUnit}cqw`,
          }}
        >
          No routes yet
        </div>
      )}
      {routes.map((route, index) => (
        <motion.div
          key={`${route.prefix}-${route.via}`}
          className="relative flex items-center overflow-hidden"
          style={{
            paddingInline: `calc(${TABLE_PADDING * cqwPerUnit}cqw + 1px)`,
            lineHeight: 1,
            gap: `${0.2 * cqwPerUnit}cqw`,
            background: isConflicting(route.prefix) ? "var(--yellow-4)" : "transparent",
            borderTop: index > 0 ? "1px dashed black" : undefined,
          }}
          initial={{
            opacity: 0,
            height: index === 0 ? `${TABLE_ROW_HEIGHT * cqwPerUnit}cqw` : 0,
            paddingBlock: index === 0 ? `${TABLE_PADDING * cqwPerUnit}cqw` : 0,
          }}
          animate={{
            opacity: 1,
            height: `${TABLE_ROW_HEIGHT * cqwPerUnit}cqw`,
            paddingBlock: `${TABLE_PADDING * cqwPerUnit}cqw`,
          }}
          transition={SWIFT_TRANSITION}
        >
          <span
            className="inline-block font-mono"
            style={{ fontSize: `${0.3 * cqwPerUnit}cqw`, transform: "translateX(2px)" }}
          >
            {route.prefix}
          </span>
          <span>→</span>
          <span
            className="flex items-center justify-center font-bold"
            style={{
              width: `${0.5 * cqwPerUnit}cqw`,
              height: `${0.5 * cqwPerUnit}cqw`,
              background: ROUTER_BADGES[route.via].fill,
              color: ROUTER_BADGES[route.via].text,
              fontSize: `${0.3 * cqwPerUnit}cqw`,
            }}
          >
            {ROUTER_BADGES[route.via].label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Numbered card tucked behind a router, peeking out above it. Labels in these
// figures center their digits with dy rather than dominant-baseline, which iOS
// WebKit places too high.
function BadgeCard({ badge }: { badge: RouterBadge }) {
  return (
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
  );
}

function RouterFrame() {
  return (
    <rect
      width={ROUTER_SIZE}
      height={ROUTER_SIZE}
      x={-ROUTER_SIZE / 2}
      y={-ROUTER_SIZE / 2}
      style={{ fill: "white", stroke: "var(--gray-12)" }}
      className={SHAPE_STROKE}
      vectorEffect="non-scaling-stroke"
    />
  );
}

// The router's 3x3 grid, each dot with an overlay in the router's color that
// lights up as data passes through.
function RouterDots({ badge }: { badge: RouterBadge }) {
  return (
    <>
      {ROUTER_DOT_POSITIONS.map(({ x, y }, index) => (
        <g key={index}>
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

function ComputerShape({ shape, fill, stroke }: { shape: Shape; fill: string; stroke: string }) {
  const common = {
    style: { fill, stroke },
    className: SHAPE_STROKE,
    vectorEffect: "non-scaling-stroke" as const,
  };
  const h = Math.sqrt(3) / 2;
  switch (shape) {
    case "circle":
      return <circle r="0.4" {...common} />;
    case "square":
      return <rect x="-0.4" y="-0.4" width="0.8" height="0.8" {...common} />;
    case "triangle":
      return (
        <polygon
          points={`0,${(-2 * h) / 3} 0.5,${h / 3} -0.5,${h / 3}`}
          strokeLinejoin="miter"
          {...common}
        />
      );
  }
}

function VertexLabel({
  text,
  x,
  y,
  targetX,
  targetY,
}: {
  text: string;
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
          <LabelTag text={text} />
        </g>
      </g>
    </g>
  );
}
