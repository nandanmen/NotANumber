import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { Content, ToggleButton, UndoButton } from "~/components/Visualizer";
import { styled } from "~/stitches.config";
import { Row } from "./Row";

const experiments = [
  "scrambled-text",
  "bezier-curves",
  "cards",
  "path-animation",
];

export function ExperimentsPage({ children, page }) {
  return (
    <Wrapper>
      <ContentWrapper>
        <Row as={NavWrapper} css={{ flexDirection: "column", gap: "$4" }}>
          <LinkWrapper>
            <Link href="/">
              <a>NaN</a>
            </Link>
          </LinkWrapper>
          <ExperimentsList>
            {experiments.map((experiment) => (
              <li key={experiment}>
                <Link href={`/experiments/${experiment}`} passHref>
                  <ExperimentItem active={page === experiment}>
                    {`${page === experiment ? ">" : ""} ${experiment}`}
                  </ExperimentItem>
                </Link>
              </li>
            ))}
          </ExperimentsList>
        </Row>
        {children}
      </ContentWrapper>
    </Wrapper>
  );
}

const ExperimentItem = styled("a", {
  color: "$gray11",
  variants: {
    active: {
      true: {
        color: "$gray12",
      },
    },
  },
});

const NavWrapper = styled("nav", {
  position: "fixed",
  top: "$8",
  left: "$8",
  color: "$gray11",

  a: {
    textDecoration: "none",
  },
});

const ExperimentsList = styled("ul", {
  fontFamily: "$mono",
  fontSize: "$sm",
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: "$2",
});

const LinkWrapper = styled("div", {
  fontFamily: "$serif",
  fontSize: "$xl",

  a: {
    color: "$gray11",
  },
});

// --

export const ExperimentWrapper = (
  props: React.ComponentPropsWithoutRef<typeof _ExperimentWrapper>
) => <_ExperimentWrapper layout {...props} />;

const _ExperimentWrapper = styled(motion.div, {
  background: "$gray4",
  width: 1000,
  margin: "0 auto",

  variants: {
    constrained: {
      false: {
        width: "auto",
      },
    },
  },
});

// --

export type ControlsProps = {
  debug: boolean;
  onDebugChange: (debug: boolean) => void;
  onReset: () => void;
  children: React.ReactNode;
};

export const Controls = ({ debug, onDebugChange, onReset, children }) => {
  return (
    <_Controls layout style={{ borderRadius: "12px" }}>
      <ControlHeader layout>
        <DebugButton
          layout
          onClick={() => onDebugChange(!debug)}
          secondary
          active={debug}
          css={{
            fontWeight: "bold",
            fontFamily: "$mono",
            color: "$gray10",
          }}
        >
          Debug
        </DebugButton>
        <UndoButton layout onClick={onReset} />
      </ControlHeader>
      {debug && <DebugControls>{children}</DebugControls>}
    </_Controls>
  );
};

export const DebugField = styled("div", {
  display: "flex",
  fontFamily: "$mono",
  color: "$gray11",
  fontWeight: "bold",
  alignItems: "center",
  justifyContent: "space-between",
});

const ControlHeader = styled(motion.div, {
  display: "flex",
  justifyContent: "space-between",
  gap: "$8",
});

const Wrapper = styled("div", {
  height: "100vh",
});

const ContentWrapper = styled(Content, {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "$16",
});

const _Controls = styled(motion.div, {
  border: "1px solid $gray8",
  boxShadow: "$md",
  background: "$gray3",
  margin: "$8 auto",
  padding: "$4",
});

const DebugControls = styled(motion.div, {
  minWidth: 300,
  background: "$gray5",
  padding: "$4",
  borderRadius: 4,
  borderTopLeftRadius: 0,
});

const DebugButton = styled(ToggleButton, {
  variants: {
    active: {
      true: {
        background: "$gray5",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
  },
});

export const DebugFieldButton = styled("button", {
  padding: "$1",
  borderRadius: 2,

  "&:hover": {
    background: "$gray8",
  },

  variants: {
    active: {
      true: {
        background: "$gray8",
      },
    },
  },
});
