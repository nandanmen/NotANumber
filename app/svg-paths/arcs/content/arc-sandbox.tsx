import React from "react";
import { motion } from "framer-motion";
import {
  DraggableEndpoint,
  useSvgPanHandler,
} from "app/svg-paths/components/draggable-endpoint";
import { useSvgContext } from "app/svg-paths/components/svg";
import { Circle } from "app/svg-paths/components/svg/circle";
import { Line } from "app/svg-paths/components/svg/line";
import { Text } from "app/svg-paths/components/svg/text";
import { Path as BasePath } from "app/svg-paths/components/svg/path";
import { getScale } from "app/svg-paths/components/utils";
import type {
  AbsoluteArcCommand,
  Command,
  Path as IPath,
} from "app/svg-paths/lib/path";
import {
  DragGroupState,
  getDragHandlers,
} from "../../components/svg/drag-group";
import { clsx } from "clsx";

type SyntaxState = {
  path: IPath;
} & DragGroupState;

const ArcSandboxContext = React.createContext<{
  path: IPath;
  tempPath: IPath | null;
  isActive: (prop: string) => boolean;
  state: SyntaxState["state"];
  setArc: (arc: Partial<Command<"A">>) => void;
  arc: AbsoluteArcCommand;
  set: (state: Partial<SyntaxState>) => void;
}>(null);

const useArcSandboxContext = () => {
  return React.useContext(ArcSandboxContext);
};

export function Root({
  path,
  state,
  active,
  set,
  children,
}: SyntaxState & {
  set: (state: Partial<SyntaxState>) => void;
  children: React.ReactNode;
}) {
  const arc = path.atAbsolute<"A">(1);

  const isActive = React.useCallback(
    (prop: string) => {
      return active?.includes(`1.${prop}`);
    },
    [active]
  );

  React.useEffect(() => {
    if (isActive("rx")) {
      document.documentElement.style.cursor = "ew-resize";
    } else if (isActive("ry")) {
      document.documentElement.style.cursor = "ns-resize";
    } else {
      document.documentElement.style.cursor = "auto";
    }
  }, [isActive]);

  const getTempPath = () => {
    if (isActive("largeArc")) {
      return path.set(1, { largeArc: !arc.largeArc });
    }
    if (isActive("sweep")) {
      return path.set(1, { sweep: !arc.sweep });
    }
    return null;
  };
  const tempPath = getTempPath();

  const setArc = React.useCallback(
    (arc: Partial<Command<"A">>) => {
      set({ path: path.set(1, arc) });
    },
    [set, path]
  );

  return (
    <ArcSandboxContext.Provider
      value={{
        path,
        tempPath,
        isActive,
        setArc,
        arc,
        state,
        set,
      }}
    >
      {children}
    </ArcSandboxContext.Provider>
  );
}

export function Background({ children }: { children: React.ReactNode }) {
  const { tempPath } = useArcSandboxContext();
  return (
    <motion.g animate={{ opacity: tempPath ? 0.2 : 1 }}>{children}</motion.g>
  );
}

export function ScaledEllipse(
  props: React.ComponentPropsWithoutRef<(typeof motion)["ellipse"]>
) {
  const { getRelative } = useSvgContext();
  const { arc } = useArcSandboxContext();
  const scale = getScale(arc.x0, arc.y0, arc.cx, arc.cy, arc.rx, arc.ry);

  const dx = arc.x - arc.x0;
  const dy = arc.y - arc.y0;
  const midX = arc.x0 + dx / 2;
  const midY = arc.y0 + dy / 2;
  const isScaled =
    midX.toFixed(3) === arc.cx.toFixed(3) ||
    midY.toFixed(3) === arc.cy.toFixed(3);

  if (!isScaled) return null;
  return (
    <g
      style={{
        transform: `rotate(${arc.xAxisRotation}deg)`,
        transformOrigin: `${arc.cx}px ${arc.cy}px`,
      }}
    >
      <motion.ellipse
        cx={arc.cx}
        cy={arc.cy}
        rx={arc.rx * scale}
        ry={arc.ry * scale}
        className="stroke-gray8 fill-none"
        strokeWidth={getRelative(0.5)}
        {...props}
      />
    </g>
  );
}

