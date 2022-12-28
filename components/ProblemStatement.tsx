import { styled, darkTheme } from "~/stitches.config";

export function ProblemStatement({ children }) {
  return (
    <Wrapper>
      <Title>The Problem</Title>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled("aside", {
  padding: "$4",
  border: "1px solid $gray8",
  borderRadius: "$base",
  position: "relative",
  background: "$gray3",

  [`.${darkTheme} &`]: {
    background: "$gray2",
  },
});

const Title = styled("h4", {
  paddingBottom: "$2",
  marginBottom: "$3",
  borderBottom: "1px dashed $gray8",
});
