import Link from "next/link";

import { styled } from "~/stitches.config";

export const MobileBottomBar = () => {
  return (
    <Wrapper>
      <Item>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Item>
      <Item>
        <a
          href="https://github.com/narendrasss/NotANumber"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </Item>
      <Item>
        <a href="https://twitter.com/nandafyi" target="_blank" rel="noreferrer">
          Twitter
        </a>
      </Item>
    </Wrapper>
  );
};

const Wrapper = styled("ul", {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  position: "fixed",
  borderTop: "1px solid $gray8",
  width: "100vw",
  background: "$gray4",
  bottom: 0,
  padding: "$2 0",
  zIndex: 20,

  a: {
    color: "$gray11",
  },

  "@media (min-width: 72rem)": {
    display: "none",
  },
});

const Item = styled("li", {
  listStyle: "none",
  textAlign: "center",

  "&:not(:last-child)": {
    borderRight: "1px solid $gray8",
  },
});