export function Ellipse(
  props: React.ComponentPropsWithoutRef<(typeof motion)["ellipse"]>
) {
  const { getRelative } = useSvgContext();
  const { arc } = useArcSandboxContext();
  return (
    <g
      style={{
        transform: `rotate(${arc.xAxisRotation}deg)`,
        transformOrigin: `${arc.cx}px ${arc.cy}px`,
      }}
    >
      <motion.ellipse
        cx={arc.cx}
        cy={arc.cy}
        rx={arc.rx}
        ry={arc.ry}
        className="stroke-gray10 fill-none"
        strokeWidth={getRelative(0.5)}
        {...props}
      />
    </g>
  );
}

export function XAxis(
  props: React.ComponentPropsWithoutRef<(typeof motion)["line"]>
) {
  const { arc } = useArcSandboxContext();
  return (
    <g
      style={{
        transform: `rotate(${arc.xAxisRotation}deg)`,
        transformOrigin: `${arc.cx}px ${arc.cy}px`,
      }}
    >
      <Line
        x1={arc.cx}
        y1={arc.cy}
        x2={arc.cx + arc.rx}
        y2={arc.cy}
        {...props}
      />
    </g>
  );
}

export function XAxisDragHandle(
  props: React.ComponentPropsWithoutRef<(typeof motion)["g"]>
) {
  const { getRelative } = useSvgContext();
  const { isActive, state, set, arc, setArc } = useArcSandboxContext();
  return (
    <g
      style={{
        transform: `rotate(${arc.xAxisRotation}deg)`,
        transformOrigin: `${arc.cx}px ${arc.cy}px`,
      }}
    >
      <motion.g
        className={clsx(isActive("rx") ? "text-gray1" : "text-gray10")}
        {...props}
      >
        <DragButton
          {...getDragHandlers({
            id: ["1.rx"],
            state,
            set,
          })}
          onPan={({ dx }) => {
            setArc({ rx: arc.rx + dx * 0.75 });
          }}
        >
          <rect
            className={clsx(!isActive("rx") && "fill-gray3 stroke-gray8")}
            strokeWidth={getRelative(0.25)}
            height={getRelative(4)}
            width={getRelative(8)}
            rx={getRelative(1)}
            x={arc.cx + arc.rx / 2 - getRelative(4)}
            y={arc.cy - getRelative(2)}
          />
          <DragX
            x={arc.cx + arc.rx / 2 - getRelative(4)}
            y={arc.cy - getRelative(4)}
            size={getRelative(8)}
          />
        </DragButton>
      </motion.g>
    </g>
  );
}

export function YAxis(
  props: React.ComponentPropsWithoutRef<(typeof motion)["line"]>
) {
  const { arc } = useArcSandboxContext();
  return (
    <g
      style={{
        transform: `rotate(${arc.xAxisRotation}deg)`,
        transformOrigin: `${arc.cx}px ${arc.cy}px`,
      }}
    >
      <Line
        x1={arc.cx}
        y1={arc.cy}
        x2={arc.cx}
        y2={arc.cy + arc.ry}
        {...props}
      />
    </g>
  );
}

export function YAxisDragHandle(
  props: React.ComponentPropsWithoutRef<(typeof motion)["g"]>
) {
  const { getRelative } = useSvgContext();
  const { isActive, state, set, arc, setArc } = useArcSandboxContext();
  return (
    <g
      style={{
        transform: `rotate(${arc.xAxisRotation}deg)`,
        transformOrigin: `${arc.cx}px ${arc.cy}px`,
      }}
    >
      <motion.g
        className={clsx(isActive("ry") ? "text-gray1" : "text-gray10")}
        {...props}
      >
        <DragButton
          {...getDragHandlers({
            id: ["1.ry"],
            state,
            set,
          })}
          onPan={({ dy }) => {
            setArc({ ry: arc.ry + dy * 0.75 });
          }}
        >
          <rect
            className={clsx(!isActive("ry") && "fill-gray3 stroke-gray8")}
            strokeWidth={getRelative(0.25)}
            width={getRelative(4)}
            height={getRelative(8)}
            rx={getRelative(1)}
            x={arc.cx - getRelative(2)}
            y={arc.cy + arc.ry / 2 - getRelative(4)}
          />
          <DragY
            x={arc.cx - getRelative(4)}
            y={arc.cy + arc.ry / 2 - getRelative(4)}
            size={getRelative(8)}
          />
        </DragButton>
      </motion.g>
    </g>
  );
}

