import React from "react";
import { svgArcToCenterParam } from "~/components/PathVisualizer";
import { motion, transform } from "framer-motion";
import {
  PathBackground,
  useBackgroundContext,
} from "~/components/PathPlayground";
import { usePageContext } from "../PageProvider";
import { darkTheme, styled } from "~/stitches.config";

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
        hidden: { opacity: 0, transition: { delay: 0.2 } },
      }}
      initial="hidden"
    >
      {children}
    </motion.g>
  );
};

const toCartesian = (angle: number, radius: number) => ({
  x: radius * Math.cos(angle * (Math.PI / 180)),
  y: radius * Math.sin(angle * (Math.PI / 180)),
});

type ArcArg = "rx" | "ry" | "x" | "y" | "rotation";

const ArcPlayground = ({
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

  const [active, dispatch] = React.useReducer(
    (state: ArcArg | null, action: ArcArg) => {
      if (action === state) return null;
      return action;
    },
    null
  );

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

  const endX = cx - toCartesian(_rotation, 3).x;
  const endY = cy - toCartesian(_rotation, 3).y;

  const textX = cx - toCartesian(_rotation / 2, 4).x;
  const textY = cy - toCartesian(_rotation / 2, 4).y;

  return (
    <>
      <PathBackground size={30} step={5}>
        <FadeOut active={active === "rotation"}>
          <LineGroup>
            <line x1="0" x2="30" y1={cy} y2={cy} />
            <path
              d={`M ${cx - 3} ${cy} A 3 3 0 0 ${
                endY > cy ? 0 : 1
              } ${endX} ${endY}`}
              fill="none"
            />
          </LineGroup>
        </FadeOut>
        <Ellipse
          cx={cx}
          cy={cy}
          rx={_rx}
          ry={_ry}
          rotation={_rotation}
          debug={active === "rotation"}
        />
        <FadeOut active={active === "rotation"}>
          <Text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight="bold"
            stroke="none"
            fill="var(--colors-gray8)"
          >
            {_rotation.toFixed(1)}°
          </Text>
        </FadeOut>
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

          [`.${darkTheme}`]: {
            background: "hsl(0 0% 5%)",
            border: "2px solid $gray4",
          },
        }}
      >
        <span>A</span>
        <SlideButton
          value={_rx}
          onChange={setRx}
          onPanStateChange={() => dispatch("rx")}
        />
        <SlideButton
          value={_ry}
          onChange={setRy}
          onPanStateChange={() => dispatch("ry")}
        />
        <SlideButton
          value={_rotation}
          onChange={setRotation}
          bounds={[
            [-80, 80],
            [-5, 5],
          ]}
          onPanStateChange={() => dispatch("rotation")}
        />
        <span>0</span>
        <span>0</span>
        <SlideButton
          value={_x}
          onChange={setX}
          onPanStateChange={() => dispatch("x")}
        />
        <SlideButton
          value={_y}
          onChange={setY}
          onPanStateChange={() => dispatch("y")}
        />
      </Box>
    </>
  );
};

const SlideButton = ({
  value,
  onChange,
  bounds = [
    [-80, 80],
    [-1, 1],
  ],
  onPanStateChange,
}: {
  value: number;
  onChange: (value: number) => void;
  bounds?: [[number, number], [number, number]];
  onPanStateChange?: () => void;
}) => {
  const [panning, setPanning] = React.useState(false);
  return (
    <Button
      onPanStart={() => {
        setPanning(true);
        onPanStateChange?.();
      }}
      onPan={(_, info) => {
        onChange(value + transform(info.delta.x, ...bounds));
      }}
      onPanEnd={() => {
        setPanning(false);
        onPanStateChange?.();
      }}
      active={panning}
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

  [`.${darkTheme}`]: {
    "&:hover": {
      background: "$gray2",
    },
  },

  variants: {
    active: {
      true: {
        background: "$gray5",

        [`.${darkTheme}`]: {
          background: "$gray2",
        },
      },
    },
  },
});

const Box = styled("div", {});

const LineGroup = ({ children, dashed = false, ...props }) => {
  const { strokeWidth } = useBackgroundContext();
  return (
    <motion.g
      stroke="var(--colors-gray8)"
      strokeDasharray={dashed && strokeWidth * 2}
      strokeWidth={strokeWidth}
      {...props}
    >
      {children}
    </motion.g>
  );
};

const Text = ({ children, ...props }) => {
  const { endpointSize, strokeWidth } = useBackgroundContext();
  return (
    <>
      <text
        {...props}
        fontSize={endpointSize * 2}
        stroke="var(--colors-gray1)"
        strokeWidth={strokeWidth * 2}
      >
        {children}
      </text>
      <text fontSize={endpointSize * 2} {...props}>
        {children}
      </text>
    </>
  );
};

export const Ellipse = ({ cx, cy, rx, ry, rotation, debug = false }) => {
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
        <FadeOut active={debug}>
          <line
            x1={cx}
            y1={cy}
            x2={cx - rx}
            y2={cy}
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
  pathProps?: React.ComponentPropsWithoutRef<typeof motion["path"]>;
};

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
  pathProps = {},
}: ArcPathProps) => {
  const { strokeWidth, endpointSize } = useBackgroundContext();
  return (
    <Box
      as="g"
      css={{
        color: "$gray12",
      }}
    >
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth * 4}
        d={`M ${x0} ${y0} A ${rx} ${ry} ${rotation} ${largeArc ? 1 : 0} ${
          sweep ? 1 : 0
        } ${x} ${y}`}
        {...pathProps}
      />
      <circle cx={x0} cy={y0} fill="currentColor" r={strokeWidth * 4} />
      <Box
        as="circle"
        css={{
          fill: "$gray4",

          [`.${darkTheme}`]: {
            fill: "$gray1",
          },
        }}
        cx={x}
        cy={y}
        strokeWidth={strokeWidth * 1.5}
        stroke="currentColor"
        r={endpointSize}
      />
    </Box>
  );
};
