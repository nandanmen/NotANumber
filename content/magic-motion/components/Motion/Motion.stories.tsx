import React from "react";
import { Motion } from "./Motion";

import { styled } from "~/stitches.config";
import { GridBackground } from "~/components/Grid";

export const Default = () => {
  const [toggled, setToggled] = React.useState(false);
  return (
    <>
      <button onClick={() => setToggled(!toggled)}>Toggle</button>
      <GridBackground>
        <Wrapper toggled={toggled}>
          <Original />
          <Motion size={toggled ? 200 : 120} corrected={false} />
        </Wrapper>
      </GridBackground>
    </>
  );
};

export const Corrected = () => {
  const [toggled, setToggled] = React.useState(false);
  return (
    <>
      <button onClick={() => setToggled(!toggled)}>Toggle</button>
      <GridBackground>
        <Wrapper toggled={toggled}>
          <Original />
          <Motion size={toggled ? 200 : 120} />
        </Wrapper>
      </GridBackground>
    </>
  );
};

const Wrapper = styled("div", {
  padding: "$8",
  display: "flex",
  alignItems: "center",
  height: 300,

  variants: {
    toggled: {
      true: {
        justifyContent: "flex-end",
      },
    },
  },
});

const Original = styled("div", {
  position: "absolute",
  width: 120,
  height: 120,
  background: "$gray6",
  left: "$8",
});