export function Center(
  props: React.ComponentPropsWithoutRef<(typeof motion)["circle"]>
) {
  const { arc } = useArcSandboxContext();
  return <Circle cx={arc.cx} cy={arc.cy} {...props} />;
}

export function TempPath(
  props: React.ComponentPropsWithoutRef<(typeof motion)["path"]>
) {
  const { getRelative } = useSvgContext();
  const { tempPath } = useArcSandboxContext();
  if (!tempPath) return null;
  return (
    <BasePath
      className="stroke-gray10 fill-none"
      d={tempPath.toPathString()}
      strokeDasharray={`${getRelative(3)} ${getRelative(1.5)}`}
      animate={{
        strokeDashoffset: -9,
      }}
      initial={{
        strokeDashoffset: 0,
      }}
      transition={{
        type: "tween",
        ease: "linear",
        duration: 5,
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

export function Path(
  props: React.ComponentPropsWithoutRef<(typeof motion)["path"]>
) {
  const { path } = useArcSandboxContext();
  return <BasePath d={path.toPathString()} {...props} />;
}

export function Origin() {
  const { arc, state, set, path } = useArcSandboxContext();
  return (
    <DraggableEndpoint
      cx={arc.x0}
      cy={arc.y0}
      {...getDragHandlers({
        id: ["0.x", "0.y"],
        state,
        set,
      })}
      onPan={(x, y) => {
        set({ path: path.setAbsolute(0, { x, y }) });
      }}
    />
  );
}

export function Endpoint() {
  const { arc, state, set, path } = useArcSandboxContext();
  return (
    <DraggableEndpoint
      cx={arc.x}
      cy={arc.y}
      {...getDragHandlers({
        id: ["1.x", "1.y"],
        state,
        set,
      })}
      onPan={(x, y) => {
        set({ path: path.setAbsolute(1, { x, y }) });
      }}
    />
  );
}

export function RotationAxis() {
  const { size } = useSvgContext();
  const { arc, isActive } = useArcSandboxContext();
  return (
    <Line
      x1="0"
      y1={arc.cy}
      x2={size}
      y2={arc.cy}
      dashed
      animate={{
        opacity: isActive("xAxisRotation") ? 1 : 0,
      }}
    />
  );
}

export function Angle({ radius = 15 }) {
  const { getRelative } = useSvgContext();
  const r = getRelative(radius);
  const { arc, isActive } = useArcSandboxContext();
  const { x: endX, y: endY } = toCartesian(arc.xAxisRotation, r);
  return (
    <motion.g
      animate={{
        opacity: isActive("xAxisRotation") ? 1 : 0,
      }}
    >
      <Circle size="small" cx={arc.cx + r} cy={arc.cy} />
      <Circle size="small" cx={arc.cx + endX} cy={arc.cy + endY} />
      <Path
        className="stroke-gray10 fill-none"
        strokeWidth={getRelative(0.5)}
        d={`M ${arc.cx + r} ${arc.cy} A ${r} ${r} 0 0 1 ${arc.cx + endX} ${
          arc.cy + endY
        }`}
      />
    </motion.g>
  );
}

export function AngleText({ radius = 15 }) {
  const { getRelative } = useSvgContext();
  const r = getRelative(radius);
  const { arc, isActive } = useArcSandboxContext();
  const { x: endX, y: endY } = toCartesian(arc.xAxisRotation / 2, r);
  return (
    <motion.g
      animate={{
        opacity: isActive("xAxisRotation") ? 1 : 0,
      }}
    >
      <Text x={arc.cx + endX} y={arc.cy + endY}>
        {arc.xAxisRotation.toFixed(1)}°
      </Text>
    </motion.g>
  );
}

const toCartesian = (angle: number, radius: number) => ({
  x: radius * Math.cos(angle * (Math.PI / 180)),
  y: radius * Math.sin(angle * (Math.PI / 180)),
});

// Assumes path starts with an M command followed by an A command
export function ArcSandbox({
  path,
  state,
  active,
  set,
}: SyntaxState & {
  set: (state: Partial<SyntaxState>) => void;
}) {
  return (
    <Root path={path} state={state} active={active} set={set}>
      <Background>
        <ScaledEllipse />
        <Ellipse />
        <XAxis />
        <XAxisDragHandle />
        <YAxis />
        <YAxisDragHandle />
        <Center />
      </Background>
      <TempPath />
      <Path />
      <Origin />
      <Endpoint />
    </Root>
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
