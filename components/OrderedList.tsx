"use client";

import React from "react";
import { styled } from "~/stitches.config";

export function OrderedList({ children }: { children: React.ReactNode }) {
  return (
    <ListWrapper>
      {React.Children.toArray(children)
        .filter(Boolean)
        .map((child: any, index) =>
          child.props ? (
            <ListItem key={index}>
              <div>{child.props.children}</div>
            </ListItem>
          ) : null
        )}
    </ListWrapper>
  );
}

const ListWrapper = styled("ol", {
  listStyle: "none",
  counterReset: "counts 0",

  "> :not([hidden]) ~ :not([hidden]), ol": {
    marginTop: "$1",
  },
});

const ListItem = styled("li", {
  counterIncrement: "counts 1",
  display: "flex",

  "&:before": {
    content: 'counter(counts) ". "', // {count}.
    paddingRight: "$3",
    fontFamily: "$mono",
    fontWeight: "500",
    color: "$gray11",
  },
});
