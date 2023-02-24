import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExperimentsPage,
  ExperimentWrapper,
} from "~/components/layout/ExperimentsPage";
import { styled } from "~/stitches.config";
import { range } from "~/lib/utils";
import { FaChevronLeft } from "react-icons/fa";

const NUM_INPUT_WIDTH = 120;
const GAP = 8;

const formatter = Intl.NumberFormat("en-US");

export default function FamilyInputPage() {
  const [number, setNumber] = React.useState("0");
  return (
    <ExperimentsPage page="family-input">
      <ExperimentWrapper
        css={{
          borderRadius: "$base",
          border: "1px solid $gray4",
          background: "$gray1",
          width: "fit-content",
        }}
      >
        <Box css={{ padding: "$4" }}>
          <Box css={{ margin: "$20 0" }}>
            <Amount amount={Number(number)} />
          </Box>
          <Box
            css={{
              width: NUM_INPUT_WIDTH * 3 + GAP * 2,
              display: "flex",
              gap: GAP,
              flexWrap: "wrap",
            }}
          >
            {range(9).map((i) => (
              <NumberButton key={i} onClick={() => setNumber(number + (i + 1))}>
                {i + 1}
              </NumberButton>
            ))}
            <NumberButton onClick={() => setNumber(number + ".")}>
              .
            </NumberButton>
            <NumberButton onClick={() => setNumber(number + 0)}>0</NumberButton>
            <NumberButton
              onClick={() => setNumber(number.slice(0, -1))}
              css={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "$lg",
              }}
            >
              <FaChevronLeft />
            </NumberButton>
          </Box>
        </Box>
      </ExperimentWrapper>
    </ExperimentsPage>
  );
}

const getKey = (formattedIndex: number, original: number) => {
  // we want to map the index of the formatted number to the index of the original number so that we can animate the correct number
  /**
   * the formatted version of 1234 is 1,234. Given the index (2) of the
   * formatted number, this function should return 3.
   */
  const formatted = formatter.format(original);
  if (formatted[formattedIndex] === ",") return `,-${formattedIndex}`;

  let index = 0;
  for (let i = 0; i < formattedIndex; i++) {
    if (formatted[i] === ",") continue;
    index++;
  }
  return index;
};

const Amount = ({ amount }: { amount: number }) => {
  const formatted = formatter.format(amount);
  return (
    <Box
      as="h1"
      css={{
        fontSize: "5rem",
        fontWeight: 800,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "$2 0",
      }}
    >
      <Box as={motion.span} layout css={{ fontSize: "3rem" }}>
        $
      </Box>
      <AnimatePresence mode="popLayout">
        {[...formatted].map((char, i) => {
          return (
            <Box
              css={{ lineHeight: 1 }}
              as={motion.span}
              key={char + getKey(i, amount)}
              layout
              animate={{
                y: 0,
                transition: { type: "spring", stiffness: 400, damping: 35 },
              }}
              exit={{
                y: i === 0 ? "-1.5em" : "1.5em",
                transition: { type: "spring", stiffness: 400, damping: 35 },
              }}
              initial={{ y: "1.5em" }}
            >
              {char}
            </Box>
          );
        })}
      </AnimatePresence>
    </Box>
  );
};

const Box = styled("div", {});

const NumberButton = styled("button", {
  width: NUM_INPUT_WIDTH,
  textAlign: "center",
  padding: "$4 0",
  fontSize: "$xl",
  fontWeight: "bold",
  borderRadius: 6,

  "&:hover": {
    background: "$gray2",
  },
});
