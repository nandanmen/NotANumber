import { motion } from "framer-motion";
import {
  DraggableEndpoint,
  useSvgPanHandler,
} from "app/svg-paths/components/draggable-endpoint";
import { useStateContext } from "app/svg-paths/components/state-context";
import { useSvgContext } from "app/svg-paths/components/svg";
import { Circle } from "app/svg-paths/components/svg/circle";
import { Line } from "app/svg-paths/components/svg/line";
import { Path } from "app/svg-paths/components/svg/path";
import { getArcCenter } from "app/svg-paths/components/utils";
import { parsePath, type Path as IPath } from "app/svg-paths/lib/path";
import {
  createInitialState,
  DragGroupState,
  getDragHandlers,
} from "./drag-group";
import { clsx } from "clsx";

const path = parsePath("M 3 10 A 10 10 0 0 0 19 20");

type SyntaxState = {
  path: IPath;
} & DragGroupState;

function ArcSyntax() {
  const { getRelative } = useSvgContext();
  const {
    data: { path, state, active },
    set,
  } = useStateContext<SyntaxState>("syntax");
  const move = path.atAbsolute<"M">(0);
  const arc = path.atAbsolute<"A">(1);
  const { cx, cy } = getArcCenter(arc);
  const isActive = (id: string, prop: string) => {
    return active?.includes(`${id}.${prop}`);
  };
  return (
    <g>
      <ellipse
        className="stroke-gray10 fill-none"
        strokeWidth={getRelative(0.5)}
        cx={cx}
        cy={cy}
        rx={arc.rx}
        ry={arc.ry}
      />
      <Line x1={cx} y1={cy} x2={cx + arc.rx} y2={cy} />
      <g
        className={clsx(isActive(arc.id, "rx") ? "text-gray1" : "text-gray10")}
      >
        <DragButton
          {...getDragHandlers({
            id: [`${arc.id}.rx`],
            state,
            set,
          })}
          onPan={({ dx }) => {
            set({ path: path.set(1, { rx: arc.rx + dx * 0.75 }) });
          }}
        >
          <rect
            className={clsx(
              !isActive(arc.id, "rx") && "fill-gray3 stroke-gray8"
            )}
            strokeWidth={getRelative(0.25)}
            height={getRelative(4)}
            width={getRelative(8)}
            rx={getRelative(1)}
            x={cx + arc.rx / 2 - getRelative(4)}
            y={cy - getRelative(2)}
          />
          <DragX
            x={cx + arc.rx / 2 - getRelative(4)}
            y={cy - getRelative(4)}
            size={getRelative(8)}
          />
        </DragButton>
      </g>
      <Line x1={cx} y1={cy} x2={cx} y2={cy + arc.ry} />
      <g
        className={clsx(isActive(arc.id, "ry") ? "text-gray1" : "text-gray10")}
      >
        <DragButton
          {...getDragHandlers({
            id: [`${arc.id}.ry`],
            state,
            set,
          })}
          onPan={({ dy }) => {
            set({ path: path.set(1, { ry: arc.ry + dy * 0.75 }) });
          }}
        >
          <rect
            className={clsx(
              !isActive(arc.id, "ry") && "fill-gray3 stroke-gray8"
            )}
            strokeWidth={getRelative(0.25)}
            width={getRelative(4)}
            height={getRelative(8)}
            rx={getRelative(1)}
            x={cx - getRelative(2)}
            y={cy + arc.ry / 2 - getRelative(4)}
          />
          <DragY
            x={cx - getRelative(4)}
            y={cy + arc.ry / 2 - getRelative(4)}
            size={getRelative(8)}
          />
        </DragButton>
      </g>
      <Circle cx={cx} cy={cy} />
      <Path d={path.toPathString()} />
      <DraggableEndpoint
        cx={arc.x0}
        cy={arc.y0}
        {...getDragHandlers({
          id: [`${move.id}.x`, `${move.id}.y`],
          state,
          set,
        })}
        onPan={(x, y) => {
          set({ path: path.setAbsolute(0, { x, y }) });
        }}
      />
      <DraggableEndpoint
        cx={arc.x}
        cy={arc.y}
        {...getDragHandlers({
          id: [`${arc.id}.x`, `${arc.id}.y`],
          state,
          set,
        })}
        onPan={(x, y) => {
          set({ path: path.setAbsolute(1, { x, y }) });
        }}
      />
    </g>
  );
}

function DragButton({
  onPan,
  ...props
}: Omit<React.ComponentProps<(typeof motion)["g"]>, "onPan"> & {
  onPan: ({
    x,
    y,
    dx,
    dy,
  }: {
    x: number;
    y: number;
    dx: number;
    dy: number;
  }) => void;
}) {
  const handlePan = useSvgPanHandler();
  return (
    <motion.g
      onPan={(_, info) => {
        onPan(handlePan(info));
      }}
      {...props}
    />
  );
}

const DragX = ({ x = 0, y = 0, size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      x={x}
      y={y}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19.25 12L17.75 10.75L17.75 13.25L19.25 12Z" />
      <path d="M4.75 12L6.25 10.75V13.25L4.75 12Z" />
      <path d="M19 12L4.75 12" />
    </svg>
  );
};

const DragY = ({ x = 0, y = 0, size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      x={x}
      y={y}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.75L10.75 6.25H13.25L12 4.75Z" />
      <path d="M12 19.25L10.75 17.75H13.25L12 19.25Z" />
      <path d="M12 5V19.25" />
    </svg>
  );
};

export const initialState = {
  ...createInitialState(),
  index: null,
  expanded: false,
  path,
};

export const page = {
  children: <ArcSyntax />,
};
