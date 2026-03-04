import {
  Children,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "~/lib/cn";

const STEP_INTERVAL_MS = 2000;

export function SequenceList({
  children,
  index,
  onIndexChange,
}: {
  children: ReactNode;
  index: number;
  onIndexChange: (index: number) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const ol = children as ReactElement<{ children: ReactNode }>;
  const items = Children.toArray(ol.props.children).filter(
    isValidElement,
  ) as ReactElement<{
    className?: string;
    children: ReactNode;
  }>[];

  const stopPlay = () => {
    if (intervalRef.current) {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePlay = () => {
    stopPlay();
    setIsPlaying(true);
    const count = items.length;
    let step = 0;
    onIndexChange(0);
    intervalRef.current = setInterval(() => {
      step += 1;
      if (step < count) {
        onIndexChange(step);
      } else {
        stopPlay();
      }
    }, STEP_INTERVAL_MS);
  };

  const handleItemMouseEnter = (i: number) => {
    stopPlay();
    onIndexChange(i);
  };

  return (
    <ol className="rounded-xl border border-borderSoft bg-gray3 relative">
      <div className="divide-y divide-borderSoft">
        {items.map((item, i) => {
          const isActive = i === index;
          return (
            <li
              className={cn(
                item.props.className,
                "p-4 pr-10",
                isActive && "bg-gray4",
              )}
              key={String(i)}
              onMouseEnter={() => handleItemMouseEnter(i)}
            >
              {item.props.children}
            </li>
          );
        })}
      </div>
      <div className="absolute inset-2 left-auto w-2 bg-gray4 ring-1 ring-black/10 rounded-lg" />
      <button
        className="size-8 bg-gray4 rounded-full ring-1 ring-black/10 shadow absolute top-0 right-3 -translate-y-1/2 translate-x-1/2 overflow-hidden text-gray10 group"
        type="button"
        onClick={handlePlay}
      >
        <span className="sr-only">Play</span>
        <span className="bg-gray1 h-full w-full rounded-full -translate-y-0.5 flex items-center justify-center group-hover:bg-gray2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            width="14"
            aria-hidden="true"
            className="translate-y-0.5"
          >
            {isPlaying ? (
              <path
                d="M15.2413 3H8.7587C7.95374 2.99999 7.28937 2.99998 6.74818 3.04419C6.18608 3.09012 5.66937 3.18868 5.18404 3.43598C4.43139 3.81947 3.81947 4.43139 3.43598 5.18404C3.18868 5.66937 3.09012 6.18608 3.04419 6.74818C2.99998 7.28937 2.99999 7.95372 3 8.75869V15.2413C2.99999 16.0463 2.99998 16.7106 3.04419 17.2518C3.09012 17.8139 3.18868 18.3306 3.43598 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.66937 20.8113 6.18608 20.9099 6.74818 20.9558C7.28937 21 7.95372 21 8.75868 21H15.2413C16.0463 21 16.7106 21 17.2518 20.9558C17.8139 20.9099 18.3306 20.8113 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.8113 18.3306 20.9099 17.8139 20.9558 17.2518C21 16.7106 21 16.0463 21 15.2413V8.75868C21 7.95372 21 7.28936 20.9558 6.74818C20.9099 6.18608 20.8113 5.66937 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43598C18.3306 3.18868 17.8139 3.09012 17.2518 3.04419C16.7106 2.99998 16.0463 2.99999 15.2413 3Z"
                fill="currentColor"
              />
            ) : (
              <path
                d="M11.1967 2.71828C8.53683 0.970354 5 2.8783 5 6.0611V17.9387C5 21.1215 8.53684 23.0294 11.1967 21.2815L20.234 15.3427C22.6384 13.7627 22.6384 10.2371 20.234 8.65706L11.1967 2.71828Z"
                fill="currentColor"
              />
            )}
          </svg>
        </span>
      </button>
    </ol>
  );
}
