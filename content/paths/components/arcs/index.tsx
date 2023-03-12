import React from "react";
import { svgArcToCenterParam } from "~/components/PathVisualizer";
import { motion, transform } from "framer-motion";
import {
  PathBackground,
  useBackgroundContext,
} from "~/components/PathPlayground";
import { usePageContext } from "../PageProvider";
import { darkTheme, styled } from "~/stitches.config";
import { useMachine } from "@xstate/react";
import { arcsMachine } from "./state";

const arcProps = [
  {
    x0: 10,
    y0: 20,
    rx: 10,
    ry: 5,
    x: 20,
    y: 20,
  },
  {
    x0: 5,
    y0: 15,
    rx: 10,
    ry: 5,
    x: 25,
    y: 15,
  },
  {
    x0: 5,
    y0: 15,
    rx: 10,
    ry: 5,
    x: 25,
    y: 15,
  },
];

export const ArcsVisual = () => {
  const { activeIndex } = usePageContext();
  const props = arcProps[activeIndex - 2] ?? arcProps[0];

  return (
    <Box css={{ position: "relative" }}>
      <ArcPlayground {...props} />
    </Box>
  );
};

const FadeOut = ({ active, children }) => {
  return (
    <motion.g
      animate={active ? "visible" : "hidden"}
      variants={{
        visible: { opacity: 1, transition: { type: false } },
        hidden: { opacity: 0, transition: { type: false } },
      }}
      initial="hidden"
    >
      {children}
    </motion.g>
  );
};

const Polar = ({ children, x = 0, y = 0, radius, angle }) => {
  const { x: cx, y: cy } = toCartesian(angle, radius);
  return <motion.g style={{ x: x + cx, y: y + cy }}>{children}</motion.g>;
};

const toCartesian = (angle: number, radius: number) => ({
  x: radius * Math.cos(angle * (Math.PI / 180)),
  y: radius * Math.sin(angle * (Math.PI / 180)),
});

const SIZE = 30;

