import Link from "next/link";
import { FaHome, FaListUl, FaPaperPlane } from "react-icons/fa";
import type { Heading } from "~/lib/content.server";
import { styled } from "~/stitches.config";

import { useSubscribe } from "../SubscribeInput";

export const MobileNavIsland = ({ headings }: { headings: Heading[] }) => {
  return (
    <Wrapper>
      <Link href="/">
        <HomeLink>NaN</HomeLink>
      </Link>
      <HeadingButton>
        <FaListUl />
        <ActiveHeading>Introduction</ActiveHeading>
      </HeadingButton>
      <IconWrapper>
        <FaPaperPlane />
      </IconWrapper>
    </Wrapper>
  );
};

const ActiveHeading = styled("span", {
  transform: "translateY(1px)",
});

const HeadingButton = styled("button", {
  display: "flex",
  gap: "$2",
  alignItems: "center",
  height: "100%",
  padding: "0 $2",
  borderRadius: "$base",

  "&:hover": {
    backgroundColor: "$gray6",
  },
});

const Wrapper = styled("nav", {
  background: "$gray3",
  border: "1px solid $gray8",
  boxShadow: "$md",
  borderRadius: "$lg",
  padding: "$2",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "$gray11",
});

const HomeLink = styled("a", {
  fontFamily: "$serif",
  fontWeight: 600,
  height: "100%",
  paddingLeft: "$2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "translateY(1px)",
  cursor: "pointer",

  "&:hover": {
    color: "$blue9",
  },
});

const IconWrapper = styled("button", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  width: 32,
  height: 32,
  borderRadius: "$base",

  "&:hover": {
    background: "$gray6",
  },
});
