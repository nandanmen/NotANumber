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
import { motion } from "framer-motion";
import { useState } from "react";

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

function Post({
  post,
  onHover,
}: {
  post: (typeof posts)[number];
  onHover?: () => void;
}) {
  return (
    <motion.li className="p-10 max-w-[50ch]" onHoverStart={onHover}>
      <h1 className="font-serif text-4xl mb-4 leading-[1.3]">
        <Balancer>{post.post.title}</Balancer>
      </h1>
      <p>{post.post.description}</p>
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray11 text-sm">
          {new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
            day: "numeric",
          }).format(new Date(post.post.editedAt))}
        </p>
        <Link
          href={post.post.slug}
          className="text-sm bg-gray12 text-gray1 rounded-full font-medium px-3 py-1.5"
        >
          Read more
        </Link>
      </div>
    </motion.li>
  );
}

export default function HomePage() {
  const [activePost, setActivePost] = useState(0);
  const currentVisual = posts[activePost].children;
  return (
    <div
      className="grid grid-cols-[min-content_1fr] gap-2 h-screen"
      // style={{ background: "url(/grid.svg)" }}
    >
      <aside className="border-r border-gray8 p-10 bg-gray4">
        <h1 className="font-serif text-[64px] leading-[1]">Not a Number</h1>
        <p className="leading-relaxed mt-6">
          Interactive blog posts on computer science and web development, by
          Nanda Syahrasyad.
        </p>
      </aside>
      <div className="flex gap-2">
        <ul className="divide-y divide-gray7 divide-dashed bg-gray4 border-x border-gray7 shrink-0 h-screen overflow-y-auto">
          {posts
            .filter((_, i) => i % 2 === 0)
            .map((post, i) => (
              <Post
                post={post}
                key={post.post.slug}
                onHover={() => setActivePost(i * 2)}
              />
            ))}
        </ul>
        <ul className="divide-y divide-gray7 divide-dashed bg-gray4 border-x border-gray7 shrink-0 h-screen overflow-y-auto">
          {posts
            .filter((_, i) => i % 2 !== 0)
            .map((post, i) => (
              <Post
                post={post}
                key={post.post.slug}
                onHover={() => setActivePost(i * 2 + 1)}
              />
            ))}
        </ul>
        <div
          style={{ background: "url(/grid.svg)" }}
          className="w-full h-full border-l border-gray8 overflow-hidden relative"
        >
          <div className="aspect-square absolute h-[500px] top-1/2 -translate-y-1/2 right-8">
            {currentVisual}
          </div>
        </div>
      </div>
    </div>
  );
}
