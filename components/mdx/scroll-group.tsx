"use client";

import clsx from "clsx";
import styles from "./scroll-group.module.css";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useRef,
  useEffect,
  useState,
  Children,
  cloneElement,
} from "react";
import produce from "immer";
import { ColumnRight, Columns } from "./columns";

type EventEmitter<
  Types extends string,
  Payloads extends { [K in Types]: unknown }
> = {
  on: <TEvent extends Types>(
    event: TEvent,
    cb: (args: Payloads[TEvent]) => void
  ) => () => void;
  notify: <TEvent extends Types>(
    event: TEvent,
    args?: Payloads[TEvent]
  ) => void;
};

const createEventEmitter = () => {
  const events: Record<string, ((args: unknown) => void)[]> = {};
  return {
    on(event: string, cb: (args: unknown) => void) {
      if (!events[event]) {
        events[event] = [];
      }
      events[event].push(cb);
      return () => {
        events[event] = events[event].filter((fn) => fn !== cb);
      };
    },
    notify(event: string, args: unknown) {
      if (!events[event]) return;
      for (const cb of events[event]) {
        cb(args);
      }
    },
  };
};

export function useScrollGroupEvents<
  Types extends string,
  Payloads extends { [K in Types]: unknown } = { [K in Types]: never }
>() {
  const ctx = useScrollGroupContext();
  if (!ctx) {
    throw new Error("useScrollGroupEvents must be used within a ScrollGroup");
  }
  return ctx.events as EventEmitter<Types, Payloads>;
}

const ScrollGroupContext = createContext<{
  activeIndex: number | null;
  lastIndex: number | null;
  setActiveIndex: (index: number) => void;
  events: {
    on: (event: string, cb: (args?: unknown) => void) => () => void;
    notify: (event: string, args?: unknown) => void;
  };
  state: unknown;
  setState: Dispatch<SetStateAction<unknown>>;
} | null>(null);

const useScrollGroupContext = () => {
  const context = useContext(ScrollGroupContext);
  return context;
};

export const useScrollGroup = () => {
  const ctx = useScrollGroupContext();
  if (!ctx) {
    throw new Error("useScrollGroup must be used within a ScrollGroup");
  }
  return ctx;
};

type ActiveIndexReturnType<Nullable extends boolean> = Nullable extends true
  ? number | null
  : number;

export function useActiveIndex<Nullable extends boolean = false>({
  nullable = false as Nullable,
}: { nullable?: Nullable } = {}): ActiveIndexReturnType<Nullable> {
  const ctx = useScrollGroupContext();
  if (!ctx) {
    throw new Error("useActiveIndex must be used within a ScrollGroup");
  }
  const realIndex = ctx.activeIndex;
  if (nullable) return realIndex as ActiveIndexReturnType<Nullable>;
  return realIndex ?? 0;
}

export function ScrollGroup({
  children,
  state,
  figure,
}: {
  state?: unknown;
  children: React.ReactNode;
  figure: React.ReactNode;
}) {
  const [events] = useState(createEventEmitter);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lastIndex, setLastIndex] = useState<number | null>(null);
  const [_state, setState] = useState(state);

  return (
    <Columns>
      <ScrollGroupContext.Provider
        value={{
          activeIndex,
          setActiveIndex: (index) => {
            setLastIndex(activeIndex);
            setActiveIndex(index);
          },
          events,
          state: _state,
          setState,
          lastIndex,
        }}
      >
        <div className="space-y-5">
          {Children.map(children, (child, i) => {
            return cloneElement(
              child as React.ReactElement<{ index: number }>,
              {
                index: i,
              }
            );
          })}
        </div>
        <ScrollFigure>{figure}</ScrollFigure>
      </ScrollGroupContext.Provider>
    </Columns>
  );
}

export function useScrollGroupState<T>(key?: string) {
  const ctx = useScrollGroupContext();
  if (!ctx) {
    throw new Error("useScrollGroupState must be used within a ScrollGroup");
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let state = ctx.state as any;
  if (key) {
    state = state[key];
  }
  return [
    state as T,
    /**
     * We allow consumers to mutably update the state, but we want to make sure
     * they can only update the slice of state selected through `key`.
     */
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    (cb: T | ((draft: T) => T | void)) => {
      if (typeof cb === "function") {
        ctx.setState((s: unknown) => {
          if (key) {
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            return produce(s, (draft: any) => {
              draft[key] = produce(draft[key], cb);
            });
          }
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          return produce(s, cb as any);
        });
      } else {
        ctx.setState((s: unknown) => {
          if (key) {
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            return produce(s, (draft: any) => {
              draft[key] = cb;
            });
          }
          return cb;
        });
      }
    },
  ] as const;
}

export const isVisible = (element: HTMLElement, threshold = 0.4) => {
  const { top } = element.getBoundingClientRect();
  return top < window.innerHeight * threshold;
};

const ScrollSectionContext = createContext<{ index: number } | null>(null);

export function useIsSectionActive() {
  const ctx = useScrollGroupContext();
  const sectionCtx = useContext(ScrollSectionContext);
  if (!ctx || !sectionCtx) {
    throw new Error("useIsSectionActive must be used within a ScrollGroup");
  }
  return ctx.activeIndex === sectionCtx.index;
}

export function useSectionIndex() {
  const sectionCtx = useContext(ScrollSectionContext);
  if (!sectionCtx) {
    throw new Error("useSectionIndex must be used within a ScrollGroupSection");
  }
  return sectionCtx.index;
}

export function ScrollGroupSection({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useScrollGroupContext();

  useEffect(() => {
    if (!ctx) return;
    if (typeof index !== "number") return;
    const handleScroll = () => {
      if (ref.current && isVisible(ref.current)) {
        ctx.setActiveIndex(index);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ctx, index]);

  return (
    <ScrollSectionContext.Provider value={{ index }}>
      <div
        className={clsx(
          styles.article,
          "[&>*:not(figure)]:max-w-[60ch] md:max-w-[60ch] md:min-h-[45vh]"
        )}
        ref={ref}
      >
        {children}
      </div>
    </ScrollSectionContext.Provider>
  );
}

export function ScrollFigure({ children }: { children: React.ReactNode }) {
  const figureRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    if (!figureRef.current) return;
    const updateTop = () => {
      setTop(
        window.innerHeight * 0.35 -
          figureRef.current.getBoundingClientRect().height / 2
      );
    };
    updateTop();
    window.addEventListener("resize", updateTop);
    return () => {
      window.removeEventListener("resize", updateTop);
    };
  }, []);

  return (
    <ColumnRight>
      <div className="h-full bg-gray5 py-10 shadow-inner">
        <div
          ref={figureRef}
          className="sticky px-10 overflow-hidden"
          style={{ top }}
        >
          {children}
        </div>
      </div>
    </ColumnRight>
  );
}
