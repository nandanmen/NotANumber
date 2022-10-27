import React from "react";
import { motion } from "framer-motion";

import { GridOverflowBox } from "~/components/Grid";
import { styled } from "~/stitches.config";

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

export const TokenList = ({ type, hideTypes = false, toggleable = false }) => {
  const [showTypes, toggle] = React.useReducer((state) => !state, true);

  const getTokenType = (tokenType) => {
    const visualType = singleCharacterTokens.includes(tokenType)
      ? "single-character"
      : tokenType;

    if (hideTypes) return undefined;
    if (!type) return visualType;
    return type.includes(visualType) ? visualType : "hidden";
  };

  return (
    <GridOverflowBox>
      {toggleable && (
        <Toggle onClick={toggle} layout>
          {showTypes ? "Hide types" : "Show types"}
        </Toggle>
      )}
      <Wrapper>
        {tokens.map((row, index) => (
          <ul key={`token-list-${index}`}>
            {row.map((token) => {
              const type = getTokenType(token.type);
              const active = type && type !== "hidden";
              return (
                <div key={`${token.type}-${index}-${token.value}`}>
                  {active && showTypes && (
                    <TokenType
                      type={type}
                      animate={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {token.type}
                    </TokenType>
                  )}
                  <Token type={type} layout>
                    {token.value}
                  </Token>
                </div>
              );
            })}
          </ul>
        ))}
      </Wrapper>
    </GridOverflowBox>
  );
};

const Toggle = styled(motion.button, {
  position: "absolute",
  top: 0,
  left: 0,
  borderRadius: 4,
  fontWeight: "bold",
  padding: "$1 $2",
  color: "$gray11",
  fontSize: "$sm",
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "$gray7",
  },
});

const Wrapper = styled("div", {
  fontFamily: "$mono",

  ul: {
    listStyle: "none",
    display: "flex",
    gap: "$2",
    alignItems: "flex-end",

    "&:nth-child(2)": {
      marginLeft: "$8",
    },

    "&:not(:last-child)": {
      marginBottom: "$2",
    },
  },
});

const TokenType = styled(motion.p, {
  fontSize: "$sm",
  color: "$gray11",

  variants: {
    type: {
      keyword: {
        color: "$red10",
      },
      identifier: {
        color: "$blue10",
      },
      string: {
        color: "$green10",
      },
      "single-character": {
        color: "$gray11",
      },
    },
  },
});

const Token = styled(motion.li, {
  whiteSpace: "nowrap",
  padding: "$1 $2",
  background: "$gray2",
  borderRadius: 4,
  border: "1px solid $gray8",
  width: "fit-content",

  variants: {
    type: {
      keyword: {
        background: "$red7",
        borderColor: "$red8",
      },
      identifier: {
        background: "$blue8",
        borderColor: "$blue8",
      },
      "single-character": {
        background: "$gray6",
      },
      string: {
        background: "$green7",
        borderColor: "$green8",
      },
      hidden: {
        background: "$gray4",
        color: "$gray8",
        borderColor: "$gray7",
      },
    },
  },
});
