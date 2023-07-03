"use client";

import React from "react";
import { motion } from "framer-motion";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { PageSection } from "./page-section";
import { IndexProvider } from "./index-provider";
import { InteractiveCommand } from "./interactive-command";
import { PathEditor } from "./path-editor";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { ArrowLeft, ArrowRight } from "./icons";
import { CommandListFromSource, CommandList } from "./command-list";
import { PlaySlider, PlaySliderFromSource } from "./play-slider";
import { PracticeQuestionEditor, PracticeQuestion } from "./path-practice";
import { Svg } from "./svg";
import { PathHoverVisual } from "./path-hover-visual";
import styles from "./page-section.module.css";
import { useSession } from "../provider";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const baseComponents = {
  h1: (props) => <h1 className="text-3xl font-bold" {...props} />,
  h2: (props) => <h2 className="text-2xl font-bold" {...props} />,
  h3: (props) => <h3 className="text-xl font-bold" {...props} />,
  code: (props) => <code className="inline-code" {...props} />,
  pre: (props) => (
    <pre
      className="border border-gray8 bg-gray3 px-4 py-3 rounded-md overflow-x-auto"
      {...props}
    />
  ),
  ul: (props) => <ul className="list-disc ml-4" {...props} />,
  a: (props) => (
    <a
      className="underline underline-offset-2 text-gray11 hover:text-blue10"
      target="_blank"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="bg-gray7 rounded-md px-4 py-3" {...props} />
  ),
  PageSection,
  InteractiveCommand,
  PathEditor,
  PracticeQuestionEditor,
  PracticeQuestion,
  Svg,
  CommandListFromSource,
  CommandList,
  PlaySlider,
  PlaySliderFromSource,
  PathHoverVisual,
};

const sections = [
  "overview",
  "cursors",
  "lines",
  "bezier curves",
  "cubic curves",
  "arcs",
  "challenge",
];

