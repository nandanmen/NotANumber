"use client";

import Link from "next/link";
import { FramerMagicMotion } from "~/components/home/FramerMagicMotion";
import { TokenizerVisual } from "~/components/home/TokenizerVisual";
import { HowArraysWork } from "~/components/home/HowArraysWork";
import { Debugger } from "~/components/home/Debugger";
import { SlidingWindow } from "~/components/home/SlidingWindow";
import { FramerMotionKeys } from "~/components/home/FramerMotionKeys";
import { SvgPaths } from "~/components/home/SvgPaths";
import Balancer from "react-wrap-balancer";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { FaGithub, FaTwitter } from "react-icons/fa";
import * as styles from "./page.module.css";
import { BackgroundStripes } from "~/components/stripe-pattern";

const posts = [
  {
    post: {
      slug: "build-a-database",
      title: "Build Your Own Database",
      description:
        "How would you reinvent the database? In this post, we'll build a key-value database from the ground up.",
      editedAt: "2025-01-03",
    },
    children: null,
  },
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

function Post({
  post,
  onHover,
}: {
  post: (typeof posts)[number];
  onHover?: () => void;
}) {
  const [active, setHovering] = useState(false);
  return (
    <motion.li
      className="relative"
      onHoverStart={() => {
        setHovering(true);
        onHover?.();
      }}
      onHoverEnd={() => {
        setHovering(false);
      }}
    >
      <motion.div
        animate={{
          width: active ? 16 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 26.7,
          damping: 4.1,
          mass: 0.2,
        }}
        className={clsx(
          "w-px border border-gray8 border-l-0 absolute -top-px -bottom-px left-full z-10",
          active ? "bg-gray5" : "bg-gray4"
        )}
      />
      <div
        className={clsx(
          // @ts-ignore
          styles.post,
          "p-10 gap-6 relative",
          active ? "bg-gray5" : "bg-gray4"
        )}
      >
        <header className="basis-[270px] shrink-0 gap-4 z-20">
          <h1 className="font-serif text-3xl leading-[1.3]">
            <Balancer>{post.post.title}</Balancer>
          </h1>
          <p className="text-gray11 text-sm">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
              day: "numeric",
            }).format(new Date(post.post.editedAt))}
          </p>
        </header>
        <article className="grow">
          <p className="max-w-[450px]">{post.post.description}</p>
        </article>
        <motion.div
          animate={{
            x: active ? 16 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 26.7,
            damping: 4.1,
            mass: 0.2,
          }}
          className="flex items-center gap-4"
        >
          <Link href={post.post.slug}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M13.75 6.75L19.25 12L13.75 17.25"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 12H4.75"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </motion.li>
  );
}

export default function HomePage() {
  const [activePost, setActivePost] = useState(0);
  const currentVisual = posts[activePost]?.children;
  return (
    <div className="min-h-screen flex">
      <div
        className={clsx(
          // @ts-ignore
          styles.main
        )}
      >
        <aside className="p-10 border-b border-gray7 top-0 flex flex-col gap-6 relative">
          <div className="absolute top-0 bottom-0 left-full w-px bg-gray8 z-10" />
          <h1 className="font-serif text-[64px] leading-[1]">Not a Number</h1>
          <p className="leading-relaxed">
            <Balancer>
              Interactive blog posts on computer science and web development by{" "}
              <a
                className="underline underline-offset-2"
                href="https://twitter.com/nandafyi"
              >
                Nanda Syahrasyad.
              </a>
            </Balancer>
          </p>
          <button className="text-sm font-medium rounded-full bg-gray12 text-gray1 px-3 py-1.5 w-fit">
            Subscribe
          </button>
          <footer className="mt-auto flex justify-between items-end text-gray11">
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/nandanmen"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href="https://twitter.com/nandafyi"
                target="_blank"
                rel="noreferrer"
              >
                <FaTwitter />
              </a>
            </div>
            <p className="text-xs text-gray10 font-mono">
              © 2021 - {new Date().getFullYear()}
            </p>
          </footer>
        </aside>
        <ul className="divide-y divide-gray7 divide-dashed bg-gray4">
          {posts.map((post, i) => (
            <Post
              post={post}
              key={post.post.slug}
              onHover={() => setActivePost(i)}
            />
          ))}
        </ul>
      </div>
      <div className="h-screen sticky top-0 overflow-hidden px-8 flex items-center justify-center shrink-0 basis-[400px] grow">
        <BackgroundStripes />
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activePost}
            className="aspect-square w-full max-w-[550px]"
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
            exit={{ y: -100, opacity: 0, filter: "blur(10px)" }}
            transition={{
              type: "spring",
              stiffness: 26.7,
              damping: 4.1,
              mass: 0.2,
            }}
          >
            {currentVisual}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
