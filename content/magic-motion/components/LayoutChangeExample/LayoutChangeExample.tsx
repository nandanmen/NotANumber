import React from "react";
import { motion } from "framer-motion";

import {
  Content,
  Controls,
  Visualizer,
  ToggleButton,
} from "~/components/Visualizer";
import { FullWidth } from "~/components/FullWidth";
import { styled } from "~/stitches.config";

export const LayoutChangeExample = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <FullWidth>
      <Visualizer>
        <Content padding="md" css={{ height: 220 }}>
          <Wrapper>
            <Square />
            <Square active toggled={toggled} />
            <Square />
          </Wrapper>
        </Content>
        <Controls>
          <ToggleButton onClick={toggle}>Toggle</ToggleButton>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

export const JustifyContentExample = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <FullWidth>
      <Visualizer>
        <Content padding="md" css={{ height: 280 }}>
          <Wrapper column>
            <SubText>
              justify-content: {toggled ? "flex-end" : "flex-start"}
            </SubText>
            <JustifyWrapper toggled={toggled}>
              <Square active layout transition={{ duration: 0.5 }} />
              <Square active layout transition={{ duration: 0.5 }} />
            </JustifyWrapper>
          </Wrapper>
        </Content>
        <Controls>
          <ToggleButton onClick={toggle}>Toggle</ToggleButton>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

export const TransformExample = () => {
  const [toggled, toggle] = React.useReducer((state) => !state, false);

  return (
    <FullWidth>
      <Visualizer>
        <Content padding="md" css={{ height: 220 }}>
          <Wrapper>
            <Square />
            <TransformSquare active toggled={toggled} />
            <Square />
          </Wrapper>
        </Content>
        <Controls>
          <ToggleButton onClick={toggle}>Toggle</ToggleButton>
        </Controls>
      </Visualizer>
    </FullWidth>
  );
};

const SubText = styled("p", {
  fontFamily: "$mono",
  fontSize: "$sm",
});

const BaseSquare = styled(motion.div, {
  background: "$gray7",
  border: "1px solid $gray8",
  borderRadius: "$base",

  variants: {
    active: {
      true: {
        background: "$blue6",
        border: "1px solid $blue8",
        boxShadow: "$md",
      },
    },
  },
});

const JustifyWrapper = styled(BaseSquare, {
  padding: "$4",
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  gap: "$2",
  maxWidth: 400,

  variants: {
    toggled: {
      true: {
        justifyContent: "flex-end",
      },
    },
  },
});

const Wrapper = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  gap: "$4",

  variants: {
    column: {
      true: {
        flexDirection: "column",
      },
    },
  },
});

const TransformSquare = styled(BaseSquare, {
  height: 90,
  width: 90,
  transition: "transform 0.5s ease-out",
  transform: "scaleX(1)",

  variants: {
    toggled: {
      true: {
        transform: "scaleX(2)",
      },
    },
  },
});

const Square = styled(BaseSquare, {
  height: 90,
  width: 90,
  transition: "width 0.5s ease-out",

  variants: {
    toggled: {
      true: {
        width: 180,
      },
    },
  },
});
