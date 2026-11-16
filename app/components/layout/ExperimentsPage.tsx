import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { Content, ToggleButton, UndoButton } from "~/components/Visualizer";
import { cn } from "~/lib/cn";
import { styled } from "~/stitches.config";
import { Row } from "./Row";

const experiments = [
  "scrambled-text",
  "bezier-curves",
  "cards",
  "path-animation",
  "heavy-square",
  "family-input",
  "safari-scroll",
];

export function ExperimentsPage({ children, page }) {
  return (
    <Wrapper>
      <Content className="flex h-full flex-col justify-center p-16">
        <Row as={NavWrapper} css={{ flexDirection: "column", gap: "$4" }}>
          <LinkWrapper>
            <Link href="/">NaN</Link>
          </LinkWrapper>
          <ExperimentsList>
            {experiments.map((experiment) => (
              <li key={experiment}>
                <ExperimentItem
                  href={`/experiments/${experiment}`}
                  active={page === experiment}
                >
                  {`${page === experiment ? ">" : ""} ${experiment}`}
                </ExperimentItem>
              </li>
            ))}
          </ExperimentsList>
        </Row>
        {children}
      </Content>
    </Wrapper>
  );
}

const ExperimentItem = styled(Link, {
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
  fontFamily: "var(--font-serif)",
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
        <ToggleButton
          layout
          onClick={() => onDebugChange(!debug)}
          secondary
          className={cn(
            "font-bold font-mono text-gray10",
            debug && "rounded-b-none bg-gray5",
          )}
        >
          Debug
        </ToggleButton>
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
