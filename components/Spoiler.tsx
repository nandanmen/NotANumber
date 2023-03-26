import React from "react";
import { styled } from "~/stitches.config";
import { Content } from "./Content";
import { ToggleButton } from "./Visualizer";

export const Spoiler = ({ children }) => {
  const [revealed, setRevealed] = React.useState(false);
  if (revealed) return <>{children}</>;
  return (
    <Content css={{ position: "relative" }}>
      {children}
      <Box
        css={{
          position: "absolute",
          inset: -8,
          background: "rgba(0,0,0,0)",
          backdropFilter: "blur(4px)",
          borderRadius: "$base",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ToggleButton onClick={() => setRevealed(true)}>
          Reveal Answer
        </ToggleButton>
      </Box>
    </Content>
  );
};

const Box = styled("div", {});
