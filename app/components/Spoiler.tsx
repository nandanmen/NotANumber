import React from "react";
import { Content } from "./Content";
import { ToggleButton } from "./Visualizer";

export const Spoiler = ({ children }) => {
  const [revealed, setRevealed] = React.useState(false);
  if (revealed) return <>{children}</>;
  return (
    <Content className="relative">
      {children}
      <div className="absolute -inset-2 flex items-center justify-center rounded-md bg-[rgba(0,0,0,0)] backdrop-blur-[4px]">
        <ToggleButton onClick={() => setRevealed(true)}>
          Reveal Answer
        </ToggleButton>
      </div>
    </Content>
  );
};
