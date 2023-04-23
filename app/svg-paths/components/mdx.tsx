"use client";

import React from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { PageSection } from "./page-section";
import { IndexProvider } from "./index-provider";
import { InteractiveCommand } from "./interactive-command";
import { CommandList } from "./command-list";
import { PathEditor } from "./path-editor";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { FaGit, FaGithub, FaTwitter } from "react-icons/fa";
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
  "animation",
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
      <article className="border-r border-gray8 leading-7">
        <header className="px-16 pt-8 sticky top-0 flex justify-between items-center">
          <h1 className="font-serif text-xl text-gray11">
            <Link href="/">NaN</Link>
          </h1>
          <div className="flex text-xl gap-2">
            <a
              href="https://twitter.com/nandafyi"
              target="_blank"
              rel="noreferrer"
            >
              <FaTwitter className="text-gray11" />
            </a>
            <a
              href="https://twitter.com/nandafyi"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub className="text-gray11" />
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
                  <li key={section}>
                    <Link
                      href={href}
                      className={clsx(
                        "capitalize py-1 px-2 rounded-md",
                        href === pathName ? "bg-gray7" : "text-gray10"
                      )}
                    >
                      {section}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>
        <div className="flex items-center justify-center w-full h-full p-8">
          <div className="h-full">{children}</div>
        </div>
      </div>
    </IndexProvider>
  );
};

const Footer = () => {
  const fullpath = usePathname();
  const path = fromHref(fullpath);
  const pathIndex = sections.indexOf(path);
  const prev = sections[pathIndex - 1];
  const next = sections[pathIndex + 1];
  return (
    <footer className="px-16 pb-8 flex justify-between text-gray11">
      <Link href={toHref(prev)} className="flex gap-2 items-center capitalize">
        <ArrowLeft />
        <span>{prev}</span>
      </Link>
      <Link href={toHref(next)} className="flex gap-2 items-center capitalize">
        <span>{next}</span>
        <ArrowRight />
      </Link>
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
