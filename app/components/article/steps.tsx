import {
  Children,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import cn from "clsx";
import { Icon } from "./icon";
import { Toolbar } from "./toolbar";
import { useScrollerCanSend, useScrollerDispatch, type FigurePlacement } from "./scroller";

type StepsProps = {
  // Scroller event sent as `{ type: event, step }` whenever the current step changes.
  // Step 0 is the scene before any step; step n is the scene after the nth step.
  event: string;
  // How long each step lasts while playing, in milliseconds.
  duration?: number;
  // A single ordered list, one item per step.
  children: ReactNode;
};

type ElementWithChildren = ReactElement<{ children?: ReactNode }>;

function listItems(children: ReactNode): ReactNode[] {
  const list = Children.toArray(children).find(isValidElement) as ElementWithChildren | undefined;
  return Children.toArray(list?.props.children)
    .filter((item): item is ElementWithChildren => isValidElement(item))
    .map((item) => item.props.children);
}

/**
 * An ordered list that steps a Scroller figure through a sequence. Pressing play
 * walks through each step in turn; hovering or clicking a step jumps straight to it.
 */
export function Steps({ event, duration = 1500, children }: StepsProps) {
  const items = listItems(children);
  const dispatch = useScrollerDispatch();
  const enabled = useScrollerCanSend({ type: event });
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const goTo = (next: number) => {
    setStep(next);
    dispatch({ type: event, step: next });
  };

  // Leaving the section resets its figure, so start over too.
  useEffect(() => {
    if (enabled) return;
    setStep(0);
    setPlaying(false);
  }, [enabled]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: restart the timer only when the step changes
  useEffect(() => {
    if (!playing) return;
    const timeout = setTimeout(() => {
      if (step >= items.length) {
        setPlaying(false);
      } else {
        goTo(step + 1);
      }
    }, duration);
    return () => clearTimeout(timeout);
  }, [playing, step, items.length, duration]);

  const play = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    goTo(step === 0 || step >= items.length ? 1 : step + 1);
    setPlaying(true);
  };

  const reset = () => {
    setPlaying(false);
    goTo(0);
  };

  const select = (next: number) => {
    if (!enabled || next === step) return;
    setPlaying(false);
    goTo(next);
  };

  return (
    <div className="grid gap-y-3">
      <Toolbar>
        <Toolbar.Button className="gap-x-1.5" disabled={!enabled} onClick={play}>
          <Icon type={playing ? "pause" : "play"} size={16} />
          {playing ? "Pause" : "Play"}
        </Toolbar.Button>
        <Toolbar.Button
          disabled={!enabled || (step === 0 && !playing)}
          onClick={reset}
          shape="square"
        >
          <span className="sr-only">Reset</span>
          <Icon type="reset" />
        </Toolbar.Button>
      </Toolbar>
      <ol className="overflow-hidden rounded border border-black/10 bg-black/[0.03]">
        {items.map((item, index) => {
          const number = index + 1;
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              aria-current={number === step ? "step" : undefined}
              className={cn(
                "relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2 border-black/10 py-4 pl-4 pr-12 transition-colors not-first:border-t",
                enabled && "cursor-pointer",
                number === step && "bg-white",
              )}
              onClick={() => select(number)}
              onPointerEnter={(e) => e.pointerType === "mouse" && select(number)}
            >
              <span className="font-medium tabular-nums">{number}.</span>
              <div>{item}</div>
              <div
                aria-hidden="true"
                className={cn(
                  "absolute right-4 w-3 overflow-hidden border-x border-black/10 bg-gray-3",
                  isFirst ? "top-4 rounded-t border-t" : "-top-px",
                  isLast ? "bottom-4 rounded-b border-b" : "bottom-0",
                )}
              >
                <div
                  className="h-full origin-top bg-gray-11 ease-linear"
                  style={{
                    transform: `scaleY(${number <= step ? 1 : 0})`,
                    transitionProperty: "transform",
                    transitionDuration: playing && number === step ? `${duration}ms` : "150ms",
                  }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// On small screens, the figure sits right above the steps, so it stays in view
// while stepping through them.
Steps.figurePlacement = "before" satisfies FigurePlacement;
