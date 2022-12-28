import React from "react";
import { v4 } from "uuid";
import { animate, motion, transform, useMotionValue } from "framer-motion";
import { range } from "~/lib/utils";
import { styled } from "~/stitches.config";
import { Checkbox } from "~/components/Checkbox";

const colorStart = `hsl(360, 81.7%, 87.8%)`; // $red6
const colorEnd = `hsl(358, 65.0%, 48.7%)`; // $red11

const darken = (color: string, amount: number) => {
  const [h, s, l] = color.slice(0, -1).split("hsl(")[1].split(", ");
  const newL = parseFloat(l.split("%")[0]) - amount;
  return `hsl(${h}, ${s}, ${Math.max(newL, 8.2)}%)`;
};

function mapReverse<V, T>(arr: V[], fn: (v: V, i: number) => T): T[] {
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(fn(arr[i], i));
  }
  return result;
}

const speeds = [0.25, 0.5, 1];

export const Cards = () => {
  const [showOverflow, setShowOverflow] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [data, setData] = React.useState(() =>
    range(5).map((value) => ({ id: v4(), value }))
  );
  const [discarded, setDiscarded] = React.useState([]);

  const rotate = (index: number) => {
    /**
     * to rotate an array, I need to move the item at index to the start of the
     * array and move everything before the index to the end of the array
     */
    const first = data.slice(0, index);
    const last = data.slice(index);
    setData([
      ...last,
      ...first.map((item) => ({
        ...item,
        id: v4(),
      })),
    ]);
    setDiscarded(first);
  };

  return (
    <PageWrapper>
      <Checkbox
        label="Show overflow"
        checked={showOverflow}
        onCheckedChange={() => setShowOverflow(!showOverflow)}
      />
      <Wrapper css={{ overflow: !showOverflow && "hidden" }}>
        <Background />
        {mapReverse([...discarded, ...data], (item, index) => {
          const isDiscarded = discarded.includes(item);
          const dataIndex = data.findIndex((_item) => _item.id === item.id);
          return (
            <Card
              speed={speed}
              key={item.id}
              value={item.value}
              index={isDiscarded ? index : dataIndex}
              discarded={isDiscarded}
              lastIndex={index}
              onClick={(requestedIndex) => rotate(requestedIndex || dataIndex)}
            />
          );
        })}
      </Wrapper>
      <div>
        <SpeedButtonWrapper>
          {speeds.map((_speed) => (
            <SpeedButton
              key={_speed}
              active={_speed === speed}
              onClick={() => setSpeed(_speed)}
            >
              {_speed}x
            </SpeedButton>
          ))}
        </SpeedButtonWrapper>
      </div>
    </PageWrapper>
  );
};

const SpeedButton = styled("button", {
  "&:hover": {
    color: "$gray12",
  },
  variants: {
    active: {
      true: {
        fontWeight: "bold",
        color: "$gray12",
      },
    },
  },
});

const SpeedButtonWrapper = styled("div", {
  display: "flex",
  gap: "$2",
});

const PageWrapper = styled("div", {
  width: 700,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "$6",
  fontFamily: "$mono",
  color: "$gray11",
});

const Wrapper = styled("div", {
  width: "100%",
  aspectRatio: 1,
  border: "1px solid $gray6",
  borderRadius: 12,
  background: "$gray1",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const xTransform = transform([-100, 100], [-80, 80], { clamp: false });

const Card = ({
  index,
  value,
  discarded = false,
  lastIndex = index,
  speed,
  ...props
}) => {
  const transition = React.useMemo(() => {
    return {
      type: "spring",
      damping: 70,
      stiffness: 600 * speed,
      delay: lastIndex * (0.05 / speed),
    } as const;
  }, [speed, lastIndex]);

  const x = useMotionValue(500);
  const rotateZ = useMotionValue(0);
  const rotateY = useMotionValue(0);

  React.useEffect(() => {
    if (discarded) {
      animate(x, -600, transition);
    } else {
      animate(x, index * 20 + index * 30, transition);
    }
  }, [x, discarded, index, transition]);

  React.useEffect(() => {
    if (discarded) {
      animate(rotateZ, -90, transition);
      animate(rotateY, index * 5, transition);
    } else {
      animate(rotateZ, index * 5, transition);
      animate(rotateY, index * 5, transition);
    }
  }, [discarded, index, transition, rotateZ, rotateY]);

  const background = `linear-gradient(-45deg, ${darken(
    colorEnd,
    index * 12
  )}, ${darken(colorStart, index * 12)})`;

  const currentX = index * 20 + index * 30;
  const currentRotateZ = index * 5;
  const currentRotateY = index * 5;

  return (
    <_Card
      animate={discarded ? "discarded" : "active"}
      variants={{
        discarded: {
          scale: 0.9,
          y: -30,
          background,
        },
        active: {
          y: index > 1 ? index * 5 : 0,
          scale: 1 - index * 0.12,
          background,
        },
      }}
      onPan={(_, info) => {
        if (index !== 0) return;
        x.set(currentX + xTransform(info.offset.x));
        rotateZ.set(currentRotateZ + info.offset.x * 0.05);
        rotateY.set(currentRotateY + info.offset.x * 0.1);
      }}
      onPanEnd={(_, info) => {
        const minVelocity = Math.abs(info.velocity.x) > 80;
        const minOffset = info.offset.x < -100;

        if (minVelocity && minOffset) {
          props.onClick(1);
        } else {
          animate(x, currentX, transition);
          animate(rotateZ, currentRotateZ, transition);
          animate(rotateY, currentRotateY, transition);
        }
      }}
      transition={transition}
      style={{ x, rotateZ, rotateY }}
      initial={{ y: 100, scale: 1 - index * 0.12 }}
      {...props}
    >
      <span>{value}</span>
    </_Card>
  );
};

const _Card = styled(motion.button, {
  position: "absolute",
  height: 350,
  width: 250,
  background: `linear-gradient(-45deg, ${colorEnd}, ${colorStart})`,
  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  borderRadius: 12,
  color: "$red11",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "10rem",
  fontFamily: "$serif",

  span: {
    transform: "translateY(8px)",
  },
});

const Background = () => {
  return (
    <Svg viewBox="0 0 100 100">
      {range(10).map((col) => {
        return range(10).map((row) => {
          return (
            <motion.g
              key={`${col}-${row}`}
              style={{ x: row * 10, y: col * 10 }}
            >
              <circle fill="var(--colors-gray9)" r="0.2" cx="5" cy="5" />
            </motion.g>
          );
        });
      })}
    </Svg>
  );
};

const Svg = styled("svg", {
  position: "absolute",
  inset: 0,
});
