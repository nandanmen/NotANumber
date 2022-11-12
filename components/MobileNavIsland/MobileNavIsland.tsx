import React from "react";
import Link from "next/link";
import { FaListUl, FaPaperPlane, FaTimes } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { motion } from "framer-motion";

import type { Heading } from "~/lib/content.server";
import { styled } from "~/stitches.config";

import { FormEvent, FormState, useSubscribe } from "../SubscribeInput";

export const MobileNavIsland = ({ headings }: { headings: Heading[] }) => {
  const id = React.useId();

  const [activeHeading, setActiveHeading] = React.useState("Introduction");
  const [headingListOpen, setHeadingListOpen] = React.useState(false);
  const [subscribing, setSubscribing] = React.useState(false);

  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const [subscribe, { state, dispatch }] = useSubscribe();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    subscribe(emailInputRef.current.value);
  };

  return (
    <Wrapper>
      {headingListOpen && (
        <HeadingList
          as={motion.ul}
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
      {state === FormState.Done && (
        <SuccessText
          as={motion.div}
          animate={{ y: 2, opacity: 1 }}
          initial={{ y: 10, opacity: 0 }}
          style={{ x: "-50%" }}
        >
          Thanks! Check your inbox — we sent you a confirmation email.
        </SuccessText>
      )}
      <NavWrapper>
        <Link href="/">
          <HomeLink>NaN</HomeLink>
        </Link>
        <motion.div
          animate={{ y: subscribing ? -32 : 0 }}
          onAnimationComplete={() => {
            if (subscribing) {
              emailInputRef.current?.focus();
            } else {
              emailInputRef.current?.blur();
            }
          }}
        >
          <HeadingButton
            onClick={() => setHeadingListOpen(!headingListOpen)}
            hidden={subscribing}
            css={{ margin: "0 auto" }}
          >
            <FaListUl />
            <ActiveHeading>{activeHeading}</ActiveHeading>
          </HeadingButton>
          <SubscribeWrapper hidden={!subscribing} onSubmit={handleSubmit}>
            <label htmlFor={`${id}-subscribe-input`}>Email</label>
            <EmailInput
              id={`${id}-subscribe-input`}
              type="email"
              ref={emailInputRef}
              onChange={() => dispatch(FormEvent.Change)}
            />
          </SubscribeWrapper>
        </motion.div>
        <SubscribeControlsWrapper
          animate={{ x: subscribing ? 0 : 32 }}
          initial={{ x: 32 }}
        >
          {state === FormState.Loading ? (
            <IconWrapper
              disabled
              as={motion.span}
              animate={{ rotate: 360 }}
              transition={{
                type: "tween",
                duration: 1,
                ease: "linear",
                repeat: Infinity,
              }}
              css={{ marginLeft: "auto" }}
            >
              <CgSpinner />
            </IconWrapper>
          ) : (
            <>
              {state === FormState.Start && (
                <IconWrapper
                  onClick={() => {
                    if (!subscribing) {
                      setSubscribing(true);
                      setHeadingListOpen(false);
                    } else {
                      subscribe(emailInputRef.current.value);
                    }
                  }}
                >
                  <FaPaperPlane />
                </IconWrapper>
              )}
              <IconWrapper
                onClick={() => {
                  setSubscribing(false);
                  dispatch(FormEvent.Change);
                }}
                disabled={!subscribing}
                css={{ marginLeft: "auto" }}
              >
                <FaTimes />
              </IconWrapper>
            </>
          )}
        </SubscribeControlsWrapper>
      </NavWrapper>
    </Wrapper>
  );
};

const SubscribeControlsWrapper = styled(motion.div, {
  display: "flex",
  width: 64,
});

const SubscribeWrapper = styled("form", {
  height: 32,
  display: "flex",
  alignItems: "center",
  gap: "$2",
  fontSize: "$sm",

  variants: {
    hidden: {
      true: {
        opacity: 0,
        pointerEvents: "none",
      },
    },
  },
});

const EmailInput = styled("input", {
  border: "1px solid $gray8",
  background: "$gray4",
  borderRadius: 4,
  padding: 6,
  width: 200,
  transform: "translateY(-1px)",

  "&:focus": {
    borderColor: "$blue8",
  },
});

const Wrapper = styled("div", {
  position: "relative",
});

const TopNav = styled("div", {
  position: "absolute",
  bottom: "100%",
  left: "50%",
  width: "calc(100% - $space$4)",
  maxWidth: 500,
  padding: "$4",
  borderTopLeftRadius: "$base",
  borderTopRightRadius: "$base",
  boxShadow: "$md",
});

const SuccessText = styled(TopNav, {
  background: "$green4",
  border: "1px solid $green6",
  color: "$green11",
  textAlign: "center",
});

const HeadingList = styled(TopNav, {
  background: "$gray4",
  border: "1px solid $gray8",
  listStyle: "none",
  fontFamily: "$mono",

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

  variants: {
    hidden: {
      true: {
        opacity: 0,
        pointerEvents: "none",
      },
    },
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
  color: "$gray11",
  height: `calc(32px + $space$4)`,
  overflow: "hidden",
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

  variants: {
    disabled: {
      true: {
        pointerEvents: "none",
      },
    },
  },
});
