"use client";

import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { SubscribeButton } from "./subscribe";
import { posts, XIcon } from "./posts";

function Post({
  post,
}: {
  post: (typeof posts)[number];
}) {
  const [active, setHovering] = useState(false);
  const Component = post.slug.startsWith("https") ? "a" : Link;
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
          active ? "bg-gray5" : "bg-gray4",
        )}
      />
      <Component
        href={post.slug}
        className={clsx(
          "lg:p-10 lg:gap-10 block space-y-4 md:flex md:space-y-0 md:gap-8 p-6 relative",
          active ? "bg-gray5" : "bg-gray4",
        )}
      >
        <img
          className="shrink-0 h-min"
          src={post.image.src}
          width="80"
          height="80"
          alt=""
        />
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
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
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
    <div className="lg:grid grid-cols-[320px_1fr] bg-gray4 md:border-x border-gray8 relative">
      <aside className="p-6 pt-12 lg:p-10 border-gray8 top-0 flex flex-col gap-6 relative bg-gray4 border-b lg:border-b-0 lg:border-r-0 lg:sticky lg:h-screen">
        <h1 className="font-serif text-[64px] leading-[1]">Not a Number</h1>
        <div className="md:flex lg:block lg:space-y-8 space-y-6 md:space-y-0 items-center justify-between">
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
          <SubscribeButton />
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
      <div className="bg-gray4 lg:border-l border-gray8">
        <div className="p-6 lg:p-10 border-b border-gray7 border-dashed">
          <a
            className="flex gap-4 p-4 pr-0 bg-gray3 border border-gray8 border-dashed relative items-center hover:bg-gray2"
            href="https://svg-animations.how"
            target="_blank"
            rel="noreferrer"
          >
            <span className="flex flex-col lg:flex-row lg:gap-4 lg:items-center gap-1">
              <span className="font-medium">Interactive SVG Animations</span>
              <span className="text-sm">
                An interactive course on making whimsical SVGs and SVG
                animations.
              </span>
            </span>
            <svg
              className="ml-auto shrink-0"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
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
            <span className="text-gray9">
              <span className="absolute -top-2 -right-2">
                <XIcon />
              </span>
              <span className="absolute -top-2 -left-2">
                <XIcon />
              </span>
              <span className="absolute -bottom-2 -right-2">
                <XIcon />
              </span>
              <span className="absolute -bottom-2 -left-2">
                <XIcon />
              </span>
            </span>
          </a>
        </div>
        <ul className="divide-y divide-gray7 divide-dashed">
          {posts.map((post) => (
            <Post post={post} key={post.slug} />
          ))}
        </ul>
      </div>
    </div>
  );
}
