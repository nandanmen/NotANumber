import {
  Children,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import cn from "clsx";

type Section = {
  index: number;
  // Listeners for each of the section's own copies of the figure, shown beside
  // its controls on small screens.
  inlineListeners: (slot: number) => Set<ScrollerEventListener>;
};

export type ScrollerEvent = {
  type: string;
  [parameter: string]: unknown;
};

type ScrollerEventListener = (event: ScrollerEvent, index: number) => void;

type AvailableEvents = { index: number; types: string[] } | null;

type FigureState = {
  activeSection: number;
  // Which of its section's small-screen copies this figure is, in order. A
  // section with several controls shows a copy next to each, and later copies
  // can start from where the earlier ones leave off. The sticky figure is 0.
  slot: number;
  listeners: Set<ScrollerEventListener>;
  availableEvents: AvailableEvents;
  setAvailableEvents: Dispatch<SetStateAction<AvailableEvents>>;
};

const ScrollerContext = createContext<FigureState | null>(null);
const SectionProvider = createContext<Section | null>(null);
// The small-screen figure copy that the controls inside drive.
const FigureSlotContext = createContext(0);

type ScrollerProps = {
  children: ReactNode;
  figure: ReactNode;
};

// Matches Tailwind's `lg` breakpoint, where the figure sits beside the text.
const WIDE_QUERY = "(min-width: 64rem)";

function subscribeToWide(onChange: () => void) {
  const query = window.matchMedia(WIDE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Whether the Scroller shows one sticky figure beside the text, rather than a figure per section. */
function useIsWide() {
  return useSyncExternalStore(
    subscribeToWide,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false,
  );
}

function isSectionDivider(child: ReactNode) {
  if (!isValidElement(child)) return false;

  if (child.type === "hr") return true;

  if (typeof child.type !== "function") return false;

  const component = child.type as { displayName?: string; name?: string };
  return component.displayName === "hr" || component.name === "hr";
}

function splitSections(children: ReactNode) {
  return Children.toArray(children).reduce<ReactNode[][]>(
    (sections, child) => {
      if (isSectionDivider(child)) {
        sections.push([]);
      } else {
        sections.at(-1)?.push(child);
      }

      return sections;
    },
    [[]],
  );
}

/** Returns the state of a surrounding Scroller. */
export function useScroller() {
  const scroller = useContext(ScrollerContext);

  if (scroller === null) {
    throw new Error("useScroller must be used inside a Scroller figure.");
  }

  return scroller;
}

export function useSection() {
  const section = useContext(SectionProvider);

  if (section === null) {
    throw new Error("useSection must be used inside a SectionProvider.");
  }

  return section;
}

const ACTIVE_THRESHOLD = 0.55;

function PaperGutter() {
  return (
    <div aria-hidden="true" className="relative hidden lg:block">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--olive-2) 5px, rgb(0 0 0 / 0.15) 5.5px, transparent 6px)",
          backgroundSize: "100% var(--scroller-gutter-size)",
          backgroundRepeat: "repeat-y",
        }}
      />
    </div>
  );
}

export function useScrollerDispatch() {
  const { index, inlineListeners } = useSection();
  const slot = useContext(FigureSlotContext);
  const scroller = useScroller();
  const listeners = useIsWide() ? scroller.listeners : inlineListeners(slot);
  return useCallback(
    (event: ScrollerEvent) => {
      for (const listener of listeners) listener(event, index);
    },
    [index, listeners],
  );
}

export function useScrollerCanSend(event: ScrollerEvent) {
  const { index } = useSection();
  const scroller = useScroller();
  // On small screens every section has its own figure, so its controls always work.
  if (!useIsWide()) return true;
  const { activeSection, availableEvents } = scroller;
  return (
    index === activeSection &&
    availableEvents?.index === index &&
    availableEvents.types.includes(event.type)
  );
}

export function useScrollerEvent(listener: ScrollerEventListener) {
  const { listeners } = useScroller();
  useEffect(() => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [listeners, listener]);
}

/**
 * Presents MDX sections beside a sticky figure. Horizontal rules in children
 * delimit sections, so MDX's `---` syntax can be used as the separator.
 */
