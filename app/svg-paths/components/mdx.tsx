"use client";

import React from "react";
import { motion } from "framer-motion";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { PageSection } from "./page-section";
import { IndexProvider } from "./index-provider";
import { InteractiveCommand } from "./interactive-command";
import { CommandList } from "./command-list";
import { PathEditor } from "./path-editor";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { ArrowLeft, ArrowRight } from "./icons";

const baseComponents = {
  h1: (props) => <h1 className="text-3xl font-bold mb-8" {...props} />,
  h2: (props) => <h1 className="text-2xl font-bold" {...props} />,
  code: (props) => <code className="inline-code" {...props} />,
  pre: (props) => (
    <pre
      className="border border-gray8 bg-gray3 px-4 py-3 rounded-md"
      {...props}
    />
  ),
  ul: (props) => <ul className="list-disc ml-4" {...props} />,
  blockquote: (props) => (
    <blockquote className="bg-gray7 rounded-md px-4 py-3" {...props} />
  ),
  PageSection,
  InteractiveCommand,
  CommandList,
  PathEditor,
};

const sections = [
  "overview",
  "cursors",
  "lines",
  "bezier curves",
  "cubic curves",
  "arcs",
];

export const MDX = ({
  content,
  numSections,
  components,
  children,
}: {
  content: MDXRemoteSerializeResult;
  numSections: number;
  components?: Record<string, (props: unknown) => JSX.Element>;
  children?: React.ReactNode;
}) => {
  const pathName = usePathname();
  return (
    <IndexProvider numSections={numSections}>
      <article className="border-r border-gray8 leading-7 w-[68ch] max-w-[50vw]">
        <header className="px-16 pt-8 pb-2 sticky top-0 flex justify-between items-center z-50 text-gray11 bg-gray4">
          <h1 className="font-serif text-xl  hover:text-blue9">
            <Link href="/">NaN</Link>
          </h1>
          <div className="flex text-xl gap-2">
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
              href="https://twitter.com/nandafyi"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
            </a>
          </div>
        </header>
        <MDXRemote
          {...content}
          components={{ ...baseComponents, ...components }}
        />
        <Footer />
      </article>
      <div className="h-screen sticky top-0 flex flex-col">
        <header className="p-8">
          <nav>
            <ul className="flex">
              {sections.map((section) => {
                const href = toHref(section);
                return (
                  <li
                    key={section}
                    className={clsx(
                      "capitalize rounded-md py-1 px-2",
                      href === pathName ? "bg-gray7" : "text-gray10"
                    )}
                  >
                    <Link href={href}>{section}</Link>
                  </li>
                );
              })}
              <li className="ml-auto bg-green6 rounded-md py-1 px-2">
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
                  <span>Buy me a coffee</span>
                </motion.a>
              </li>
            </ul>
          </nav>
        </header>
        <div className="flex items-center justify-center w-full h-full pb-4 pl-4 select-none">
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
    <footer className="px-16 pb-8 flex text-gray11">
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
