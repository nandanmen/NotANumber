import React from "react";
import { motion } from "framer-motion";
import {
  ExperimentsPage,
  ExperimentWrapper,
} from "~/components/layout/ExperimentsPage";
import { useHighlighter } from "~/lib/highlighter";
import { styled } from "~/stitches.config";
import { FaArrowRight } from "react-icons/fa";

const paths = {
  square: "M25,25 h150 v50 h-150 z",
  infinity: "M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z",
};

export default function PathAnimationPage() {
  const highlighter = useHighlighter();
  const [path, setPath] = React.useState(
    "M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"
  );
  const highlightedCode = highlighter?.codeToHtml(
    `<circle r="3" fill="currentColor">
  <animateMotion
    dur="8s"
    repeatCount="indefinite"
    path="${path}"
  />
</circle>`,
    { lang: "html" }
  );
  return (
    <ExperimentsPage page="path-animation">
      <ExperimentWrapper
        css={{
          border: "1px solid $gray8",
          borderRadius: "$base",
          width: 700,
          background: "$gray2",
          position: "relative",
        }}
      >
        <ButtonWrapper>
          {Object.entries(paths).map(([name, _path]) => (
            <Button
              onClick={() => setPath(_path)}
              key={name}
              active={path === _path}
            >
              <span>{name}</span>
            </Button>
          ))}
          <Button
            as="a"
            css={{ gap: "$1", alignItems: "center", marginLeft: "auto" }}
            href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateMotion"
            target="_blank"
            rel="noreferrer"
            link
          >
            <span>MDN</span>
            <motion.span style={{ rotate: -45 }}>
              <FaArrowRight />
            </motion.span>
          </Button>
        </ButtonWrapper>
        <CodeWrapper dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        <svg viewBox="0 0 200 100">
          <Path d={path} fill="none" />
          <Group>
            <circle r="3" fill="currentColor" />
            <circle r="4" stroke="currentColor" fill="none" />
            <animateMotion dur="8s" repeatCount="indefinite" path={path} />
          </Group>
        </svg>
      </ExperimentWrapper>
    </ExperimentsPage>
  );
}

const Button = styled("button", {
  padding: "$1 $2",
  border: "1px solid $gray8",
  background: "$gray1",
  borderRadius: "$base",
  fontSize: "$sm",
  fontFamily: "$mono",
  display: "flex",

  "&:hover": {
    background: "$gray3",
  },

  variants: {
    active: {
      true: {
        background: "$gray4",
      },
    },
    link: {
      true: {
        color: "$blue6",
        textDecoration: "none",
      },
    },
  },
});

const ButtonWrapper = styled("div", {
  position: "absolute",
  top: "-$10",
  display: "flex",
  gap: "$2",
  width: "100%",
});

const CodeWrapper = styled("div", {
  padding: "$8",
  borderBottom: "1px dashed $gray8",
  pre: {
    background: "none !important",
  },
});

const Path = styled("path", {
  fill: "none",
  stroke: "$gray8",
  strokeDasharray: "3 2",
});

const Group = styled("g", {
  color: "$red9",
});
