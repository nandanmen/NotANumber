"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";
import { FaArrowRight } from "react-icons/fa";

import { GridOverflowBox } from "~/components/Grid";

const phases = ["Tokenize", "Parse", "Transform", "Generate"];

export const Pipeline = () => {
  return (
    <GridOverflowBox>
      <ul
        className="grid list-none items-center gap-2"
        style={{
          gridTemplateColumns: "repeat(4, 1rem 1fr) 1rem",
        }}
      >
        {phases.map((phase) => (
          <Fragment key={phase}>
            <li className="flex items-center text-gray11">
              <FaArrowRight />
            </li>
            <motion.li
              className="rounded-md border border-gray8 bg-gray2 p-3 text-center font-mono text-sm"
              layout
            >
              {phase}
            </motion.li>
          </Fragment>
        ))}
        <li className="flex items-center text-gray11">
          <FaArrowRight />
        </li>
      </ul>
    </GridOverflowBox>
  );
};
