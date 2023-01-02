import React from "react";
import { styled } from "~/stitches.config";
import { PathPlayground } from "~/components/PathPlayground";

export default function PathsPage() {
  const [commands, setCommands] = React.useState(`M 10 20\nL 30 40`);
  return (
    <Wrapper>
      <ContentWrapper>
        <aside>
          <Editor
            value={commands}
            onChange={(evt) => setCommands(evt.target.value)}
          />
        </aside>
        <Main>
          <PathPlayground commands={commands} />
        </Main>
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled("div", {
  $$padding: "$space$12",
  width: "fit-content",
  minHeight: "100vh",
  margin: "0 auto",
  padding: "$$padding",
});

const ContentWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "50ch 1fr",
  height: "100%",
  minHeight: "calc(100vh - $$padding * 2)",
  gap: "$12",
});

const Main = styled("main", {
  overflowX: "auto",
});

const Editor = styled("textarea", {
  borderRadius: "$base",
  background: "$gray2",
  height: "100%",
  padding: "$8",
  border: "1px solid $gray8",
  display: "block",
  width: "100%",
  fontFamily: "$mono",
  fontSize: "$lg",
  lineHeight: 1.5,
});
