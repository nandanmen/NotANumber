import React from "react";
import { useMachine } from "@xstate/react";
import { motion } from "framer-motion";
import { FullWidth } from "~/components/FullWidth";
import {
  Visualizer,
  Content,
  Controls,
  PlayButton,
  UndoButton,
} from "~/components/Visualizer";
import { styled } from "~/stitches.config";
import { FileDatabase, Page, type Record } from "../FileDatabase";
import { MovingArrow } from "./MovingArrow";
import { machine } from "./machine";

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

export const SingleFileCompaction = () => {
  const [state, send] = useMachine(machine);
  const visible = ["running", "ready"].some(state.matches);
  const playing = state.matches("running");

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
            alignItems: "center",
            padding: "$12",
          }}
          noOverflow
        >
          <CompactedPage
            layout
            hidden={!visible}
            peek={state.matches("peek")}
          />
          <FileDatabase
            records={exampleRecords}
            layout
            css={{
              position: "relative",
              marginRight: state.matches("peek") ? "$6" : 0,
            }}
          />
          <ArrowWrapper
            style={{ y: "-50%" }}
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
            onClick={() => (playing ? send("stop") : send("play"))}
            onHoverStart={() => send("hover")}
            onHoverEnd={() => send("hoverEnd")}
          />
          <UndoButton onClick={() => send("reset")} />
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const CompactedPage = styled(Page, {
  background: "$blue4",
  border: "1px solid $blue9",
  marginLeft: 0,

  variants: {
    hidden: {
      true: {
        position: "absolute",
        height: 350,
      },
    },
    peek: {
      true: {
        marginLeft: "$6",
      },
    },
  },
});

const ArrowWrapper = styled(motion.div, {
  position: "absolute",
  top: "50%",
});
