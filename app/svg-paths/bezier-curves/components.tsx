import { motion } from "framer-motion";
import { CommandList } from "../components/command-list";
import { PathEditor } from "../components/path-editor";
import { useStateContext } from "../components/state-context";

export function RoundedCornerCommands() {
  const {
    data: { x1, y1, x, y },
  } = useStateContext<{ x1: number; y1: number; x: number; y: number }>(
    "curve"
  );
  return (
    <ol className="border border-gray8 bg-gray3 px-4 py-3 rounded-md font-mono">
      <li>M 5 5</li>
      <li>v 5</li>
      <li className="-mx-4 px-3 bg-gray6 border-l-4 border-gray8">
        Q {x1.toFixed(1)} {y1.toFixed(1)} {x.toFixed(1)} {y.toFixed(1)}
      </li>
      <li>h 5</li>
    </ol>
  );
}

export function TCommandList() {
  const {
    data: { x1, y1, x, y, tx, ty },
  } = useStateContext<{
    x1: number;
    y1: number;
    x: number;
    y: number;
    tx: number;
    ty: number;
  }>("chain");
  return (
    <ol className="border border-gray8 bg-gray3 px-4 py-3 rounded-md font-mono">
      <li>
        Q {x1.toFixed(1)} {y1.toFixed(1)} {x.toFixed(1)} {y.toFixed(1)}
      </li>
      <li>
        T {tx.toFixed(1)} {ty.toFixed(1)}
      </li>
    </ol>
  );
}

export function BezierCurveQuestion() {
  const { data, set } = useStateContext<{ active: boolean }>("answer");
  return (
    <div className="space-y-2">
      <PathEditor id="bezier-curve-practice" placeholder="M 5 10" />
      <Button onClick={() => set({ active: !data.active })}>
        Reveal Answer
      </Button>
      {data.active && (
        <CommandList
          id="command-list-bezier-curve-answers"
          commands={`M 5 17
          Q 10 8 15 17
          M 10 12.5
          Q 15 5 20 12.5
          M 5 5
          v 15
          h 15
          v -15
          z
          `}
        />
      )}
    </div>
  );
}

function Button(
  props: React.ComponentPropsWithoutRef<(typeof motion)["button"]>
) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="bg-gray1 border-gray8 rounded-md border shadow-sm text-sm px-2 py-1"
      {...props}
    />
  );
}
