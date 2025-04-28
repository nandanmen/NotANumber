import React from "react";
import Head from "next/head";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";

import { styled } from "~/stitches.config";
import { BASE_URL } from "~/lib/config";
import { Post } from "~/components/Post";
import { SubscribeButton } from "~/components/SubscribeButton";

import { FramerMagicMotion } from "~/components/home/FramerMagicMotion";
import { TokenizerVisual } from "~/components/home/TokenizerVisual";
import { HowArraysWork } from "~/components/home/HowArraysWork";
import { Debugger } from "~/components/home/Debugger";
import { SlidingWindow } from "~/components/home/SlidingWindow";
import { FramerMotionKeys } from "~/components/home/FramerMotionKeys";
import { DynamicIsland } from "~/components/MobileNavIsland";
import { SvgPaths } from "~/components/home/SvgPaths";

const posts = [
  {
    post: {
      slug: "svg-paths",
      title: "A Deep Dive Into SVG Path Commands",
      description:
        "The mystical d attribute in SVG paths is actually a series of small commands. In this guide, we'll take a look at each path command and how we can use them to draw icons.",
      editedAt: "2023-07-04",
    },
    children: <SvgPaths />,
  },
  {
    post: {
      slug: "keys-in-framer-motion",
      title: "The Power of Keys in Framer Motion",
      description:
        "The React key prop is often only used to suppress React warnings, but it's actually a super powerful tool when used together with Framer Motion. In this post, we'll explore how to use it to make some pretty cool animations.",
      editedAt: "2023-02-22",
    },
    children: <FramerMotionKeys />,
  },
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
    children: <SlidingWindow />,
  },
];

export default function HomePage() {
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
          <Links>
            <SocialLinks />
          </Links>
          <Title>
            Not a Number<span>By Nanda Syahrasyad</span>
          </Title>
          <SubscribeWrapper>
            <SubscribeButton />
          </SubscribeWrapper>
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
      <IslandWrapper>
        <DynamicIsland
          css={{
            borderRadius: "calc($radii$base + 4px)",
            height: "auto",
            display: "flex",
            alignItems: "center",
            color: "$gray12",
          }}
        >
          <MobileSocialWrapper>
            <SocialLinks />
          </MobileSocialWrapper>
          <SubscribeButton small />
        </DynamicIsland>
      </IslandWrapper>
    </PageWrapper>
  );
}

const SocialLinks = () => {
  return (
    <>
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
    </>
  );
};

const MobileSocialWrapper = styled("ul", {
  display: "flex",
  gap: "$2",
  padding: "0 $2",
  listStyle: "none",
  fontSize: "$xl",
  transform: "translateY(3px)",

  a: {
    color: "inherit",
    textDecoration: "none",

    "&:hover": {
      color: "$blue9",
    },
  },
});

const IslandWrapper = styled("div", {
  position: "fixed",
  bottom: "$4",
  left: "$4",
  right: "$4",
  height: "auto",

  "@md": {
    display: "none",
  },
});

const SubscribeWrapper = styled("div", {
  display: "none",

  "@md": {
    display: "block",
  },
});

const Links = styled(motion.ul, {
  fontSize: "$xl",
  gap: "$4",
  display: "none",
  listStyle: "none",

  a: {
    color: "inherit",
    textDecoration: "none",

    "&:hover": {
      color: "$blue9",
    },
  },

  "@md": {
    display: "flex",
  },
});

const PageWrapper = styled("main", {
  $$gap: "$space$16",
  width: "fit-content",
  margin: "0 auto",
  padding: "0 $8",
  paddingBottom: "calc($$gap + $space$16)",
  maxWidth: "72rem",

  "@lg": {
    padding: "0 $16",
    paddingBottom: "calc($$gap + $space$24)",
  },

  "@media screen and (min-width: 75rem)": {
    maxWidth: "initial",
  },
});

const ContentWrapper = styled("div", {});

const Title = styled("h1", {
  fontFamily: "var(--font-serif)",
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
  justifyContent: "center",
  alignItems: "center",
  padding: "$12 0",
  marginBottom: "calc($$gap / 2)",

  "@md": {
    marginBottom: "$$gap",
    justifyContent: "space-between",
  },
});

const Posts = styled(motion.ul, {
  gridColumn: 2,

  "> :not(:last-child)": {
    marginBottom: "$$gap",
  },
});
