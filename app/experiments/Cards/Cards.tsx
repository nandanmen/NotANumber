import React from "react";
import { v4 } from "uuid";
import { motion } from "framer-motion";
import { range } from "~/lib/utils";
import { cn } from "~/lib/cn";
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
  const wrapperRef = React.useRef(null);
  const [showOverflow, setShowOverflow] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [data, setData] = React.useState(() =>
    range(5).map((value) => ({ id: v4(), value })),
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
    <div className="mx-auto flex w-[700px] flex-col gap-6 font-mono text-gray11">
      <Checkbox
        label="Show overflow"
        checked={showOverflow}
        onCheckedChange={() => setShowOverflow(!showOverflow)}
      />
      <div
        className={cn(
          "relative flex aspect-square w-full items-center justify-center rounded-xl border border-gray6 bg-gray1",
          !showOverflow && "overflow-hidden",
        )}
        ref={wrapperRef}
      >
        <Background />
        {mapReverse([...discarded, ...data], (item, index) => {
          const isDiscarded = discarded.includes(item);
          if (isDiscarded) {
            return (
              <Card
                speed={speed}
                key={item.id}
                value={item.value}
                index={index}
                discarded
                lastIndex={index}
              />
            );
          }
          const dataIndex = data.findIndex((_item) => _item.id === item.id);
          const isFirst = dataIndex === 0;
          return (
            <Card
              speed={speed}
              key={item.id}
              value={item.value}
              index={dataIndex}
              lastIndex={index}
              onClick={() => rotate(dataIndex)}
              drag={isFirst}
              dragConstraints={wrapperRef}
            />
          );
        })}
      </div>
      <div>
        <div className="flex gap-2">
          {speeds.map((_speed) => (
            <button
              type="button"
              key={_speed}
              className={cn(
                "hover:text-gray12",
                _speed === speed && "font-bold text-gray12",
              )}
              onClick={() => setSpeed(_speed)}
            >
              {_speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({
  index,
  value,
  discarded = false,
  lastIndex = index,
  speed,
  ...props
}) => {
  const background = `linear-gradient(-45deg, ${darken(
    colorEnd,
    index * 12,
  )}, ${darken(colorStart, index * 12)})`;
  return (
    <motion.button
      className="absolute flex h-[350px] w-[250px] items-center justify-center rounded-xl bg-[linear-gradient(-45deg,var(--color-red11),var(--color-red6))] font-serif text-[10rem] text-red11 shadow-[0_25px_50px_-12px_rgb(0_0_0/0.25)]"
      animate={discarded ? "discarded" : "active"}
      variants={{
        discarded: {
          x: -600,
          rotateZ: -90,
          rotateY: index * 5,
          scale: 0.9,
          y: -30,
          background,
        },
        active: {
          x: index * 20 + index * 30,
          y: index > 1 ? index * 5 : 0,
          rotateZ: index * 5,
          rotateY: index * 5,
          scale: 1 - index * 0.12,
          background,
        },
      }}
      transition={{
        type: "spring",
        damping: 70,
        stiffness: 600 * speed,
        delay: lastIndex * (0.05 / speed),
      }}
      initial={{ x: 500, y: 100, scale: 1 - index * 0.12 }}
      {...props}
    >
      <span className="translate-y-2">{value}</span>
    </motion.button>
  );
};

const Background = () => {
  return (
    <svg className="absolute inset-0" viewBox="0 0 100 100">
      {range(10).map((col) => {
        return range(10).map((row) => {
          return (
            <motion.g
              key={`${col}-${row}`}
              style={{ x: row * 10, y: col * 10 }}
            >
              <circle fill="var(--color-gray9)" r="0.2" cx="5" cy="5" />
            </motion.g>
          );
        });
      })}
    </svg>
  );
};
