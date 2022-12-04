import React from "react";
import Head from "next/head";
import { FaGithub, FaTwitter, FaArrowRight, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

import { styled } from "~/stitches.config";
import { BASE_URL } from "~/lib/config";
import { Post } from "~/components/Post";
import { SubscribeButton } from "~/components/SubscribeButton";

import { FramerMagicMotion } from "~/components/home/FramerMagicMotion";
import { TokenizerVisual } from "~/components/home/TokenizerVisual";
import { HowArraysWork } from "~/components/home/HowArraysWork";
import { Debugger } from "~/components/home/Debugger";

const posts = [
  {
    post: {
      slug: "magic-motion",
      title: "Inside Framer's Magic Motion",
      description:
        "How does Framer Motion make layout changes look seamless? In this post, we're taking a deep dive into FLIP, the technique used by Framer Motion to animate changes in layout without sacrificing performance.",
      editedAt: "2022-11-15",
    },
    children: <FramerMagicMotion />,
  },
  {
    post: {
      slug: "tokenizer",
      title: "Rebuilding Babel: The Tokenizer",
      description:
        "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
      editedAt: "2022-02-20",
    },
    children: <TokenizerVisual />,
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/how-arrays-work",
      title: "How do Arrays Work?",
      description:
        "What goes on under the hood of the most popular data structure? In this post, we'll uncover the secrets of the array by reinventing one ourselves.",
      editedAt: "2021-11-13",
    },
    children: <HowArraysWork />,
  },
  {
    post: {
      slug: "https://nan-archive.vercel.app/debugger",
      title: "Building a Debugger",
      description:
        "If you want to build your own debugger, where would you start? In this post, we'll take a look at the inner workings of Playground — an online JS debugger.",
      editedAt: "2021-05-15",
    },
    children: <Debugger />,
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
      <Head>
        <title>Not a Number</title>
        <meta
          name="description"
          content="An interactive blog on computer science and web development, by Nanda Syahrasyad."
        />
        <meta name="author" content="Nanda Syahrasyad" />
        <meta property="og:title" content="Not a Number" />
        <meta
          property="og:description"
          content="An interactive blog on computer science and web development, by Nanda Syahrasyad."
        />
        <meta property="og:image" content={`${BASE_URL}/og/index.png`} />
        <meta property="og:url" content={BASE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ContentWrapper>
        <Header>
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
          <Title>
            Not a Number<span>By Nanda Syahrasyad</span>
          </Title>
          <SubscribeButton />
        </Header>
        <Posts>
          {posts.map((post, index) => (
            <Post
              key={post.post.slug}
              direction={index % 2 ? "right" : "left"}
              {...post}
            />
          ))}
        </Posts>
      </ContentWrapper>
    </PageWrapper>
  );
}

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
  $$gap: "$space$24",
  width: "fit-content",
  margin: "0 auto",
  padding: "0 $16",
  paddingBottom: "calc($$gap + $space$32)",
  maxWidth: "72rem",

  "@media screen and (min-width: 75rem)": {
    maxWidth: "initial",
  },
});

const ContentWrapper = styled("div", {});

const Title = styled("h1", {
  fontFamily: "$serif",
  fontSize: "3rem",
  lineHeight: "$title",
  fontWeight: 500,

  span: {
    display: "block",
    fontSize: "$sm",
    fontFamily: "$sans",
    color: "$gray11",
    textAlign: "center",
    marginTop: "$2",
  },
});

const Header = styled("header", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "$12 0",
  marginBottom: "$$gap",
});

const Posts = styled(motion.ul, {
  gridColumn: 2,

  "> :not(:last-child)": {
    marginBottom: "$$gap",
  },
});
