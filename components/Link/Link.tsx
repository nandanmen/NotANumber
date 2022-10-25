import React from "react";
import { styled } from "~/stitches.config";

type LinkProps = {
  href?: string;
  children: React.ReactNode;
};

export const Link = ({ href, children }: LinkProps) => {
  if (href?.startsWith("http")) {
    return (
      <LinkWrapper href={href} target="_blank" rel="noreferrer">
        {children}
      </LinkWrapper>
    );
  }
  return <LinkWrapper href={href}>{children}</LinkWrapper>;
};

const LinkWrapper = styled("a", {
  color: "$blue9",
  textDecoration: "none",
});
