import React from "react";
import Link from "next/link";
import { FaListUl, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";

import type { Heading } from "~/lib/content.server";
import { styled } from "~/stitches.config";

import { useSubscribe } from "../SubscribeInput";

export const MobileNavIsland = ({ headings }: { headings: Heading[] }) => {
  const [activeHeading, setActiveHeading] = React.useState("Introduction");
  const [headingListOpen, setHeadingListOpen] = React.useState(false);

  React.useEffect(() => {
    const headingElements = headings.map((heading) => {
      return document.getElementById(heading.id);
    });
    console.log(headingElements);
  }, [headings]);

  return (
    <Wrapper>
      {headingListOpen && (
        <HeadingList
          animate={{ y: 2, opacity: 1 }}
          initial={{ y: 10, opacity: 0 }}
          style={{ x: "-50%" }}
        >
          <li>
            <button
              onClick={() => {
                setHeadingListOpen(false);
                setActiveHeading("Introduction");

                // Remove hash from URL and scroll to top
                history.pushState(
                  "",
                  document.title,
                  window.location.pathname + window.location.search
                );
                window.scrollTo(0, 0);
              }}
            >
              Introduction
            </button>
          </li>
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={() => {
                  setHeadingListOpen(false);
                  setActiveHeading(heading.text);
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </HeadingList>
      )}
      <NavWrapper>
        <Link href="/">
          <HomeLink>NaN</HomeLink>
        </Link>
        <HeadingButton onClick={() => setHeadingListOpen(!headingListOpen)}>
          <FaListUl />
          <ActiveHeading>{activeHeading}</ActiveHeading>
        </HeadingButton>
        <IconWrapper>
          <FaPaperPlane />
        </IconWrapper>
      </NavWrapper>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  position: "relative",
});

const HeadingList = styled(motion.ul, {
  position: "absolute",
  bottom: "100%",
  left: "50%",
  width: "calc(100% - $space$4)",
  maxWidth: 500,
  background: "$gray4",
  border: "1px solid $gray8",
  listStyle: "none",
  padding: "$6",
  borderTopLeftRadius: "$base",
  borderTopRightRadius: "$base",
  fontFamily: "$mono",
  boxShadow: "$md",

  "a, button": {
    color: "inherit",
    textDecoration: "none",
    display: "block",
    padding: "$1",
    width: "100%",

    "&:hover": {
      background: "$gray6",
    },
  },
});

const ActiveHeading = styled("span", {
  transform: "translateY(1px)",
});

const HeadingButton = styled("button", {
  display: "flex",
  gap: "$2",
  alignItems: "center",
  height: 32,
  padding: "0 $2",
  borderRadius: "$base",

  "&:hover": {
    backgroundColor: "$gray6",
  },
});

const NavWrapper = styled("nav", {
  position: "relative",
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