export const MDX = ({
  content,
  numSections,
  components,
  children,
  prefix,
}: {
  content: MDXRemoteSerializeResult;
  numSections: number;
  components?: Record<string, (props: unknown) => JSX.Element>;
  children?: React.ReactNode;
  prefix?: React.ReactNode;
}) => {
  const pathName = usePathname();
  const session = useSession();
  return (
    <IndexProvider numSections={numSections}>
      <article className="lg:border-r lg:border-gray8 leading-7 lg:w-[55ch] xl:w-[68ch] w-full lg:max-w-[50vw]">
        <header className="px-8 lg:px-16 pt-8 pb-2 sticky top-0 flex items-center z-50 text-gray11 bg-gray4 mb-8">
          <h1 className="font-serif text-xl  hover:text-blue9">
            <Link href="/">NaN</Link>
          </h1>
          <motion.div className="flex text-xl gap-2 ml-auto" layout>
            <a
              className="hover:text-blue9"
              href="https://twitter.com/nandafyi"
              target="_blank"
              rel="noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              className="hover:text-blue9"
              href="https://github.com/narendrasss/NotANumber"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
            </a>
          </motion.div>
          {session?.user && (
            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  className="shrink-0 ml-4"
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                >
                  <Image
                    width="24"
                    height="24"
                    className="rounded-full"
                    src={session.user.image}
                    alt={session.user.username}
                  />
                </motion.button>
              </PopoverTrigger>
              <PopoverContent>
                <button className="w-full py-1" onClick={() => signOut()}>
                  Sign out
                </button>
              </PopoverContent>
            </Popover>
          )}
        </header>
        {prefix && (
          <div
            className={clsx(
              "p-8 lg:p-16 lg:py-0 grid grid-cols-[1fr_min(100%,60ch)_1fr]",
              styles.section,
              styles.prefix
            )}
          >
            {prefix}
          </div>
        )}
        <MDXRemote
          {...content}
          components={{ ...baseComponents, ...components }}
        />
        <Footer />
        <nav className="fixed lg:hidden bottom-0 w-[100vw] overflow-x-auto px-8 py-4 bg-gray4/70 border-t border-gray6 backdrop-blur-md">
          <ul className="flex w-fit md:mx-auto">
            {sections.map((section) => {
              const href = toHref(section);
              return (
                <li
                  key={section}
                  className={clsx(
                    "capitalize rounded-md py-1 px-2 font-semibold h-fit leading-none relative",
                    href === pathName
                      ? "before:absolute before:top-full before:left-2 before:right-2 before:h-[2px] before:bg-current"
                      : "text-gray10"
                  )}
                >
                  <Link href={href}>{section}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </article>
      <div className="hidden h-screen sticky top-0 lg:flex flex-col overflow-hidden">
        <header className="p-8 w-full">
          <nav className="flex">
            <ul className="flex overflow-x-auto">
              {sections.map((section) => {
                const href = toHref(section);
                return (
                  <li
                    key={section}
                    className={clsx(
                      "capitalize rounded-md py-1 px-2 font-semibold h-fit",
                      href === pathName ? "bg-gray7" : "text-gray10"
                    )}
                  >
                    <Link href={href}>{section}</Link>
                  </li>
                );
              })}
            </ul>
            <div className="ml-auto text-gray11 rounded-md py-1 px-2 h-fit shrink-0">
              <motion.a
                className="flex items-center text-sm font-bold gap-1"
                href="https://ko-fi.com/nandafyi"
                target="_blank"
                rel="noreferrer"
                whileHover="hover"
                initial="idle"
                transition={{
                  staggerChildren: 0.1,
                }}
              >
                <CoffeeIcon />
                <span className="hidden coffee:block">Buy me a coffee</span>
              </motion.a>
            </div>
          </nav>
        </header>
        <div className="flex items-center justify-center w-full h-full pb-4 pl-4 select-none overflow-hidden">
          <div className="h-full">{children}</div>
        </div>
      </div>
    </IndexProvider>
  );
};

const CoffeeIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.g
        variants={{
          idle: { y: -2 },
          hover: { y: 0 },
        }}
      >
        <path d="M19.25 17.25V8.75H7.75V17.25C7.75 18.3546 8.64543 19.25 9.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25Z" />
        <path d="M7.5 10.75H6.75C5.64543 10.75 4.75 11.6454 4.75 12.75V14.25C4.75 15.3546 5.64543 16.25 6.75 16.25H7.5" />
      </motion.g>
      <motion.path
        variants={{ idle: { opacity: 0, y: 4 }, hover: { opacity: 1, y: 0 } }}
        d="M13.25 4.75V6.25"
      />
      <motion.path
        variants={{ idle: { opacity: 0, y: 4 }, hover: { opacity: 1, y: 0 } }}
        d="M8.25 4.75C8.25 4.75 9.25 4.75 9.25 6.25"
      />
      <motion.path
        variants={{ idle: { opacity: 0, y: 4 }, hover: { opacity: 1, y: 0 } }}
        d="M18.25 4.75C18.25 4.75 17.25 4.75 17.25 6.25"
      />
    </svg>
  );
};

const Footer = () => {
  const fullpath = usePathname();
  const path = fromHref(fullpath);
  const pathIndex = sections.indexOf(path);
  const prev = sections[pathIndex - 1];
  const next = sections[pathIndex + 1];
  return (
    <footer className="w-[calc(60ch+theme(space.8)*2)] px-8 max-w-[100vw] mx-auto lg:px-16 mb-32 lg:mb-16 flex text-gray11">
      {prev && (
        <Link
          href={toHref(prev)}
          className="flex gap-2 items-center capitalize"
        >
          <ArrowLeft />
          <span>{prev}</span>
        </Link>
      )}
      {next && (
        <Link
          href={toHref(next)}
          className="flex gap-2 items-center capitalize ml-auto"
        >
          <span>{next}</span>
          <ArrowRight />
        </Link>
      )}
    </footer>
  );
};

const toHref = (section: string) => {
  const path = section === "overview" ? "" : `/${section.replaceAll(" ", "-")}`;
  return `/svg-paths${path}`;
};

const fromHref = (path: string) => {
  return path.split("/svg-paths/")[1]?.replaceAll("-", " ") || "overview";
};
