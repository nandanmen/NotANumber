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

  "> aside": {
    gridColumn: 2,
    gridRow: "1 / -1",
  },

  "> :not(:first-child, aside)": {
    marginTop: "$4",
  },
});

export const Content = ({ children }) => {
  return <Aside>{children}</Aside>;
};

const Aside = styled("aside", {
  position: "absolute",
  fontSize: "$sm",
  color: "$gray11",
});
