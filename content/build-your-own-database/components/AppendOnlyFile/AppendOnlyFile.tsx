import React from "react";
import { motion } from "framer-motion";
import {
  Visualizer,
  Content,
  Controls,
  ToggleButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";
import useInterval from "@use-it/interval";

const ipsum =
  "dolor sit amet, consectetur adipiscing elit. Vestibulum varius vel mauris iaculis pharetra.".split(
    " "
  );

const texts = [];
for (let i = 0; i < ipsum.length; i += 2) {
  texts.push(`${ipsum[i]} ${ipsum[i + 1]}`);
}

// get a random number within bounds
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const AppendOnlyFile = () => {
  const [records, setRecords] = React.useState([
    ["001", "Lorem ipsum"],
    ["002", "dolor sit"],
  ]);
  const [searching, setSearching] = React.useState(false);
  const [{ key, currentIndex }, setSearch] = React.useState({
    key: null,
    currentIndex: null,
  });

  const addRecord = () => {
    const key = records.length + 1;
    const newRecord = [
      `${key}`.padStart(3, "0"),
      texts[(key - 1) % texts.length],
    ];
    setRecords([...records, newRecord]);
  };

  const currentRecord = records[currentIndex];
  const found = currentRecord && currentRecord[0] === key;

  useInterval(
    () => {
      const currentRecord = records[currentIndex];
      // Either we found the key or we're out of bounds
      if (!currentRecord || found) {
        setSearching(false);
      } else {
        setSearch({ key, currentIndex: currentIndex + 1 });
      }
    },
    searching ? 500 : null
  );

  return (
    <figure>
      <Visualizer>
        <Controls css={{ justifyContent: "center", gap: "$2" }}>
          <ToggleButton onClick={addRecord}>Add</ToggleButton>
          <ToggleButton
            onClick={() => {
              setSearching(true);
              setSearch({
                key: `${random(1, 10)}`.padStart(3, "0"),
                currentIndex: 0,
              });
            }}
          >
            Search
          </ToggleButton>
        </Controls>
        <Content
          padding="lg"
          css={{
            display: "flex",
            justifyContent: "center",
            height: 400,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Page>
            {records.map(([dbKey, value], index) => (
              <Record
                key={dbKey}
                dbKey={dbKey}
                value={value}
                search={{ key, currentIndex }}
                index={index}
              />
            ))}
          </Page>
          {key !== null && (
            <Caption
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              {found ? (
                <>
                  Found key <strong>{key}</strong> with value "
                  <em>{currentRecord[1]}</em>"
                </>
              ) : (
                <>
                  Searching for key <strong>{key}</strong>...
                </>
              )}
            </Caption>
          )}
        </Content>
      </Visualizer>
    </figure>
  );
};

const Caption = styled(motion.div, {
  position: "absolute",
  background: "$gray4",
  padding: "$3",
  width: "100%",
  bottom: 0,
  borderTop: "1px solid $gray8",
  fontFamily: "$mono",
  fontSize: "0.75rem",
  textAlign: "center",
  color: "$gray11",
});

const Page = styled("ul", {
  borderRadius: "$base",
  border: "1px solid $gray8",
  background: "$gray3",
  padding: "$4 0",
  boxShadow: "$sm",
  height: 400,
  minWidth: 300,
  fontFamily: "$mono",
});

type RecordProps = {
  dbKey: string;
  value: string;
  search: {
    key: string | null;
    currentIndex: number | null;
  };
  index: number;
};

const Record = ({ dbKey, value, search, index }: RecordProps) => {
  const [active, setActive] = React.useState(true);

  const { key, currentIndex } = search;
  let type: "found" | "searching" | "base" = "base";
  if (currentIndex === index && !active) {
    type = key === dbKey ? "found" : "searching";
  }

  const mapTypeToColor = {
    searching: "var(--colors-blue5)",
    found: "var(--colors-green5)",
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
            backgroundColor: mapTypeToColor[type ?? "base"],
            borderRadius: 0,
            borderColor: mapTypeToColor[type ?? "base"],
          },
        }}
        animate={active ? "active" : "base"}
        type={type}
      >
        <RecordKey layout>{dbKey}:</RecordKey>
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
      searching: {
        background: "$blue5",
        color: "$blue11",
        borderColor: "$blue5",
      },
      found: {
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
