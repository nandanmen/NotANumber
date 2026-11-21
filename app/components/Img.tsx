import type React from "react";
import { FullWidth } from "./FullWidth";

type ImgProps = {
  fullWidth?: boolean;
} & React.ComponentProps<"img">;

export const Img = ({ fullWidth = false, ...props }: ImgProps) => {
  const Wrapper = fullWidth ? FullWidth : "figure";
  return (
    <Wrapper>
      <img {...props} />
    </Wrapper>
  );
};
