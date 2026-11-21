import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExperimentsPage,
  ExperimentWrapper,
} from "~/components/layout/ExperimentsPage";
import { cn } from "~/lib/cn";
import { range } from "~/lib/utils";
import { FaChevronLeft } from "react-icons/fa";

const NUM_INPUT_WIDTH = 120;
const GAP = 8;

const formatter = Intl.NumberFormat("en-US");

export default function FamilyInputPage() {
  const [number, setNumber] = React.useState("0");
  return (
    <ExperimentsPage page="family-input">
      <ExperimentWrapper className="w-fit rounded-md border border-gray4 bg-gray1">
        <div className="p-4">
          <div className="my-20">
            <Amount amount={Number(number)} />
          </div>
          <div
            className="flex flex-wrap"
            style={{ width: NUM_INPUT_WIDTH * 3 + GAP * 2, gap: GAP }}
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
              className="flex items-center justify-center text-[1.25rem]"
            >
              <FaChevronLeft />
            </NumberButton>
          </div>
        </div>
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
    <h1 className="relative flex items-start justify-center overflow-hidden py-2 text-[5rem] font-extrabold">
      <motion.span layout className="text-[3rem]">
        $
      </motion.span>
      <AnimatePresence mode="popLayout">
        {[...formatted].map((char, i) => {
          return (
            <motion.span
              className="leading-none"
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
            </motion.span>
          );
        })}
      </AnimatePresence>
    </h1>
  );
};

const NumberButton = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) => (
  <button
    type="button"
    className={cn(
      "rounded-[6px] py-4 text-center text-[1.5rem] font-bold hover:bg-gray2",
      className,
    )}
    style={{ width: NUM_INPUT_WIDTH }}
    {...props}
  />
);
