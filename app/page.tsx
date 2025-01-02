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
import { useId, useState } from "react";
import clsx from "clsx";

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

function StripePattern({
  size = 8,
  ...props
}: {
  size?: number;
} & React.ComponentPropsWithoutRef<"pattern">) {
  return (
    <defs>
      <pattern
        viewBox="0 0 10 10"
        width={size}
        height={size}
        patternUnits="userSpaceOnUse"
        {...props}
      >
        <line
          x1="0"
          y1="10"
          x2="10"
          y2="0"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      </pattern>
    </defs>
  );
}

function BackgroundStripes({
  className,
  patternProps,
}: {
  className?: string;
  patternProps?: React.ComponentPropsWithoutRef<"pattern">;
}) {
  const id = useId();
  return (
    <div className={clsx("absolute inset-0 text-gray6", className)}>
      <svg width="100%" height="100%">
        <StripePattern id={id} {...patternProps} />
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

function Post({
  post,
  onHover,
}: {
  post: (typeof posts)[number];
  onHover?: () => void;
}) {
  return (
    <motion.li className="p-10 grid grid-cols-3" onHoverStart={onHover}>
      <h1 className="font-serif text-3xl mb-4 leading-[1.3]">
        <Balancer>{post.post.title}</Balancer>
      </h1>
      <p className="ml-4">{post.post.description}</p>
      <div className="flex items-center gap-4">
        <p className="text-gray11 text-sm grow text-center">
          {new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
            day: "numeric",
          }).format(new Date(post.post.editedAt))}
        </p>
        <Link href={post.post.slug}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M13.75 6.75L19.25 12L13.75 17.25"
            ></path>
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 12H4.75"
            ></path>
          </svg>
        </Link>
        {/* <Link
          href={post.post.slug}
          className="text-sm bg-gray12 text-gray1 rounded-full font-medium px-3 py-1.5"
        >
          Read more
        </Link> */}
      </div>
    </motion.li>
  );
}

export default function HomePage() {
  const [activePost, setActivePost] = useState(0);
  const currentVisual = posts[activePost]?.children;
  return (
    <div className="grid grid-cols-[min-content_1fr_min-content] min-h-screen">
      <aside className="p-10 border-r border-gray7 sticky h-screen top-0">
        <h1 className="font-serif text-[64px] leading-[1]">Not a Number</h1>
        <p className="leading-relaxed mt-6">
          Interactive blog posts on computer science and
          <br /> web development by Nanda Syahrasyad.
        </p>
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
      <div className="w-full h-screen sticky top-0 border-l border-gray8 overflow-hidden px-8 flex items-center">
        <BackgroundStripes />
        <div className="aspect-square w-[400px]">{currentVisual}</div>
      </div>
    </div>
  );
}
