import React from "react";
import { LayoutGroup, motion } from "framer-motion";
import { styled, darkTheme } from "~/stitches.config";
import { type DatabaseRecord } from "../AppendOnlyFile/database";

export type Record = {
  id?: string;
  value: DatabaseRecord;
  type?: "success" | "active" | "base";
};

type FileDatabaseProps = {
  records: Record[];
  highlighted?: number;
} & React.ComponentPropsWithoutRef<typeof Page>;

const isStale = (record: DatabaseRecord, records: Record[] = []) => {
  const recordsWithKey = records
    .filter((_record) => _record.value[0] === record[0])
    .map((_record) => _record.value);
  return recordsWithKey.at(-1) !== record;
};

export const FileDatabase = ({
  records,
  highlighted,
  children,
  ...props
}: FileDatabaseProps) => {
  const id = React.useId();
  return (
    <LayoutGroup id={id}>
      <Page {...props}>
        {records.map(({ id, value, type }, index) => {
          const [dbKey, dbValue] = value;
          return (
            <Record
              key={id ?? `${index}-${dbKey}`}
              dbKey={dbKey}
              value={dbValue}
              type={type}
              highlighted={highlighted === index}
              stale={isStale(value, records)}
            />
          );
        })}
        {highlighted === undefined && (
          <HighlightDot layoutId="highlight" animate={{ opacity: 0 }} />
        )}
        {children}
      </Page>
    </LayoutGroup>
  );
};

export const FileDatabaseWrapper = styled("div", {
  display: "flex",
  justifyContent: "center",
  height: 400,
  overflow: "hidden",
  position: "relative",
});

export const Page = styled(motion.ul, {
  borderRadius: "$base",
  border: "1px solid $gray8",
  background: "$gray3",
  padding: "$4 0",
  boxShadow: "$sm",
  height: 400,
  minWidth: 300,
  fontFamily: "$mono",
  lineHeight: 1.1,
  position: "relative",

  [`.${darkTheme} &`]: {
    border: "1px solid $gray6",
  },
});

type RecordProps = {
  dbKey: number;
  value: string;
  type?: "active" | "success" | "base";
  highlighted?: boolean;
  stale?: boolean;
};

const Record = ({
  dbKey,
  value,
  type = "base",
  highlighted = false,
  stale = false,
}: RecordProps) => {
  const [active, setActive] = React.useState(true);

  const _type = active ? "base" : type;
  const mapTypeToColor = {
    active: "var(--colors-blue5)",
    success: "var(--colors-green5)",
    base: "var(--colors-gray3)",
  };

  return (
    <motion.div
      animate={{ y: 0 }}
      initial={{ y: 300 }}
      transition={{ type: "spring", damping: 20 }}
      onAnimationComplete={() => setActive(false)}
    >
      <RecordWrapper
        active={active}
        transition={{ type: "spring", damping: 20 }}
        layout
        type={type}
        highlighted={highlighted}
        stale={stale}
      >
        <RecordKey layout>{String(dbKey).padStart(3, "0")}:</RecordKey>
        <motion.span layout>{value}</motion.span>
        {highlighted && <HighlightDot layoutId="highlight" />}
      </RecordWrapper>
    </motion.div>
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
  padding: "$1 $6",
  display: "flex",
  gap: "$2",
  border: "1px solid $gray3",
  transition: "all 0.3s",

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

        [`.${darkTheme} &`]: {
          background: "$blueDark5",
          color: "$blueDark11",
          borderColor: "$blueDark5",
        },
      },
      success: {
        background: "$green5",
        color: "$green11",
        borderColor: "$green5",

        [`.${darkTheme} &`]: {
          background: "$greenDark5",
          color: "$greenDark11",
          borderColor: "$greenDark5",
        },
      },
      base: {},
    },
  },
});

export const RecordKey = styled(motion.span, {
  fontWeight: "bold",
});
