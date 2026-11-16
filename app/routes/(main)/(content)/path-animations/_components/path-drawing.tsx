"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { PathParts } from "./path-parts";
import { useActiveIndex } from "~/components/mdx/scroll-group";

const d = "M4 20C4 20 4 4 7 4C9 4 9 11 11.5 11C14 11 15 6.7 20 8";

export function PathDrawing() {
  const id = useId();
  const index = useActiveIndex();
  return (
    <div className="p-8">
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <defs>
          <pattern
            id={id}
            width="4"
            height="4"
            viewBox="0 0 10 10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 10 h10 v-10"
              className="stroke-gray8"
              fill="none"
              strokeWidth="0.1"
            />
          </pattern>
          <mask id={`${id}mask`}>
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            <path
              d={d}
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeWidth="2"
            />
          </mask>
        </defs>
        <rect
          className="stroke-gray8"
          strokeWidth="0.1"
          width="100%"
          height="100%"
          fill={`url(#${id})`}
        />
        <motion.path
          d={d}
          animate={{ opacity: index > 1 ? 0.3 : index > 0 ? 1 : 0 }}
        />
        <path
          d={d}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeWidth="2"
          strokeOpacity="0.1"
        />
        <motion.path
          d="M22 8.5L20 8C15 6.7 14 11 11.5 11C9 11 9 4 7 4C4 4 4 20 4 20V22.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="39.6"
          strokeDashoffset="-39.6"
          animate={{ strokeDashoffset: index > 1 ? 0 : -39.6 }}
          transition={{ type: "spring", duration: 2, bounce: 0 }}
          mask={`url(#${id}mask)`}
        />

        {/* <motion.path
          d={d}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeWidth="2"
          strokeDasharray="5"
          strokeDashoffset="4"
          // animate={{ strokeDashoffset: index > 1 ? 0 : 36 }}
          transition={{ type: "spring", duration: 2, bounce: 0 }}
        /> */}
        <PathParts d={d} animate />
      </svg>
    </div>
  );
}
