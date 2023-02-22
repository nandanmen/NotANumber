import React from "react";
import Image from "next/image";
import { FullWidth } from "./FullWidth";

type ImgProps = {
  fullWidth?: boolean;
} & React.ComponentProps<typeof Image>;

export const Img = ({ fullWidth = false, ...props }: ImgProps) => {
  const Wrapper = fullWidth ? FullWidth : "figure";
  return (
    <Wrapper>
      <Image {...props} />
    </Wrapper>
  );
};
