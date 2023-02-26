import React from "react";

import { styled } from "~/stitches.config";

export function OrderedList({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"ol">) {
  return (
    <ListWrapper css={{ "--start": props.start }} {...props}>
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
    marginTop: "$2",
  },
});

const ListItem = styled("li", {
  counterIncrement: "counts 1",
  display: "flex",

  "&:before": {
    content: 'counter(counts) ". "', // {count}.
    paddingRight: "$4",
    fontFamily: "$mono",
    fontWeight: "500",
    color: "$gray11",
  },
});
