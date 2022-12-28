import React from "react";
import { motion } from "framer-motion";
import {
  Visualizer,
  Content,
  Controls,
  ToggleButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";
import { FullWidth } from "~/components/FullWidth";

import { FileDatabase, FileDatabaseWrapper } from "../FileDatabase";

import {
  useFileDatabase,
  type DatabaseRecord,
  type DatabaseCommand,
} from "./database";

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

const commandArgs = (command: DatabaseCommand) => {
  switch (command.type) {
    case "set":
      return `${command.key} "${command.value}"`;
    case "get":
    case "delete":
      return `${command.key}`;
  }
};

const randomUnique = (min: number, max: number, exclude: number[]) => {
  let number = random(min, max);
  while (exclude.includes(number)) {
    number = random(min, max);
  }
  return number;
};

type Mode = "add" | "update" | "delete" | "search";

type AppendOnlyFileProps = {
  mode?: "all" | Mode[];
  initialData?: Array<DatabaseRecord>;
};

const defaultData: DatabaseRecord[] = [
  [1, "Lorem ipsum"],
  [18, "dolor sit"],
];

function pick<DataType>(array: DataType[], exclude: Set<DataType>): DataType {
  let item = array[random(0, array.length - 1)];
  while (exclude.has(item)) {
    item = array[random(0, array.length - 1)];
  }
  return item;
}

export const AppendOnlyFile = ({
  mode = "all",
  initialData = defaultData,
}: AppendOnlyFileProps) => {
  const db = useFileDatabase(initialData);
  const { key, currentIndex, found } = db.search;
  const currentRecord = db.records[currentIndex];

  const getRandomKey = () => {
    const deleted = new Set(
      db.records
        .filter((record) => record[1] === "null")
        .map((record) => record[0])
    );
    return pick(
      db.records.map((record) => record[0]),
      deleted
    );
  };

  const addRecord = () => {
    const key = db.records.length + 1;
    db.set(
      randomUnique(
        0,
        20,
        db.records.map((record) => record[0])
      ),
      texts[(key - 1) % texts.length]
    );
  };

  const updateRecord = () => {
    const value = texts[random(0, texts.length - 1)];
    db.set(getRandomKey(), value);
  };

  const deleteRecord = () => {
    db.delete(getRandomKey());
  };

  const showButton = (type: Mode) => {
    if (mode === "all") return true;
    if (Array.isArray(mode)) return mode.includes(type);
    return false;
  };

  return (
    <FullWidth>
      <Visualizer row css={{ flexWrap: "wrap-reverse" }}>
        <Aside>
          <Commands>
            {db.commands.map((command, index) => (
              <motion.li
                key={index}
                animate={{ y: 0, opacity: 1 }}
                initial={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
              >
                {command.type === "result" ? (
                  command.value
                ) : (
                  <>
                    <span>{`$ db `}</span>
                    <CommandType>{command.type}</CommandType>
                    <span>{` ${commandArgs(command)}`}</span>
                  </>
                )}
              </motion.li>
            ))}
          </Commands>
          <Controls css={{ justifyContent: "center", gap: "$2" }}>
            {showButton("add") && (
              <ToggleButton onClick={addRecord}>Add</ToggleButton>
            )}
            {showButton("update") && (
              <ToggleButton onClick={updateRecord} disabled={db.size() === 0}>
                Update
              </ToggleButton>
            )}
            {showButton("delete") && (
              <ToggleButton onClick={deleteRecord} disabled={db.size() === 0}>
                Delete
              </ToggleButton>
            )}
            {showButton("search") && (
              <ToggleButton
                onClick={() => db.get(getRandomKey())}
                disabled={db.size() === 0}
              >
                Search
              </ToggleButton>
            )}
          </Controls>
        </Aside>
        <FileDatabaseWrapper
          as={Content}
          noOverflow
          padding="lg"
          css={{
            flex: 3,
            flexBasis: 375,
          }}
        >
          <FileDatabase
            records={db.records.map(([dbKey, value], index) => {
              let type: "active" | "success" | "base" = "base";
              if (currentIndex === index) {
                type = key === dbKey ? "success" : "active";
              }
              return {
                value: [dbKey, value],
                type,
              };
            })}
          />
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
        </FileDatabaseWrapper>
      </Visualizer>
    </FullWidth>
  );
};

const Aside = styled("aside", {
  display: "flex",
  flexDirection: "column",
  flex: 2,
  flexBasis: 250,
});

const CommandType = styled("span", {
  fontWeight: "bold",
  color: "$blue10",
});

const Commands = styled("ul", {
  height: "100%",
  borderBottom: "1px solid $gray8",
  fontFamily: "$mono",
  fontSize: "$sm",
  padding: "$6",
  listStyle: "none",
  lineHeight: 1.6,
});

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