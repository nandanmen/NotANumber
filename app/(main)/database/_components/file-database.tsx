import React, { useEffect, useState } from "react";
import { LayoutGroup } from "framer-motion";
import { styled } from "~/stitches.config";
import { cn } from "~/lib/cn";
import type { DatabaseRecord } from "../_lib/use-file-database";
import { useIsPresent, motion, AnimatePresence } from "motion/react";

export type Record = {
  id?: string;
  value: DatabaseRecord;
  type?: "success" | "active" | "base";
  stale?: boolean;
};

type FileDatabaseProps = {
  records: Record[];
  highlighted?: number;
  recordAnimation?: boolean;
  children?: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof motion.ul>;

export const isStale = (record: DatabaseRecord, records: Record[] = []) => {
  if (record.value === "null") return true;
  const recordsWithKey = records
    .filter((_record) => _record.value.key === record.key)
    .map((_record) => _record.value);
  return recordsWithKey.at(-1) !== record;
};

export const FileDatabase = ({
  records,
  highlighted,
  children,
  className,
  ...props
}: FileDatabaseProps) => {
  const id = React.useId();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <LayoutGroup id={id}>
      <motion.ul
        className={cn(
          "bg-gray2 rounded-lg h-full ring-1 ring-neutral-950/15 mx-auto text-sm py-4 shadow-md font-mono",
          className,
        )}
        {...props}
      >
        <AnimatePresence>
          {records.map(({ id, value, type, stale }, index) => {
            const { key: dbKey, value: dbValue } = value;
            return (
              <Record
                key={id ?? `${index}-${dbKey}`}
                dbKey={dbKey}
                value={dbValue}
                type={type}
                highlighted={highlighted === index}
                stale={stale ?? isStale(value, records)}
                animate={animate}
              />
            );
          })}
        </AnimatePresence>
        {highlighted === undefined && (
          <HighlightDot
            layoutId="highlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
          />
        )}
        {children}
      </motion.ul>
    </LayoutGroup>
  );
};

type RecordProps = {
  dbKey: number;
  value: string;
  type?: "active" | "success" | "base";
  highlighted?: boolean;
  stale?: boolean;
  animate?: boolean;
};

const Record = ({
  dbKey,
  value,
  type = "base",
  highlighted = false,
  stale = false,
  animate = true,
}: RecordProps) => {
  const [active, setActive] = React.useState(animate);
  const isPresent = useIsPresent();
  return (
    <motion.div
      animate={animate && { y: 0 }}
      initial={animate && { y: 300 }}
      transition={{ type: "spring", damping: 20 }}
      exit={{ height: 0 }}
      onAnimationComplete={() => setActive(false)}
      className={cn(!isPresent && "bg-gray4 overflow-hidden")}
    >
      <RecordText
        animate={animate}
        active={active}
        type={type}
        highlighted={highlighted}
        stale={stale}
        dbKey={dbKey}
        dbValue={value}
      >
        {highlighted && <HighlightDot layoutId="highlight" />}
      </RecordText>
    </motion.div>
  );
};

type RecordTextProps = {
  dbKey: number;
  dbValue: string;
  animate: boolean;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof RecordWrapper>;

export const RecordText = ({
  children,
  dbKey,
  dbValue,
  animate,
  active,
  highlighted,
  stale,
  type,
  ...props
}: RecordTextProps) => {
  return (
    <motion.li
      className={cn(
        "flex gap-2 py-1 px-5 ring-1 ring-transparent relative",
        active &&
          "bg-gray1 shadow-md ring-neutral-950/15 py-4 px-8 -mx-4 rounded-lg",
        highlighted && "text-blue10",
        type === "active" && "bg-blue5 text-blue11",
        type === "success" && "bg-green5 text-green11",
        stale && "text-gray9",
        stale && type !== "base" && "bg-gray4",
      )}
      style={{
        transition: "all 0.3s, transform 0s, opacity 0s",
      }}
      {...props}
    >
      <span
        className="absolute inset-0 w-0 overflow-hidden text-nowrap file-highlight"
        data-key={dbKey}
      >
        <span className="px-5 bg-blue5 text-blue11 flex items-center h-full">
          {String(dbKey).padStart(3, "0")}: {dbValue}
        </span>
      </span>
      <motion.span
        className="font-medium"
        layout={animate ? "position" : false}
      >
        {String(dbKey).padStart(3, "0")}:
      </motion.span>
      <motion.span layout={animate ? "position" : false}>{dbValue}</motion.span>
      {children}
    </motion.li>
  );
};

const HighlightDot = styled(motion.span, {
  $$size: "6px",

  position: "absolute",
  width: "$$size",
  height: "$$size",
  borderRadius: "50%",
  background: "$blue9",
  right: "$6",
  top: "calc(50% - ($$size / 2))",
});

export const RecordWrapper = styled(motion.li, {
  padding: "2px $5",
  display: "flex",
  gap: "$2",
  border: "1px solid transparent",
  transition: "all 0.3s, transform 0s, opacity 0s",

  variants: {
    active: {
      true: {
        background: "$gray1",
        borderColor: "$gray8",
        borderRadius: "$base",
        padding: "$4 $8",
        boxShadow: "$sm",
        margin: "0 -$4",
      },
    },
    highlighted: {
      true: {
        position: "relative",
        color: "$blue10",
      },
    },
    stale: {
      true: {
        color: "$gray9",
      },
    },
    type: {
      active: {
        background: "$blue5",
        color: "$blue11",
        borderColor: "$blue5",
      },
      success: {
        background: "$green5",
        color: "$green11",
        borderColor: "$green5",
      },
      base: {},
    },
  },
});
