import React from "react";
import { styled } from "~/stitches.config";
import { PathPlayground } from "~/components/PathPlayground";

export default function PathsPage() {
  return (
    <Wrapper>
      <ContentWrapper>
        <aside>
          <Article>
            <h1>Cursors and Lines</h1>
            <p>
              All SVG paths revolve around the <strong>cursor</strong>. As
              commands are executed, the cursor moves around the canvas; drawing
              a path behind it.
            </p>
            <p>
              The cursor always starts at the origin <code>(0, 0)</code>, the
              top left corner. The <code>M</code>, or <strong>move</strong>,
              command lets you move the cursor to a new position:
            </p>
            <pre>
              <code>M 10 20</code>
            </pre>
          </Article>
        </aside>
        <Main>
          <PathPlayground />
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

const Article = styled("article", {
  borderRadius: "$base",
  background: "$gray2",
  height: "100%",
  padding: "$8",
  border: "1px solid $gray8",
  lineHeight: "$body",

  "> *": {
    marginBottom: "1em",
  },

  h1: {
    fontSize: "$xl",
    fontWeight: 800,
  },

  pre: {
    marginLeft: "-$8",
    marginRight: "-$8",
    background: "$gray4",
    padding: "$4 $8",
  },

  "code:not(pre code)": {
    background: "$gray6",
    padding: "$1",
    borderRadius: 4,
  },
});
