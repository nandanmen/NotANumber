import { styled } from "~/stitches.config";

export const Root = ({ children }) => {
  return <RootWrapper className="note">{children}</RootWrapper>;
};

const RootWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "min(100%, 65ch) 1fr",
  position: "relative",

  "> *": {
    gridColumn: 1,
  },

  "> :not(:first-child, aside)": {
    marginTop: "$4",
  },

  "> aside": {
    marginTop: "$4",
  },

  "@md": {
    "> aside": {
      marginTop: 0,
      gridColumn: 2,
      gridRow: "1 / -1",
    },
  },
});

export const Content = ({ children }) => {
  return <Aside>{children}</Aside>;
};

const Aside = styled("aside", {
  color: "$gray11",

  "@md": {
    position: "absolute",
    fontSize: "$sm",
    paddingLeft: "$4",
  },
});
