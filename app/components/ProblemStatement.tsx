import { styled } from "~/stitches.config";

export function ProblemStatement({ children }) {
  return (
    <Wrapper>
      <h4>The Problem</h4>
      <div>{children}</div>
    </Wrapper>
  );
}

const Wrapper = styled("aside", {
  padding: "$4",
  border: "1px solid $gray8",
  borderRadius: "$base",
});
