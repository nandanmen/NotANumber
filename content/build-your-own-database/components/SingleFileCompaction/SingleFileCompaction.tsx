import React from "react";
import { useMachine } from "@xstate/react";
import { motion, useAnimationControls } from "framer-motion";
import { useAlgorithm } from "~/lib/algorithm";
import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  PlayButton,
  UndoButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";
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

export const SingleFileCompaction = () => {
  const [state, send] = useMachine(machine);
  const controls = useAnimationControls();
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

  React.useEffect(() => {
    if (state.matches("done")) {
      controls.start({
        height: 90,
      });
    } else {
      controls.start({ height: visible ? 300 : 250 });
    }
  }, [state, visible, controls]);

  return (
    <FullWidth>
      <Visualizer>
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
              animate={controls}
              transition={{ type: "spring", damping: 20 }}
            >
              {algorithmState.compactedRecords
                .filter((record) => record.value[1] !== "null")
                .map(({ value: record }) => {
                  const [key, value] = record;
                  return (
                    <RecordWrapper
                      key={`compacted-${key}}`}
                      css={{ borderColor: "$blue4", color: "$blue11" }}
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
            records={exampleRecords}
            highlighted={showHighlight ? algorithmState.i : undefined}
            layout
            css={{
              position: "relative",
              marginRight: state.matches("peek") ? "$6" : 0,
              height: 300,
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
        <Controls>
          <PlayButton
            isPlaying={playing}
            onClick={() => (playing ? send("pause") : send("play"))}
            onHoverStart={() => send("hover")}
            onHoverEnd={() => send("hoverEnd")}
          />
          <UndoButton
            onClick={() => {
              send("reset");
              ctx.reset();
            }}
          />
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

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
  position: "absolute",
  background: `repeating-linear-gradient(-45deg, $colors$blue5, $colors$blue5 8px, transparent 8px, transparent 16px)`,
  border: "1px solid $blue6",
  borderRadius: "$base",
  inset: 0,
});

const CompactedPage = styled(Page, {
  background: "$blue4",
  borderColor: "$blue9",
  borderStyle: "solid",
  overflow: "hidden",
  position: "relative",
  height: "100%",
});

const ArrowWrapper = styled(motion.div, {
  position: "absolute",
  top: "$7",
});
