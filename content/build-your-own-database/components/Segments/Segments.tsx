import React from "react";
import { styled } from "~/stitches.config";
import {
  Visualizer,
  Content,
  Controls,
  ToggleButton,
  UndoButton,
} from "~/components/Visualizer";
import { FileDatabase, type Record } from "../FileDatabase";
import { createRandomFileRecord } from "../utils";

const MAX_RECORDS = 4;
const INITIAL_RECORDS = [
  { value: [813, "amet, consectetur"] },
  { value: [301, "vel mauris"] },
  { value: [525, "dolor sit"] },
];

export const Segments = () => {
  const [records, setRecords] = React.useState(INITIAL_RECORDS);
  const [segmentRecords, setSegmentRecords] = React.useState<Record[]>([]);
  const [showSecondSegment, setShowSecondSegment] = React.useState(false);
  return (
    <Visualizer>
      <Content
        padding="md"
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "$4",
          height: 400,
        }}
        noOverflow
      >
        <_Segment layout records={records} />
        <_Segment
          layout
          records={segmentRecords}
          hidden={!showSecondSegment}
          onLayoutAnimationComplete={() => {
            if (showSecondSegment) {
              setSegmentRecords([createRandomFileRecord()]);
            }
          }}
        />
      </Content>
      <Controls>
        <ToggleButton
          onClick={() => {
            if (records.length < MAX_RECORDS) {
              setRecords([...records, createRandomFileRecord()]);
            } else if (showSecondSegment) {
              setSegmentRecords([...segmentRecords, createRandomFileRecord()]);
            } else {
              setShowSecondSegment(true);
            }
          }}
        >
          Add
        </ToggleButton>
        <UndoButton
          onClick={() => {
            setRecords(INITIAL_RECORDS);
            setSegmentRecords([]);
            setShowSecondSegment(false);
          }}
        />
      </Controls>
    </Visualizer>
  );
};

const _Segment = styled(FileDatabase, {
  height: 145,
  width: 300,
  position: "static",
  opacity: 1,
  transition: "opacity 0.2s",

  variants: {
    hidden: {
      true: {
        width: 250,
        minWidth: "auto",
        height: 120,
        position: "absolute",
        opacity: 0,
      },
    },
  },
});
