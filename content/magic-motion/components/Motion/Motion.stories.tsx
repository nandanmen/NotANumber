import React from "react";
import { Motion } from "./Motion";

import { styled } from "~/stitches.config";
import { GridBackground } from "~/components/Grid";

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

export const NaiveScaleCorrection = () => {
  const [toggled, setToggled] = React.useState(false);
  return (
    <>
      <button onClick={() => setToggled(!toggled)}>Toggle</button>
      <GridBackground>
        <Wrapper center>
          <Motion
            css={
              toggled
                ? { width: "100%", height: 200 }
                : { width: 120, height: 120 }
            }
            scaleCorrection="naive"
          >
            Hello
          </Motion>
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
    center: {
      true: {
        justifyContent: "center",
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