export const ArcPlayground = ({
  x0,
  y0,
  largeArc = false,
  sweep = false,
  rx,
  ry,
  x,
  y,
  rotation = 0,
}) => {
  const [_rx, setRx] = React.useState(rx);
  const [_ry, setRy] = React.useState(ry);
  const [_x, setX] = React.useState(x);
  const [_y, setY] = React.useState(y);
  const [_rotation, setRotation] = React.useState(rotation);

  const [state, send] = useMachine(arcsMachine);
  const isActive = (name: string) => state.context.name === name;

  React.useEffect(() => {
    setRx(rx);
    setRy(ry);
    setX(x);
    setY(y);
    setRotation(rotation);
  }, [rx, ry, x, y, rotation]);

  const { cx, cy } = svgArcToCenterParam(
    x0,
    y0,
    _rx,
    _ry,
    _rotation * (Math.PI / 180),
    largeArc,
    sweep,
    _x,
    _y
  );

  const getCurrentAxis = () => {
    if (isActive("rx")) return "x";
    if (isActive("ry")) return "y";
    if (isActive("rotation")) return "x";
  };

  return (
    <>
      <PathBackground size={SIZE} step={5}>
        <FadeOut active={isActive("rotation")}>
          <RotationGroup rotation={_rotation} cx={cx} cy={cy} />
        </FadeOut>
        {isActive("y") && (
          <Line css={{ stroke: "$gray8" }} x1={_x} x2={_x} y1={0} y2={SIZE} />
        )}
        {isActive("x") && (
          <Line css={{ stroke: "$gray8" }} x1={0} x2={SIZE} y1={_y} y2={_y} />
        )}
        <Ellipse
          cx={cx}
          cy={cy}
          rx={_rx}
          ry={_ry}
          rotation={_rotation}
          axis={getCurrentAxis()}
        />
        <motion.g style={{ x: cx, y: cy }}>
          <Polar radius={_ry / 2} angle={-90 + _rotation}>
            <FadeOut active={isActive("ry")}>
              <Text>{_ry.toFixed(1)}</Text>
            </FadeOut>
          </Polar>
          <Polar radius={_rx / 2} angle={180 + _rotation}>
            <FadeOut active={isActive("rx")}>
              <Text>{_rx.toFixed(1)}</Text>
            </FadeOut>
          </Polar>
          <Polar radius={4} angle={180 + _rotation / 2}>
            <FadeOut active={isActive("rotation")}>
              <Text>{_rotation.toFixed(1)}°</Text>
            </FadeOut>
          </Polar>
        </motion.g>
        <ArcPath
          x0={x0}
          y0={y0}
          rx={_rx}
          ry={_ry}
          x={_x}
          y={_y}
          rotation={_rotation}
          largeArc={false}
          sweep={false}
        />
        <Startpoint x={x0} y={y0} />
        <Endpoint x={_x} y={_y} active={isActive("x") || isActive("y")} />
      </PathBackground>
      <Box
        css={{
          display: "flex",
          fontFamily: "$mono",
          fontSize: "$xl",
          position: "absolute",
          bottom: "8vh",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "$6 $10",
          background: "$gray2",
          borderRadius: 9999,
          border: "2px solid $gray6",
          boxShadow: "$md",
          gap: "$3",

          [`.${darkTheme} &`]: {
            background: "hsl(0 0% 5%)",
            border: "2px solid $gray4",
          },
        }}
      >
        <span>A</span>
        <SlideButton
          value={_rx}
          onChange={setRx}
          onPanStart={() => send({ type: "panStart", name: "rx" })}
          onPanEnd={() => send({ type: "panEnd", name: "rx" })}
          onHoverStart={() => send({ type: "hoverStart", name: "rx" })}
          onHoverEnd={() => send({ type: "hoverEnd", name: "rx" })}
        />
        <SlideButton
          value={_ry}
          onChange={setRy}
          onPanStart={() => send({ type: "panStart", name: "ry" })}
          onPanEnd={() => send({ type: "panEnd", name: "ry" })}
          onHoverStart={() => send({ type: "hoverStart", name: "ry" })}
          onHoverEnd={() => send({ type: "hoverEnd", name: "ry" })}
        />
        <SlideButton
          value={_rotation}
          onChange={setRotation}
          bounds={[
            [-80, 80],
            [-5, 5],
          ]}
          onPanStart={() => send({ type: "panStart", name: "rotation" })}
          onPanEnd={() => send({ type: "panEnd", name: "rotation" })}
          onHoverStart={() => send({ type: "hoverStart", name: "rotation" })}
          onHoverEnd={() => send({ type: "hoverEnd", name: "rotation" })}
        />
        <span>0</span>
        <span>0</span>
        <SlideButton
          value={_x}
          onChange={setX}
          onPanStart={() => send({ type: "panStart", name: "x" })}
          onPanEnd={() => send({ type: "panEnd", name: "x" })}
          onHoverStart={() => send({ type: "hoverStart", name: "x" })}
          onHoverEnd={() => send({ type: "hoverEnd", name: "x" })}
        />
        <SlideButton
          value={_y}
          onChange={setY}
          onPanStart={() => send({ type: "panStart", name: "y" })}
          onPanEnd={() => send({ type: "panEnd", name: "y" })}
          onHoverStart={() => send({ type: "hoverStart", name: "y" })}
          onHoverEnd={() => send({ type: "hoverEnd", name: "y" })}
        />
      </Box>
    </>
  );
};

const RotationGroup = ({ cx, cy, rotation }) => {
  const { strokeWidth } = useBackgroundContext();
  const endX = cx - toCartesian(rotation, 3).x;
  const endY = cy - toCartesian(rotation, 3).y;
  return (
    <g stroke="var(--colors-gray8)" strokeWidth={strokeWidth}>
      <line x1="0" x2={SIZE} y1={cy} y2={cy} />
      <path
        d={`M ${cx - 3} ${cy} A 3 3 0 0 ${endY > cy ? 0 : 1} ${endX} ${endY}`}
        fill="none"
      />
    </g>
  );
};

