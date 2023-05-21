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
