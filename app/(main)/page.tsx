"use client";

import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { FaGithub, FaTwitter } from "react-icons/fa";

import array from '../_images/array.png';
import debuggerImg from '../_images/debugger.png';
import slidingWindow from '../_images/sliding-window.png';
import tokenizer from '../_images/tokenizer.png';
import framerMagicMotion from '../_images/framer-magic-motion.png';
import framerMotionKeys from '../_images/framer-motion-keys.png';
import svgPaths from '../_images/svg-paths.png';

const posts = [
  /* {
    post: {
      slug: "build-a-database",
      title: "Build Your Own Database",
      description:
        "How would you reinvent the database? In this post, we'll build a key-value database from the ground up.",
      editedAt: "2025-01-03",
    },
    children: null,
  }, */
  /* {
    post: {
      slug: "https://svg-animations.how",
      title: "Interactive SVG Animations",
      description:
        "The mystical d attribute in SVG paths is actually a series of small commands. In this guide, we'll take a look at each path command and how we can use them to draw icons.",
      editedAt: "2023-07-04",
      image: svgPaths,
    },
    children: null,
  }, */
  {
    slug: "svg-paths",
    title: "A Deep Dive Into SVG Path Commands",
    description:
      "The mystical d attribute in SVG paths is actually a series of small commands. In this guide, we'll take a look at each path command and how we can use them to draw icons.",
    editedAt: "2023-07-04",
    image: svgPaths,
  },
  {
    slug: `keys-in-framer-motion`,
    title: "The Power of Keys in Framer Motion",
    description:
      "The React key prop is often only used to suppress React warnings, but it's actually a super powerful tool when used together with Framer Motion. In this post, we'll explore how to use it to make some pretty cool animations.",
    editedAt: "2023-02-22",
    image: framerMotionKeys,
  },
  {
    slug: `magic-motion`,
    title: "Inside Framer's Magic Motion",
    description:
      "How does Framer Motion make layout changes look seamless? In this post, we're taking a deep dive into FLIP, the technique used by Framer Motion to animate changes in layout without sacrificing performance.",
    editedAt: "2022-11-15",
    image: framerMagicMotion,
  },
  {
    slug: `tokenizer`,
    title: "Rebuilding Babel: The Tokenizer",
    description:
      "How do you build a modern JavaScript compiler from scratch? In this post, we'll rebuild the first piece of a compiler: the tokenizer.",
    editedAt: "2022-02-20",
    image: tokenizer,
  },
  {
    slug: "https://nan-archive.vercel.app/how-arrays-work",
    title: "How do Arrays Work?",
    description:
      "What goes on under the hood of the most popular data structure? In this post, we'll uncover the secrets of the array by reinventing one ourselves.",
    editedAt: "2021-11-13",
    image: array,
  },
  {
    slug: "https://nan-archive.vercel.app/debugger",
    title: "Building a Debugger",
    description:
      "If you want to build your own debugger, where would you start? In this post, we'll take a look at the inner workings of Playground — an online JS debugger.",
    editedAt: "2021-05-15",
    image: debuggerImg,
  },
  {
    slug: "https://nan-archive.vercel.app/sliding-window",
    title: "The Sliding Window Pattern",
    description: "An interactive look at a classic array algorithm pattern.",
    editedAt: "2021-03-21",
    image: slidingWindow,
  },
];

function Post({
  post,
}: {
  post: (typeof posts)[number];
}) {
  const [active, setHovering] = useState(false);
  const Component = post.slug.startsWith('https') ? 'a' : Link;
  return (
    <motion.li
      className="relative"
      onHoverStart={() => {
        setHovering(true);
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
          "w-px border border-gray8 border-l-0 absolute -top-px -bottom-px left-full z-10 hidden lg:block",
          active ? "bg-gray5" : "bg-gray4"
        )}
      />
      <Component
        href={post.slug}
        className={clsx(
          "lg:p-10 lg:gap-10 block space-y-4 md:flex md:space-y-0 md:gap-8 p-6 relative",
          active ? "bg-gray5" : "bg-gray4"
        )}
      >
        <img className="shrink-0 h-min" src={post.image.src} width="80" height="80" alt="" />
        <div className="space-y-4 xl:flex xl:space-y-0 xl:gap-10">
          <header className="basis-[270px] flex flex-col shrink-0 gap-2 z-20">
            <h1 className="font-serif text-3xl leading-[1.3]">
              <Balancer>{post.title}</Balancer>
            </h1>
            <p className="text-gray11 text-sm">
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
                day: "numeric",
              }).format(new Date(post.editedAt))}
            </p>
          </header>
          <article className="grow">
            <p className="max-w-[450px]">{post.description}</p>
          </article>
        </div>
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
          className="flex items-start lg:items-center ml-auto gap-4"
        >
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
        </motion.div>
      </Component>
    </motion.li>
  );
}

export default function HomePage() {
  return (
    <div
      className="lg:grid grid-cols-[320px_1fr]"
    >
      <aside className="p-6 pt-12 lg:p-10 border-gray8 top-0 flex flex-col gap-6 relative bg-gray4 border-b lg:border-b-0 lg:border-r-0 lg:sticky lg:h-screen">
        <h1 className="font-serif text-[64px] leading-[1]">Not a Number</h1>
        <div className="md:flex lg:block lg:space-y-6 space-y-6 md:space-y-0 items-center justify-between">
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
        </div>
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
      <ul className="divide-y divide-gray7 divide-dashed bg-gray4 border-l border-gray8">
        {posts.map((post) => (
          <Post
            post={post}
            key={post.slug}
          />
        ))}
      </ul>
    </div>
  );
}
