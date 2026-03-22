type LabelProps = {
  label?: string;
  labelColor?: string;
  labelSide?: "left" | "right";
};

function Label({ label, labelColor, labelSide = "left" }: LabelProps) {
  if (!label) return null;
  const sideClass =
    labelSide === "right"
      ? "right-0 translate-x-1/2"
      : "left-0 -translate-x-1/2";
  return (
    <div
      className={`absolute top-0 ${sideClass} -translate-y-1/2 h-5 min-w-5 px-1 rounded ${labelColor} text-white flex items-center justify-center font-medium text-sm`}
    >
      {label}
    </div>
  );
}

export function Computer({ label, labelColor, labelSide }: LabelProps) {
  return (
    <div className="relative w-fit mx-auto">
      <div className="w-[60px] h-14 flex flex-col">
        <div className="bg-gray4 pb-0.5 shadow-md shadow-black/7 rounded-lg ring-1 ring-black/10  grow relative">
          <div className="h-full flex items-center bg-gray4 rounded-lg border-4 border-gray1" />
        </div>
        <div className="h-1.5 w-4 bg-gray8 mx-auto" />
        <div className="h-2 w-2/3 mx-auto bg-gray1 shadow-md shadow-black/7 rounded-sm ring-1 ring-black/10" />
      </div>
      <Label label={label} labelColor={labelColor} labelSide={labelSide} />
    </div>
  );
}

const ROUTER_COLORS = [
  { bg: "bg-blue9", dot: "bg-blue-500", border: "border-blue-200" },
  { bg: "bg-green9", dot: "bg-green-500", border: "border-green-200" },
  { bg: "bg-yellow10", dot: "bg-yellow-500", border: "border-yellow-200" },
  { bg: "bg-red9", dot: "bg-red-500", border: "border-red-200" },
  { bg: "bg-cyan9", dot: "bg-cyan-500", border: "border-cyan-200" },
  { bg: "bg-gray9", dot: "bg-gray-500", border: "border-gray-200" },
] as const;

export function Router({ label }: { label?: number }) {
  const color =
    label != null
      ? ROUTER_COLORS[(label - 1) % ROUTER_COLORS.length]
      : ROUTER_COLORS[0];
  return (
    <div className="relative w-fit mx-auto">
      <div className="w-[60px] h-14 flex flex-col">
        <div className="h-1/2 flex justify-between px-2 relative">
          <div className="h-full w-1 bg-gray1 shadow-md shadow-black/7 rounded-t ring-1 ring-black/10" />
          <div className="h-full w-1 bg-gray1 shadow-md shadow-black/7 rounded-t ring-1 ring-black/10" />
        </div>
        <div className="relative h-1/2">
          {label != null && (
            <div
              className={`absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-0.5 h-5 min-w-5 px-1 rounded ${color.bg} text-white flex items-center justify-center font-medium text-sm z-10`}
            >
              {label}
            </div>
          )}
          <div className="bg-gray4 pb-0.5 shadow-md shadow-black/7 rounded-lg ring-1 ring-black/10 h-full -translate-y-1 relative z-10">
            <div className="h-full flex items-center bg-gray1 rounded-lg px-2 gap-0.5">
              <div
                className={`size-2.5 rounded-full ${color.dot} border-2 ${color.border}`}
              />
              <div className="size-1.5 rounded-full bg-gray6 ml-auto" />
              <div className="size-1.5 rounded-full bg-gray6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Server({ label, labelColor, labelSide }: LabelProps) {
  return (
    <div className="relative w-fit mx-auto">
      <div className="w-[60px] bg-gray1 shadow-md shadow-black/7 rounded-lg ring-1 ring-black/10">
        <div className="h-7 flex items-center px-2 gap-1 border-b border-black/10">
          <div className="size-2.5 rounded-full bg-blue-500 border-2 border-blue-200" />
          <div className="h-2.5 grow grid grid-rows-2 gap-px">
            <div className="bg-gray6 rounded-[2px]" />
            <div className="bg-gray6 rounded-[2px]" />
          </div>
        </div>
        <div className="bg-gray4 pb-0.5 rounded-b-lg overflow-hidden">
          <div className="h-7 flex items-center px-2 gap-1 bg-gray1 rounded-b-lg -mt-px">
            <div className="size-2.5 rounded-full bg-gray6" />
            <div className="h-2.5 grow grid grid-rows-2 gap-px">
              <div className="bg-gray6 rounded-[2px]" />
              <div className="bg-gray6 rounded-[2px]" />
            </div>
          </div>
        </div>
      </div>
      <Label label={label} labelColor={labelColor} labelSide={labelSide} />
    </div>
  );
}