export function Scroller({ children, figure }: ScrollerProps) {
  const sections = useMemo(() => splitSections(children), [children]);
  const sectionElements = useRef<Array<HTMLElement | null>>([]);

  const [activeSection, setActiveSection] = useState(0);
  const [availableEvents, setAvailableEvents] = useState<AvailableEvents>(null);
  const listenersRef = useRef(new Set<ScrollerEventListener>());

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let frame: number | undefined;

    const updateActiveSection = () => {
      frame = undefined;
      const activationLine = window.innerHeight * (1 - ACTIVE_THRESHOLD);
      let nextActiveSection = 0;

      for (const [index, section] of sectionElements.current.entries()) {
        if (section && section.getBoundingClientRect().top <= activationLine) {
          nextActiveSection = index;
        }
      }

      setActiveSection(nextActiveSection);
    };

    const requestUpdate = () => {
      if (frame === undefined) frame = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [sections.length]);

  return (
    <ScrollerContext
      value={{
        activeSection,
        slot: 0,
        listeners: listenersRef.current,
        availableEvents,
        setAvailableEvents,
      }}
    >
      <div
        className={cn(
          "[--scroller-gutter-size:32px] [--scroller-padding:calc(var(--spacing)*8)] [--scroller-figure-padding:calc(var(--scroller-padding)*2)]",
          "grid grid-cols-1 lg:grid-cols-[var(--scroller-gutter-size)_minmax(0,1fr)_minmax(0,1fr)_var(--scroller-gutter-size)] lg:my-18 first:mt-0 last:mb-0 [&:has(+_[data-scroller])]:mb-0 [[data-scroller]+&]:-mt-2 lg:bg-olive-1 lg:divide-x lg:divide-black/10 lg:shadow w-full max-w-[calc(120ch+var(--scroller-padding)*4+var(--scroller-gutter-size)*2)] mx-auto",
        )}
        data-scroller
        data-full-width
      >
        <PaperGutter />
        <div className="grid grid-cols-[minmax(0,60ch)] justify-center gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,60ch)] lg:gap-y-16 lg:p-16">
          {sections.map((section, index) => (
            <ScrollerSection
              figure={figure}
              index={index}
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              sectionRef={(element) => {
                sectionElements.current[index] = element;
              }}
            >
              {section}
            </ScrollerSection>
          ))}
        </div>
        <figure
          className="hidden lg:block min-w-0 p-(--scroller-padding)"
          style={{ containerType: "inline-size" }}
        >
          <div className="[--grid-size:12.5cqw] xl:[--grid-size:6.25cqw] [height:round(down,100%,var(--grid-size))] [max-height:round(down,100vh,var(--grid-size))] sticky -top-px">
            <div className="sticky h-fit top-[calc(var(--grid-size)*3)]">{figure}</div>
          </div>
        </figure>
        <PaperGutter />
      </div>
    </ScrollerContext>
  );
}

/**
 * Where a section's small-screen figure goes relative to a control that drives
 * it. Components that drive the figure set this as a static `figurePlacement`.
 */
export type FigurePlacement = "before" | "after";

function figurePlacementOf(node: ReactNode): FigurePlacement | null {
  if (!isValidElement<{ children?: ReactNode }>(node)) return null;

  const type = node.type as { figurePlacement?: FigurePlacement };
  if (type.figurePlacement) return type.figurePlacement;

  // Controls can be wrapped, e.g. buttons grouped in a toolbar.
  for (const child of Children.toArray(node.props.children)) {
    const placement = figurePlacementOf(child);
    if (placement) return placement;
  }
  return null;
}

/**
 * Puts a copy of the section's small-screen figure next to each control that
 * drives it, so the result of pressing it shows up right there, or one at the
 * end of the section if nothing drives it. `renderFigure` draws the copy for a
 * given slot; controls are wrapped so they drive their own copy.
 */
function placeInlineFigures(children: ReactNode, renderFigure: (slot: number) => ReactNode) {
  const placed: ReactNode[] = [];
  let slot = 0;
  for (const node of Children.toArray(children)) {
    const placement = figurePlacementOf(node);
    if (!placement) {
      placed.push(node);
      continue;
    }
    const control = (
      <FigureSlotContext key={`control-${slot}`} value={slot}>
        {node}
      </FigureSlotContext>
    );
    const figure = renderFigure(slot);
    placed.push(...(placement === "before" ? [figure, control] : [control, figure]));
    slot++;
  }
  if (slot === 0) placed.push(renderFigure(0));
  return placed;
}

/** One of a section's small-screen figure copies, with its own state. */
function InlineFigure({
  figure,
  index,
  slot,
  listeners,
}: {
  figure: ReactNode;
  index: number;
  slot: number;
  listeners: Set<ScrollerEventListener>;
}) {
  const [availableEvents, setAvailableEvents] = useState<AvailableEvents>(null);
  const state = useMemo(
    () => ({ activeSection: index, slot, listeners, availableEvents, setAvailableEvents }),
    [index, slot, listeners, availableEvents],
  );

  return (
    <ScrollerContext value={state}>
      {/* Stretched to the screen's edges on a darker background. */}
      <div className="lg:hidden [container-type:inline-size] mx-[calc(50%-50vw)] bg-gray-3 py-8">
        {/* flow-root keeps a figure's negative margins (trimming empty space)
            from pulling this box up over the text around it. */}
        <div className="relative flow-root [--grid-size:12.5cqw]">{figure}</div>
      </div>
    </ScrollerContext>
  );
}

function ScrollerSection({
  children,
  figure,
  index,
  sectionRef,
}: {
  children: ReactNode;
  figure: ReactNode;
  index: number;
  sectionRef: (element: HTMLElement | null) => void;
}) {
  const listenersBySlot = useRef(new Map<number, Set<ScrollerEventListener>>()).current;
  const inlineListeners = useCallback(
    (slot: number) => {
      let listeners = listenersBySlot.get(slot);
      if (!listeners) {
        listeners = new Set();
        listenersBySlot.set(slot, listeners);
      }
      return listeners;
    },
    [listenersBySlot],
  );

  return (
    <SectionProvider value={{ index, inlineListeners }}>
      <section
        className="lg:min-h-[45vh] grid gap-y-6 auto-rows-min lg:col-start-2"
        ref={sectionRef}
      >
        {placeInlineFigures(children, (slot) => (
          <InlineFigure
            key={`inline-figure-${slot}`}
            figure={figure}
            index={index}
            slot={slot}
            listeners={inlineListeners(slot)}
          />
        ))}
      </section>
    </SectionProvider>
  );
}