const SlideButton = ({
  value,
  onChange,
  bounds = [
    [-80, 80],
    [-1, 1],
  ],
  onPanStart,
  onPanEnd,
  ...props
}: {
  value: number;
  onChange: (value: number) => void;
  bounds?: [[number, number], [number, number]];
} & Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "onChange" | "onPan"
>) => {
  const [panning, setPanning] = React.useState(false);
  return (
    <Button
      onPanStart={(...args) => {
        setPanning(true);
        onPanStart?.(...args);
      }}
      onPan={(_, info) => {
        onChange(value + transform(info.delta.x, ...bounds));
      }}
      onPanEnd={(...args) => {
        setPanning(false);
        onPanEnd?.(...args);
      }}
      active={panning}
      {...props}
    >
      {value.toFixed(1)}
    </Button>
  );
};

const Button = styled(motion.button, {
  padding: 6,
  margin: -6,
  borderRadius: "$base",

  "&:hover": {
    background: "$gray5",
  },

  [`.${darkTheme} &`]: {
    "&:hover": {
      background: "$gray2",
    },
  },

  variants: {
    active: {
      true: {
        background: "$gray5",

        [`.${darkTheme} &`]: {
          background: "$gray2",
        },
      },
    },
  },
});

const Box = styled("div", {});

const Text = ({ children, ...props }) => {
  const { endpointSize, strokeWidth } = useBackgroundContext();
  return (
    <>
      <Box
        as="text"
        {...props}
        fontSize={endpointSize * 2}
        strokeWidth={strokeWidth * 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        css={{
          stroke: "$gray4",
          [`.${darkTheme} &`]: {
            stroke: "$gray1",
          },
        }}
      >
        {children}
      </Box>
      <Box
        as="text"
        css={{ fill: "$gray10" }}
        fontSize={endpointSize * 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        {...props}
      >
        {children}
      </Box>
    </>
  );
};

const Line = (props) => {
  const { strokeWidth } = useBackgroundContext();
  return <Box as={motion.line} strokeWidth={strokeWidth} {...props} />;
};

export const Ellipse = ({
  cx,
  cy,
  rx,
  ry,
  rotation,
  axis,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  axis?: "x" | "y";
}) => {
  const { strokeWidth } = useBackgroundContext();
  return (
    <g
      strokeWidth={strokeWidth}
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      <g stroke="var(--colors-gray8)">
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" />
        <FadeOut active={axis === "x"}>
          <line
            x1={cx}
            y1={cy}
            x2={cx - rx}
            y2={cy}
            strokeDasharray={strokeWidth * 2}
          />
        </FadeOut>
        <FadeOut active={axis === "y"}>
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - ry}
            strokeDasharray={strokeWidth * 2}
          />
        </FadeOut>
      </g>
      <circle cx={cx} cy={cy} fill="var(--colors-gray8)" r={strokeWidth * 3} />
    </g>
  );
};

type ArcPathProps = {
  x0: number;
  y0: number;
  rx: number;
  ry: number;
  x: number;
  y: number;
  rotation: number;
  largeArc: boolean;
  sweep: boolean;
} & React.ComponentPropsWithoutRef<typeof motion["path"]>;

export const ArcPath = ({
  x0,
  y0,
  rx,
  ry,
  x,
  y,
  rotation,
  largeArc,
  sweep,
  ...props
}: ArcPathProps) => {
  const { strokeWidth } = useBackgroundContext();
  return (
    <motion.path
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth * 4}
      d={`M ${x0} ${y0} A ${rx} ${ry} ${rotation} ${largeArc ? 1 : 0} ${
        sweep ? 1 : 0
      } ${x} ${y}`}
      {...props}
    />
  );
};

const Startpoint = ({ x, y }) => {
  const { strokeWidth } = useBackgroundContext();
  return (
    <Box
      as="circle"
      cx={x}
      cy={y}
      css={{ fill: "$gray12" }}
      r={strokeWidth * 4}
    />
  );
};

const Endpoint = ({ x, y, active = false }) => {
  const { strokeWidth, endpointSize } = useBackgroundContext();
  return (
    <motion.g style={{ x, y }}>
      <Box
        as={motion.circle}
        animate={{ r: active ? endpointSize * 1.8 : 0 }}
        css={{ fill: "$gray8" }}
      />
      <Box
        as="circle"
        css={{
          fill: "$gray4",
          stroke: "$gray12",
          [`.${darkTheme} &`]: {
            fill: "$gray1",
          },
        }}
        strokeWidth={strokeWidth * 1.5}
        r={endpointSize}
      />
    </motion.g>
  );
};
