import React from "react";
import { useMachine } from "@xstate/react";
import { motion } from "framer-motion";
import { useAlgorithm } from "~/lib/algorithm";
import {
  Visualizer,
  Content,
  Controls,
  PlayButton,
  UndoButton,
} from "~/components/Visualizer";
import { styled, darkTheme } from "~/stitches.config";
import {
  FileDatabase,
  Page,
  RecordWrapper,
  RecordKey,
  type Record,
} from "../FileDatabase";
import { MovingArrow } from "./MovingArrow";
import { machine } from "./machine";
import { compact } from "./compact";

const exampleRecords: Record[] = [
  {
    value: [1, "Lorem ipsum"],
  },
  {
    value: [12, "adipiscing elit."],
  },
  {
    value: [1, "null"],
  },
  {
    value: [18, "dolor sit"],
  },
  {
    value: [12, "Vestibulum varius"],
  },
  {
    value: [18, "vel mauris"],
  },
];

type CompactionState = {
  i: number;
  records: Record[];
  compactedRecords: Record[];
  key: number;
  value: string;
};

const Message = ({ record, compactedRecords }) => {
  if (!record) return null;

  const [key, value] = record.value;
  const duplicate = compactedRecords.findIndex(
    (record) => record.value[0] === key
  );
  const _key = String(key).padStart(3, "0");
  if (value === "null") {
    return (
      <>
        <RecordKey>{_key}</RecordKey> is a tombstone, skipping...
      </>
    );
  }
  if (duplicate >= 0) {
    const [_, duplicateValue] = compactedRecords[duplicate].value;
    if (duplicateValue === "null") {
      return (
        <>
          <RecordKey>{_key}</RecordKey> was deleted, skipping...
        </>
      );
    }
    return (
      <>
        <RecordKey>{_key}</RecordKey> is an old version, skipping...
      </>
    );
  }
  return (
    <>
      <RecordKey>{_key}</RecordKey> is a new key, adding to compacted list...
    </>
  );
};

export const SingleFileCompaction = () => {
  const [state, send] = useMachine(machine);
  const [algorithmState, ctx] = useAlgorithm<CompactionState>(
    compact,
    [exampleRecords],
    {
      delay: 1000,
      onDone: () => {
        send("done");
      },
    }
  );
  const visible = ["running", "ready", "paused", "done"].some(state.matches);
  const playing = state.matches("running");
  const showHighlight = ["running", "paused"].some(state.matches);

  React.useEffect(() => {
    if (playing) {
      ctx.play();
    } else {
      ctx.pause();
    }
    return () => {
      ctx.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const visibleRecords: Record[] = React.useMemo(() => {
    if (algorithmState.i < 1) {
      return [
        ...exampleRecords,
        { value: [14, "iaculis pharetra."] },
        { value: [6, "amet, consectetur"] },
      ];
    }
    if (algorithmState.i < 3) {
      return [...exampleRecords, { value: [14, "iaculis pharetra."] }];
    }
    return exampleRecords;
  }, [algorithmState.i]);

  const height = state.matches("done") ? 90 : visible ? 300 : 250;

  return (
    <Visualizer fullWidth>
      <Content
        css={{
          $$gap: "$space$32",
          display: "flex",
          flexDirection: "row-reverse",
          gap: "$$gap",
          justifyContent: "center",
          padding: "$12",
          position: "relative",
        }}
        noOverflow
      >
        <PageWrapper
          hidden={!visible}
          peek={state.matches("peek")}
          layout="position"
        >
          {state.matches("done") && <Background />}
          <CompactedPage
            animate={{ height }}
            transition={{ type: "spring", damping: 20 }}
            css={{ minHeight: "auto" }}
          >
            {algorithmState.compactedRecords
              .filter((record) => record.value[1] !== "null")
              .map(({ value: record }) => {
                const [key, value] = record;
                return (
                  <RecordWrapper
                    key={`compacted-${key}}`}
                    css={{
                      borderColor: "$blue4",
                      color: "$blue11",

                      [`.${darkTheme} &`]: {
                        borderColor: "$blueDark5",
                        color: "$blueDark11",
                      },
                    }}
                    animate={{ x: 0, opacity: 1 }}
                    initial={{ x: -16, opacity: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    layout
                  >
                    <RecordKey layout>{key}</RecordKey>
                    <motion.span layout>{value}</motion.span>
                  </RecordWrapper>
                );
              })}
          </CompactedPage>
        </PageWrapper>
        <FileDatabase
          records={visibleRecords}
          highlighted={showHighlight ? algorithmState.i : undefined}
          layout
          css={{
            position: "relative",
            marginRight: state.matches("peek") ? "$6" : 0,
            height: 300,
            minHeight: "auto",
          }}
        />
        <ArrowWrapper
          variants={{
            hidden: { x: -8, opacity: 0, transition: { type: false } },
            shown: {
              x: 0,
              opacity: 1,
              transition: { delay: 0.2, type: "spring", damping: 20 },
            },
          }}
          animate={visible ? "shown" : "hidden"}
        >
          <MovingArrow playing={playing} />
        </ArrowWrapper>
      </Content>
      <Controls css={{ alignItems: "center" }}>
        <PlayButton
          isPlaying={playing}
          onClick={() => (playing ? send("pause") : send("play"))}
          onHoverStart={() => send("hover")}
          onHoverEnd={() => send("hoverEnd")}
        />
        {state.matches("running") && (
          <MessageText
            key={exampleRecords[algorithmState.i]?.value.join("-")}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Message
              record={exampleRecords[algorithmState.i]}
              compactedRecords={algorithmState.compactedRecords}
            />
          </MessageText>
        )}
        <UndoButton
          onClick={() => {
            send("reset");
            ctx.reset();
          }}
        />
      </Controls>
    </Visualizer>
  );
};

const MessageText = styled(motion.p, {
  fontFamily: "$mono",
  fontSize: "$sm",
});

const PageWrapper = styled(motion.div, {
  position: "relative",
  height: 300,
  width: 300,
  marginLeft: 0,

  variants: {
    hidden: {
      true: {
        position: "absolute",
        top: "calc(50% - 125px)",
        height: 250,
      },
    },
    peek: {
      true: {
        marginLeft: "$6",
      },
    },
  },
});

const Background = styled("div", {
  $$color: "$colors$blue5",
  $$borderColor: "$colors$blue6",

  position: "absolute",
  background: `repeating-linear-gradient(-45deg, $$color, $$color 8px, transparent 8px, transparent 16px)`,
  border: "1px solid $$borderColor",
  borderRadius: "$base",
  inset: 0,

  [`.${darkTheme} &`]: {
    $$color: "$colors$blueDark5",
    $$borderColor: "$colors$blueDark6",
  },
});

const CompactedPage = styled(Page, {
  background: "$blue4",
  borderColor: "$blue9",
  borderStyle: "solid",
  overflow: "hidden",
  position: "relative",
  height: "100%",

  [`.${darkTheme} &`]: {
    background: "$blueDark5",
    borderColor: "$blueDark8",
  },
});

const ArrowWrapper = styled(motion.div, {
  position: "absolute",
  top: "$7",
});
