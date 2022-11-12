import React from "react";
import { FaGithub, FaTwitter, FaArrowRight, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

import { styled } from "~/stitches.config";
import { Post } from "~/components/Post";
import { SubscribeInput } from "~/components/SubscribeInput";

import { Tokenizer } from "../_dist-content/tokenizer/components/Tokenizer";
import { CorrectedInverseAnimation } from "../content/magic-motion/components/CorrectedInverseAnimation";

const posts = [
  {
    post: {
      slug: "magic-motion",
      title: "Inside Framer's Magic Motion",
      description:
        "How does Framer Motion make layout changes look seamless? In this post, we're taking a deep dive into FLIP, the technique used by Framer Motion to animate changes in layout without sacrificing performance.",
      editedAt: "2022-10-25",
    },
    children: (
      <CorrectedInverseAnimation
        from={(width, container) => ({
          x: container.width - width - container.padding,
          y: container.height / 2 - width / 2,
        })}
        to={(width, container) => ({
          x: container.padding,
          y: container.height / 2 - width / 2,
        })}
        origin="topLeft"
      />
    ),
  },
  {
    post: {
      slug: "tokenizer",
      title: "Rebuilding Babel: The Tokenizer",
      description:
        "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
      editedAt: "2022-02-20",
    },
    children: (
      <Tokenizer
        name="singleCharacter"
        input="{ console.log() }"
        showKeywords={false}
      />
    ),
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/how-arrays-work",
      title: "How do Arrays Work?",
      description:
        "What goes on under the hood of the most popular data structure? In this post, we'll uncover the secrets of the array by reinventing one ourselves.",
      editedAt: "2021-11-13",
    },
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/debugger",
      title: "Building a Debugger",
      description:
        "If you want to build your own debugger, where would you start? In this post, we'll take a look at the inner workings of Playground — an online JS debugger.",
      editedAt: "2021-05-15",
    },
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/sliding-window",
      title: "The Sliding Window Pattern",
      description: "An interactive look at a classic array algorithm pattern.",
      editedAt: "2021-03-21",
    },
  },
];

export default function HomePage() {
  const [subscribing, toggle] = React.useReducer((state) => !state, false);
  return (
    <PageWrapper>
      <ContentWrapper>
        <Header>
          <Title>Not a Number</Title>
          <Description>
            An interactive blog on computer science and web development, by
            Nanda Syahrasyad.
          </Description>
          <div>
            <SubscribeButton onClick={toggle}>
              Subscribe to the newsletter{" "}
              {subscribing ? <FaTimes /> : <FaArrowRight />}
            </SubscribeButton>
            {subscribing && (
              <SubscribeWrapper
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              >
                <SubscribeInput />
              </SubscribeWrapper>
            )}
          </div>
          <Links layout>
            <li>
              <a
                href="https://github.com/narendrasss/NotANumber"
                target="_blank"
                rel="noreferrer"
                aria-label="Github"
              >
                <FaGithub />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/nandafyi"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
            </li>
          </Links>
        </Header>
        <Posts>
          {posts.map((post) => (
            <Post key={post.post.slug} {...post} />
          ))}
        </Posts>
      </ContentWrapper>
    </PageWrapper>
  );
}

const SubscribeButton = styled("button", {
  color: "$gray11",
  display: "flex",
  alignItems: "center",
  gap: "$1",
  fontWeight: "bold",
  cursor: "pointer",

  "&:hover": {
    color: "$blue9",
  },
});

const SubscribeWrapper = styled(motion.div, {
  marginTop: "$2",
  maxWidth: 400,
});

const Links = styled(motion.ul, {
  fontSize: "$xl",
  gap: "$4",
  display: "flex",
  listStyle: "none",

  a: {
    color: "inherit",
    textDecoration: "none",

    "&:hover": {
      color: "$blue9",
    },
  },
});

const PageWrapper = styled("main", {
  width: "fit-content",
  margin: "0 auto",
  padding: "$4",
  maxWidth: "42rem",

  "@media screen and (min-width: 75rem)": {
    maxWidth: "initial",
  },
});

const ContentWrapper = styled("div", {
  "@media screen and (min-width: 75rem)": {
    display: "grid",
    gridTemplateColumns: "24rem 42rem",
    gap: "$16",
  },
});

const Title = styled("h1", {
  fontFamily: "$serif",
  fontSize: "3rem",
  lineHeight: "$title",
  fontWeight: 500,
});

const Header = styled("header", {
  display: "flex",
  flexDirection: "column",
  gap: "$8",
  height: "fit-content",
  paddingBottom: "$8",
  borderBottom: "1px solid $gray8",
  marginBottom: "$8",

  "@media screen and (min-width: 75rem)": {
    paddingBottom: 0,
    borderBottom: "none",
    position: "fixed",
    maxWidth: "24rem",
    paddingRight: "$8",
    borderRight: "1px solid $gray8",
  },
});

const Description = styled("p", {
  lineHeight: "$body",
});

const Posts = styled(motion.ul, {
  gridColumn: 2,

  "> :not(:last-child)": {
    marginBottom: "$12",
  },
});
