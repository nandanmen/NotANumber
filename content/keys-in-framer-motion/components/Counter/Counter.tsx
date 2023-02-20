import React from "react";
import { FullWidth } from "~/components/FullWidth";
import { Content, ToggleButton, Visualizer } from "~/components/Visualizer";
import { darkTheme, styled } from "~/stitches.config";

export const Counter = ({ withKey = false, children }) => {
  const [name, setName] = React.useState("John");
  return (
    <FullWidth>
      <Visualizer
        childBorders={false}
        css={{
          "--border-color": "$colors$gray8",

          border: "1px solid var(--border-color)",
          borderRadius: "$base",

          [`.${darkTheme} &`]: {
            "--border-color": "$colors$gray6",
          },
        }}
      >
        <Box
          css={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <BlockWrapper>{children}</BlockWrapper>
          <BlockWrapper css={{ display: "flex", flexDirection: "column" }}>
            <Content
              css={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "$10 0",
              }}
            >
              <_Counter name={name} key={withKey ? name : undefined} />
            </Content>
            <Box
              css={{
                padding: "$2",
                display: "flex",
                justifyContent: "center",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <ToggleButton
                onClick={() => setName(name === "Jane" ? "John" : "Jane")}
              >
                Change Name
              </ToggleButton>
            </Box>
          </BlockWrapper>
        </Box>
      </Visualizer>
    </FullWidth>
  );
};

const _Counter = ({ name }) => {
  const [count, setCount] = React.useState(0);
  return (
    <Box
      css={{
        width: 200,
        margin: "0 auto",
        height: "fit-content",
        border: "1px solid var(--border-color)",
        boxShadow: "$md",
        borderRadius: "$base",
        background: "$gray4",
        fontFamily: "$mono",

        [`.${darkTheme} &`]: {
          background: "$gray2",
        },
      }}
    >
      <Box
        as="p"
        css={{
          padding: "$4",
          borderBottom: "1px solid var(--border-color)",
          textAlign: "center",
        }}
      >
        {name}
      </Box>
      <Box
        as="h1"
        css={{
          padding: "$4",
          borderBottom: "1px solid var(--border-color)",
          background: "$gray2",
          fontSize: "$xl",
          textAlign: "center",

          [`.${darkTheme} &`]: {
            background: "$gray1",
          },
        }}
      >
        {count}
      </Box>
      <Box
        css={{
          padding: "$4",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ToggleButton
          onClick={() => {
            setCount(count + 1);
          }}
        >
          Increment
        </ToggleButton>
      </Box>
    </Box>
  );
};

const BlockWrapper = styled("div", {
  flex: `1 1 300px`,

  "&:first-child": {
    borderBottom: "1px solid var(--border-color)",

    "@md": {
      borderBottom: "none",
      borderRight: "1px solid var(--border-color)",
    },
  },

  pre: {
    border: `0 !important`,
    margin: `0 !important`,
  },
});

const Box = styled("div", {});
