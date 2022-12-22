import React from "react";
import { motion } from "framer-motion";
import { styled } from "~/stitches.config";
import { type DatabaseRecord } from "../AppendOnlyFile/database";

export type Record = {
  value: DatabaseRecord;
  type?: "success" | "active" | "base";
};

type FileDatabaseProps = {
  records: Record[];
} & React.ComponentPropsWithoutRef<typeof Page>;

export const FileDatabase = ({ records, ...props }: FileDatabaseProps) => {
  return (
    <Page {...props}>
      {records.map(({ value, type }, index) => {
        const [dbKey, dbValue] = value;
        return (
          <Record
            key={`${index}-${dbKey}`}
            dbKey={dbKey}
            value={dbValue}
            type={type}
          />
        );
      })}
    </Page>
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
});

type RecordProps = {
  dbKey: number;
  value: string;
  type?: "active" | "success" | "base";
};

const Record = ({ dbKey, value, type = "base" }: RecordProps) => {
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
        layout
        variants={{
          active: {
            boxShadow: `var(--shadows-sm)`,
            backgroundColor: "var(--colors-gray2)",
            borderRadius: "var(--radii-base)",
            borderColor: "var(--colors-gray8)",
          },
          base: {
            boxShadow: "var(--shadows-hidden)",
            backgroundColor: mapTypeToColor[_type],
            borderRadius: 0,
            borderColor: mapTypeToColor[_type],
          },
        }}
        animate={active ? "active" : "base"}
        type={type}
      >
        <RecordKey layout>{String(dbKey).padStart(3, "0")}:</RecordKey>
        <motion.span layout>{value}</motion.span>
      </RecordWrapper>
    </motion.div>
  );
};

const RecordWrapper = styled(motion.li, {
  padding: "$1 $6",
  display: "flex",
  gap: "$2",
  border: "1px solid $gray3",

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

const RecordKey = styled(motion.span, {
  fontWeight: "bold",
});
