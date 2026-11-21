import { type HTMLMotionProps, motion } from "framer-motion";
import React from "react";
import { Link } from "react-router";
import { ToggleButton, UndoButton } from "~/components/Visualizer";
import { cn } from "~/lib/cn";

const experiments = [
  "scrambled-text",
  "bezier-curves",
  "cards",
  "path-animation",
  "heavy-square",
  "family-input",
  "safari-scroll",
];

export function ExperimentsPage({ children, page }) {
  return (
    <div className="h-screen">
      <div className="flex h-full flex-col justify-center p-16">
        <nav className="fixed top-8 left-8 flex flex-col gap-4 text-gray11 [&_a]:no-underline">
          <div className="font-serif text-[1.5rem] [&_a]:text-gray11">
            <Link to="/" reloadDocument>
              NaN
            </Link>
          </div>
          <ul className="flex list-none flex-col gap-2 font-mono text-[0.875rem]">
            {experiments.map((experiment) => (
              <li key={experiment}>
                <Link
                  to={`/experiments/${experiment}`}
                  className={
                    page === experiment ? "text-gray12" : "text-gray11"
                  }
                >
                  {`${page === experiment ? ">" : ""} ${experiment}`}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </div>
    </div>
  );
}

// --

export const ExperimentWrapper = ({
  constrained = true,
  className,
  ...props
}: HTMLMotionProps<"div"> & { constrained?: boolean }) => (
  <motion.div
    layout
    className={cn(
      "mx-auto w-[1000px] bg-gray4",
      !constrained && "w-auto",
      className,
    )}
    {...props}
  />
);

// --

export type ControlsProps = {
  debug: boolean;
  onDebugChange: (debug: boolean) => void;
  onReset: () => void;
  children: React.ReactNode;
};

export const Controls = ({ debug, onDebugChange, onReset, children }) => {
  return (
    <motion.div
      layout
      style={{ borderRadius: "12px" }}
      className="mx-auto my-8 border border-gray8 bg-gray3 p-4 shadow-md"
    >
      <motion.div layout className="flex justify-between gap-8">
        <ToggleButton
          layout
          onClick={() => onDebugChange(!debug)}
          secondary
          className={cn(
            "font-bold font-mono text-gray10",
            debug && "rounded-b-none bg-gray5",
          )}
        >
          Debug
        </ToggleButton>
        <UndoButton layout onClick={onReset} />
      </motion.div>
      {debug && (
        <motion.div className="min-w-[300px] rounded-[4px] rounded-tl-none bg-gray5 p-4">
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

export const DebugField = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => (
  <div
    className={cn(
      "flex items-center justify-between font-mono font-bold text-gray11",
      className,
    )}
    {...props}
  />
);

export const DebugFieldButton = ({
  active,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & { active?: boolean }) => (
  <button
    type="button"
    className={cn(
      "rounded-[2px] p-1 hover:bg-gray8",
      active && "bg-gray8",
      className,
    )}
    {...props}
  />
);
