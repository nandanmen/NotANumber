"use client";

import { motion } from "framer-motion";
import React from "react";

import { GridOverflowBox } from "~/components/Grid";
import { cn } from "~/lib/cn";

const tokens = [
  [
    { type: "keyword", value: "function" },
    { type: "identifier", value: "hello" },
    { type: "left-paren", value: "(" },
    { type: "right-paren", value: ")" },
    { type: "left-curly", value: "{" },
  ],
  [
    { type: "identifier", value: "console" },
    { type: "dot", value: "." },
    { type: "identifier", value: "log" },
    { type: "left-paren", value: "(" },
    { type: "string", value: "hello, world!" },
    { type: "right-paren", value: ")" },
  ],
  [{ type: "right-curly", value: "}" }],
] as const;

const singleCharacterTokens = [
  "left-paren",
  "right-paren",
  "left-curly",
  "right-curly",
  "dot",
];

type VisualType =
  | "keyword"
  | "identifier"
  | "string"
  | "single-character"
  | "hidden"
  | undefined;

export const TokenList = ({
  type,
  hideTypes = false,
  toggleable = false,
}: {
  type?: string[];
  hideTypes?: boolean;
  toggleable?: boolean;
}) => {
  const [showTypes, toggle] = React.useReducer((state) => !state, true);

  const getTokenType = (tokenType: string): VisualType => {
    const visualType = singleCharacterTokens.includes(tokenType)
      ? "single-character"
      : tokenType;

    if (hideTypes) return undefined;
    if (!type) return visualType as VisualType;
    return type.includes(visualType) ? (visualType as VisualType) : "hidden";
  };

  return (
    <GridOverflowBox>
      {toggleable && (
        <motion.button
          type="button"
          className="absolute left-0 top-0 cursor-pointer rounded p-1 px-2 text-sm font-bold text-gray11 hover:bg-gray7"
          layout
          onClick={toggle}
        >
          {showTypes ? "Hide types" : "Show types"}
        </motion.button>
      )}
      <div className="font-mono">
        {tokens.map((row, index) => (
          <ul
            // biome-ignore lint/suspicious/noArrayIndexKey: static diagram rows; order never changes
            key={`token-list-${index}`}
            className={cn(
              "mb-2 flex list-none items-end gap-2 last:mb-0",
              index === 1 && "ml-8",
            )}
          >
            {row.map((token) => {
              const vt = getTokenType(token.type);
              const active = vt && vt !== "hidden";
              return (
                <div key={`${token.type}-${index}-${token.value}`}>
                  {active && showTypes && (
                    <motion.p
                      className={cn(
                        "text-sm text-gray11",
                        vt === "keyword" && "text-red10",
                        vt === "identifier" && "text-blue10",
                        vt === "string" && "text-green10",
                        vt === "single-character" && "text-gray11",
                      )}
                      animate={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {token.type}
                    </motion.p>
                  )}
                  <motion.li
                    layout
                    className={cn(
                      "w-fit whitespace-nowrap rounded border border-gray8 bg-gray2 p-1 px-2",
                      vt === "keyword" && "border-red8 bg-red7",
                      vt === "identifier" && "border-blue8 bg-blue8",
                      vt === "single-character" && "bg-gray6",
                      vt === "string" && "border-green8 bg-green7",
                      vt === "hidden" && "border-gray7 bg-gray4 text-gray8",
                    )}
                  >
                    {token.value}
                  </motion.li>
                </div>
              );
            })}
          </ul>
        ))}
      </div>
    </GridOverflowBox>
  );
};
