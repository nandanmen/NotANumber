import { styled } from "~/stitches.config";

export default function Index() {
  return (
    <Wrapper>
      <h1>Welcome to Remix</h1>
    </Wrapper>
  );
}

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
});
