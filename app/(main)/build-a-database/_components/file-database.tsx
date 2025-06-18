import React from "react";
import { LayoutGroup, motion } from "framer-motion";
import { styled } from "~/stitches.config";
import { type DatabaseRecord } from "./database";

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
};

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
  recordAnimation = true,
  ...props
}: FileDatabaseProps) => {
  const id = React.useId();
  return (
    <LayoutGroup id={id}>
      <motion.ul
        className="font-mono text-sm rounded-t-md border border-b-0 border-gray8 bg-gray3 py-4 shadow-sm h-full min-w-[300px] leading-[1.1] relative"
        {...props}
      >
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
              animate={recordAnimation}
            />
          );
        })}
        {highlighted === undefined && (
          <HighlightDot layoutId="highlight" animate={{ opacity: 0 }} />
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
  return (
    <motion.div
      animate={animate && { y: 0 }}
      initial={animate && { y: 300 }}
      transition={{ type: "spring", damping: 20 }}
      onAnimationComplete={() => setActive(false)}
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
  ...props
}: RecordTextProps) => {
  return (
    <RecordWrapper {...props}>
      <motion.span
        className="font-medium"
        layout={animate ? "position" : false}
      >
        {String(dbKey).padStart(3, "0")}:
      </motion.span>
      <motion.span layout={animate ? "position" : false}>{dbValue}</motion.span>
      {children}
    </RecordWrapper>
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
  padding: "$1 $5",
  display: "flex",
  gap: "$2",
  border: "1px solid transparent",
  transition: "all 0.3s, transform 0s, opacity 0s",

  variants: {
    active: {
      true: {
        background: "$gray2",
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
